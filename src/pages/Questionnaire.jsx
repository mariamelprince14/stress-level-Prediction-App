import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  QuestionCard,
  RadioGroup,
  NumberInput,
  RangeSlider,
  StressorSelector,
  YesNoToggle,
  ProgressBar,
  LoadingSpinner,
} from '../components';
import { questionsConfig, getInitialAnswers } from '../data/questionsConfig';
import { isFieldAnswered, validateQuestionnaire } from '../utils/validation';
import styles from './Questionnaire.module.css';

/**
 * Questionnaire page - Main assessment form
 * All questions are displayed on one scrollable page
 * Uses centralized state management with useState
 */
const Questionnaire = () => {
  const navigate = useNavigate();
  
  // Centralized state for all answers
  const [answers, setAnswers] = useState(getInitialAnswers());
  
  // Loading state for form submission
  const [isLoading, setIsLoading] = useState(false);
  
  // Validation error state
  const [validationError, setValidationError] = useState(null);
  const [missingFields, setMissingFields] = useState([]);
  
  // Refs for scrolling to unanswered questions
  const questionRefs = useRef({
    ageRange: null,
    gender: null,
    currentStatus: null,
    sleepHours: null,
    workStudyHours: null,
    hobbiesHours: null,
    commuteTime: null,
    tasksToComplete: null,
    taskDifficulty: null,
    feelingUnderPressure: null,
    socialInteractionHours: null,
    interactionQuality: null,
    homeEnvironment: null,
    stressfulEvents: null,
    stressTriggers: null,
    overthinkingFrequency: null,
  });

  // Update handler for individual fields
  const updateAnswer = (fieldId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
    // Clear validation error when user starts answering
    if (validationError) {
      setValidationError(null);
      setMissingFields([]);
    }
  };

  // Calculate progress based on answered questions
  const progress = useMemo(() => {
    const allQuestions = Object.values(questionsConfig).flatMap((section) =>
      Object.values(section.questions)
    );
    
    const answeredCount = allQuestions.filter((question) => {
      // Skip dependent questions if their condition isn't met
      if (question.dependsOn) {
        const dependentValue = answers[question.dependsOn.field];
        if (dependentValue !== question.dependsOn.value) {
          return true; // Count as answered (not required)
        }
      }
      return isFieldAnswered(answers[question.id]);
    }).length;
    
    return (answeredCount / allQuestions.length) * 100;
  }, [answers]);

  // Scroll to first unanswered question
  const scrollToFirstUnanswered = (errors) => {
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField && questionRefs.current[firstErrorField]) {
      questionRefs.current[firstErrorField].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all answers
    const validation = validateQuestionnaire(answers, questionsConfig);
    
    if (!validation.isValid) {
      setValidationError('Please answer all questions before viewing your results.');
      setMissingFields(validation.missingFields);
      scrollToFirstUnanswered(validation.errors);
      return;
    }
    
    // Clear any previous errors
    setValidationError(null);
    setMissingFields([]);
    setIsLoading(true);
    
    // API URL - defaults to localhost for development
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    try {
      // Send data to backend for prediction
      const response = await fetch(`${API_URL}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers),
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('='.repeat(60));
        console.log('🎯 PREDICTION RESULT:');
        console.log(data.prediction);
        console.log('='.repeat(60));
        
        // Navigate to results with ML prediction
        navigate('/result', { 
          state: { 
            stressLevel: data.prediction.predicted_label,
            probabilities: data.prediction.probabilities,
            answers 
          } 
        });
      } else {
        console.error('Backend error:', data.error);
        setValidationError('Unable to get prediction. Please try again.');
      }
    } catch (error) {
      console.error('Failed to connect to backend:', error);
      setValidationError('Unable to connect to prediction service. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <button 
          className={styles.backButton} 
          onClick={handleBack}
          aria-label="Go back"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className={styles.headerTitle}>Stress Assessment</h1>
        <ProgressBar progress={progress} className={styles.progress} />
      </header>

      {/* Validation Error Banner */}
      {validationError && (
        <div className={styles.errorBanner}>
          <div className={styles.errorIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 8v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="16" r="1" fill="currentColor" />
            </svg>
          </div>
          <div className={styles.errorContent}>
            <p className={styles.errorMessage}>{validationError}</p>
            {missingFields.length > 0 && (
              <p className={styles.errorFields}>
                Unanswered: {missingFields.join(', ')}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Main content */}
      <main className={styles.main}>
        <div className={styles.intro}>
          <h2 className={styles.title}>Weekly Check-in</h2>
          <p className={styles.subtitle}>
            Your answers help us tailor your relaxation plan.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Profile Section */}
          <QuestionCard
            title={questionsConfig.profile.sectionTitle}
            icon={questionsConfig.profile.sectionIcon}
          >
            <div ref={(el) => (questionRefs.current.ageRange = el)}>
              <RadioGroup
                name="ageRange"
                label="Age Range"
                options={questionsConfig.profile.questions.ageRange.options}
                value={answers.ageRange}
                onChange={(value) => updateAnswer('ageRange', value)}
                variant="chip"
              />
            </div>
            
            <div ref={(el) => (questionRefs.current.gender = el)}>
              <RadioGroup
                name="gender"
                label="Gender"
                options={questionsConfig.profile.questions.gender.options}
                value={answers.gender}
                onChange={(value) => updateAnswer('gender', value)}
                variant="chip"
              />
            </div>
            
            <div ref={(el) => (questionRefs.current.currentStatus = el)}>
              <RadioGroup
                name="currentStatus"
                label="Current Status"
                options={questionsConfig.profile.questions.currentStatus.options}
                value={answers.currentStatus}
                onChange={(value) => updateAnswer('currentStatus', value)}
                variant="list"
              />
            </div>
          </QuestionCard>

          {/* Routine Section */}
          <QuestionCard
            title={questionsConfig.routine.sectionTitle}
            icon={questionsConfig.routine.sectionIcon}
          >
            <div ref={(el) => (questionRefs.current.sleepHours = el)}>
              <NumberInput
                name="sleepHours"
                label={questionsConfig.routine.questions.sleepHours.label}
                sublabel={questionsConfig.routine.questions.sleepHours.sublabel}
                value={answers.sleepHours}
                onChange={(value) => updateAnswer('sleepHours', value)}
                min={questionsConfig.routine.questions.sleepHours.min}
                max={questionsConfig.routine.questions.sleepHours.max}
              step={questionsConfig.routine.questions.sleepHours.step}
            />
            </div>
            
            <div ref={(el) => (questionRefs.current.workStudyHours = el)}>
              <NumberInput
                name="workStudyHours"
                label={questionsConfig.routine.questions.workStudyHours.label}
                sublabel={questionsConfig.routine.questions.workStudyHours.sublabel}
                value={answers.workStudyHours}
                onChange={(value) => updateAnswer('workStudyHours', value)}
                min={questionsConfig.routine.questions.workStudyHours.min}
                max={questionsConfig.routine.questions.workStudyHours.max}
                step={questionsConfig.routine.questions.workStudyHours.step}
              />
            </div>
            
            <div ref={(el) => (questionRefs.current.hobbiesHours = el)}>
              <NumberInput
                name="hobbiesHours"
                label={questionsConfig.routine.questions.hobbiesHours.label}
                sublabel={questionsConfig.routine.questions.hobbiesHours.sublabel}
                value={answers.hobbiesHours}
                onChange={(value) => updateAnswer('hobbiesHours', value)}
                min={questionsConfig.routine.questions.hobbiesHours.min}
                max={questionsConfig.routine.questions.hobbiesHours.max}
                step={questionsConfig.routine.questions.hobbiesHours.step}
              />
            </div>
            
            <div ref={(el) => (questionRefs.current.commuteTime = el)}>
              <RadioGroup
                name="commuteTime"
                label={questionsConfig.routine.questions.commuteTime.label}
                sublabel={questionsConfig.routine.questions.commuteTime.sublabel}
                options={questionsConfig.routine.questions.commuteTime.options}
                value={answers.commuteTime}
                onChange={(value) => updateAnswer('commuteTime', value)}
                variant="chip"
              />
            </div>
          </QuestionCard>

          {/* Load & Pressure Section */}
          <QuestionCard
            title={questionsConfig.loadPressure.sectionTitle}
            icon={questionsConfig.loadPressure.sectionIcon}
          >
            <div ref={(el) => (questionRefs.current.tasksToComplete = el)}>
              <NumberInput
                name="tasksToComplete"
                label={questionsConfig.loadPressure.questions.tasksToComplete.label}
                value={answers.tasksToComplete}
                onChange={(value) => updateAnswer('tasksToComplete', value)}
                min={questionsConfig.loadPressure.questions.tasksToComplete.min}
                max={questionsConfig.loadPressure.questions.tasksToComplete.max}
                step={questionsConfig.loadPressure.questions.tasksToComplete.step}
                integerOnly={questionsConfig.loadPressure.questions.tasksToComplete.integerOnly}
              />
            </div>
            
            <div ref={(el) => (questionRefs.current.taskDifficulty = el)}>
              <RadioGroup
                name="taskDifficulty"
                label={questionsConfig.loadPressure.questions.taskDifficulty.label}
                options={questionsConfig.loadPressure.questions.taskDifficulty.options}
                value={answers.taskDifficulty}
                onChange={(value) => updateAnswer('taskDifficulty', value)}
                variant="button"
              />
            </div>
            
            <div ref={(el) => (questionRefs.current.feelingUnderPressure = el)}>
              <RadioGroup
                name="feelingUnderPressure"
                label={questionsConfig.loadPressure.questions.feelingUnderPressure.label}
                options={questionsConfig.loadPressure.questions.feelingUnderPressure.options}
                value={answers.feelingUnderPressure}
                onChange={(value) => updateAnswer('feelingUnderPressure', value)}
                variant="button"
              />
            </div>
          </QuestionCard>

          {/* Social & Home Section */}
          <QuestionCard
            title={questionsConfig.socialHome.sectionTitle}
            icon={questionsConfig.socialHome.sectionIcon}
          >
            <div ref={(el) => (questionRefs.current.socialInteractionHours = el)}>
              <NumberInput
                name="socialInteractionHours"
                label={questionsConfig.socialHome.questions.socialInteractionHours.label}
                value={answers.socialInteractionHours}
                onChange={(value) => updateAnswer('socialInteractionHours', value)}
                min={questionsConfig.socialHome.questions.socialInteractionHours.min}
                max={questionsConfig.socialHome.questions.socialInteractionHours.max}
                step={questionsConfig.socialHome.questions.socialInteractionHours.step}
              />
            </div>
            
            <div ref={(el) => (questionRefs.current.interactionQuality = el)}>
              <RadioGroup
                name="interactionQuality"
                label={questionsConfig.socialHome.questions.interactionQuality.label}
                options={questionsConfig.socialHome.questions.interactionQuality.options}
                value={answers.interactionQuality}
                onChange={(value) => updateAnswer('interactionQuality', value)}
                variant="chip"
              />
            </div>
            
            <div ref={(el) => (questionRefs.current.homeEnvironment = el)} className={styles.fieldWithSublabel}>
              <RadioGroup
                name="homeEnvironment"
                label={questionsConfig.socialHome.questions.homeEnvironment.label}
                options={questionsConfig.socialHome.questions.homeEnvironment.options}
                value={answers.homeEnvironment}
                onChange={(value) => updateAnswer('homeEnvironment', value)}
                variant="button"
              />
              <span className={styles.fieldSublabel}>
                {questionsConfig.socialHome.questions.homeEnvironment.sublabel}
              </span>
            </div>
          </QuestionCard>

          {/* Mental State Section */}
          <QuestionCard
            title={questionsConfig.mentalState.sectionTitle}
            icon={questionsConfig.mentalState.sectionIcon}
          >
            <div ref={(el) => (questionRefs.current.stressfulEvents = el)}>
              <YesNoToggle
                label={questionsConfig.mentalState.questions.stressfulEvents.label}
                value={answers.stressfulEvents}
                onChange={(value) => updateAnswer('stressfulEvents', value)}
              />
            </div>
            
            {/* Conditional rendering for stress triggers */}
            {answers.stressfulEvents === true && (
              <div ref={(el) => (questionRefs.current.stressTriggers = el)} className={styles.conditionalSection}>
                <StressorSelector
                  label={questionsConfig.mentalState.questions.stressTriggers.label}
                  options={questionsConfig.mentalState.questions.stressTriggers.options}
                  selectedValues={answers.stressTriggers || []}
                  onChange={(values) => updateAnswer('stressTriggers', values)}
                />
              </div>
            )}
            
            <div ref={(el) => (questionRefs.current.overthinkingFrequency = el)}>
              <RadioGroup
                name="overthinkingFrequency"
                label={questionsConfig.mentalState.questions.overthinkingFrequency.label}
                options={questionsConfig.mentalState.questions.overthinkingFrequency.options}
                value={answers.overthinkingFrequency}
                onChange={(value) => updateAnswer('overthinkingFrequency', value)}
                variant="chip"
              />
            </div>
          </QuestionCard>

          {/* Submit Button */}
          <div className={styles.submitSection}>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              icon={isLoading ? null : "→"}
              disabled={isLoading}
            >
              {isLoading ? 'Analyzing...' : 'See My Results'}
            </Button>
          </div>
        </form>
      </main>

      {/* Loading spinner */}
      {isLoading && <LoadingSpinner message="Analyzing your responses..." />}
    </div>
  );
};

export default Questionnaire;
