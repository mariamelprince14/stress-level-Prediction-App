# Deployment Guide: Railway (Backend) + Vercel (Frontend)

## **Step 1: Deploy Backend on Railway** ⚙️

### A. Prepare Backend for Railway

1. Make sure your GitHub repo has been pushed with all files
2. Backend folder contains:
   - `app.py`
   - `Raw_input_preprocessing.py`
   - `mlp_model.pkl`
   - `scaler.pkl`
   - `requirements.txt` (with gunicorn)
   - `Procfile`

### B. Deploy on Railway

1. Go to https://railway.app
2. Click **"Start a New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway with your GitHub account
5. Select your repo: `Stress_Level_Prediction_WebApp_UsingML`
6. Choose which folder to deploy: Select **`backend`** folder
7. Click **"Deploy"**

### C. Set Environment Variables on Railway

1. In Railway dashboard, go to your Backend service
2. Go to **"Variables"** tab
3. Add these variables:
```
FLASK_DEBUG = false
PORT = 5000
ALLOWED_ORIGINS = https://your-vercel-domain.com (you'll get this after Vercel deployment)
```

4. Railway will auto-restart and deploy
5. **Copy your Railway backend URL** - it will look like:
```
https://your-app-production-xxxx.railway.app
```

---

## **Step 2: Deploy Frontend on Vercel** 🚀

### A. Prepare Frontend for Vercel

1. Update `.env.production` in root directory with your Railway backend URL:
```
VITE_API_URL=https://your-app-production-xxxx.railway.app
```

2. Commit this change:
```bash
git add .env.production
git commit -m "Update API URL for production"
git push origin feature/ux-enhancements
```

### B. Deploy on Vercel

1. Go to https://vercel.com
2. Click **"New Project"**
3. **"Import Git Repository"**
4. Paste your GitHub URL: `https://github.com/Nagham242/Stress_Level_Prediction_WebApp_UsingML.git`
5. Click **"Import"**
6. **Configure Project:**
   - Project Name: `stress-level-prediction` (or your choice)
   - Framework: Should auto-detect as **Vite**
   - Root Directory: Leave as `./` (root)
   - Build Command: `npm run build` (should be auto-filled)
   - Output Directory: `dist` (should be auto-filled)

7. **Add Environment Variables:**
   - Name: `VITE_API_URL`
   - Value: `https://your-app-production-xxxx.railway.app` (your Railway URL)
   - Click **"Add"**

8. Click **"Deploy"**

### C. Get Your Vercel Frontend URL

After deployment completes, Vercel will show your URL like:
```
https://stress-level-prediction-xxxx.vercel.app
```

---

## **Step 3: Update Backend CORS** 🔗

Now update your Railway backend with the actual Vercel URL:

1. Go to Railway dashboard → Your Backend service
2. Go to **"Variables"** tab
3. Update `ALLOWED_ORIGINS`:
```
ALLOWED_ORIGINS = https://stress-level-prediction-xxxx.vercel.app
```
4. Railway auto-redeploys

---

## **Step 4: Test the Deployment** ✅

1. Go to your Vercel URL: `https://stress-level-prediction-xxxx.vercel.app`
2. Fill out the stress assessment form
3. Submit it
4. **You should see the loading spinner and get results!**

If you get errors:
- Check browser console (F12) for errors
- Check Railway logs: https://railway.app → Dashboard → Backend → Logs
- Verify ALLOWED_ORIGINS matches your Vercel URL exactly

---

## **Deployment Checklist**

Before you start:
- [ ] GitHub repo is up to date with all changes
- [ ] Feature branch pushed: `feature/ux-enhancements`
- [ ] `backend/Procfile` exists
- [ ] `backend/requirements.txt` has gunicorn
- [ ] `.env.production` is ready

Step 1: Railway Backend
- [ ] Repository connected to Railway
- [ ] Feature branch selected
- [ ] Backend folder selected
- [ ] Environment variables set
- [ ] Deployment successful
- [ ] Copy backend URL

Step 2: Vercel Frontend
- [ ] `.env.production` updated with backend URL
- [ ] Changes pushed to feature branch
- [ ] Repository imported to Vercel
- [ ] Environment variables set
- [ ] Build successful
- [ ] Copy frontend URL

Step 3: Update Backend
- [ ] `ALLOWED_ORIGINS` updated in Railway
- [ ] Redeploy successful

Step 4: Test
- [ ] Frontend loads
- [ ] Form submission works
- [ ] Results display correctly

---

## **Troubleshooting**

### Frontend won't load
- Check Vercel build logs
- Run `npm run build` locally to test

### Form submission fails
- Check browser console (F12 → Console tab)
- Check Railway backend logs
- Verify ALLOWED_ORIGINS in Railway matches your Vercel URL

### CORS errors
- Make sure `ALLOWED_ORIGINS` in Railway includes your Vercel domain
- Make sure `VITE_API_URL` in Vercel matches Railway URL exactly

### Model errors
- Verify `mlp_model.pkl` and `scaler.pkl` are pushed to GitHub
- Check Railway logs for Python errors

---

## **Next Time You Update**

When you make changes:
```bash
git add .
git commit -m "Your changes"
git push origin feature/ux-enhancements
```

Both Vercel and Railway auto-redeploy on push!
