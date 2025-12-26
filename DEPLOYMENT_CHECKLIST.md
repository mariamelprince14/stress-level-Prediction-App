# ✅ DEPLOYMENT CHECKLIST

## **Before You Start**
- [ ] You have a GitHub account
- [ ] You have access to https://github.com/Nagham242/Stress_Level_Prediction_WebApp_UsingML
- [ ] You've pushed `feature/ux-enhancements` branch (✅ already done)

---

## **PHASE 1: Railway Backend Deployment**

### Setup
- [ ] Go to https://railway.app
- [ ] Create account or log in
- [ ] Click "New Project"

### Configuration  
- [ ] Select "Deploy from GitHub repo"
- [ ] Connect GitHub account
- [ ] Select repo: `Nagham242/Stress_Level_Prediction_WebApp_UsingML`
- [ ] Select branch: `feature/ux-enhancements`
- [ ] Select folder to deploy: `backend`
- [ ] Wait for deployment (2-3 min)

### Get URL & Configure
- [ ] Get your Railway backend URL (looks like `https://xxx.railway.app`)
- [ ] Go to Backend service → Variables tab
- [ ] Add: `FLASK_DEBUG = false`
- [ ] Add: `PORT = 5000`
- [ ] Add: `ALLOWED_ORIGINS = http://localhost:3000` (temporary)
- [ ] **Save this URL** ⬅️ You'll need it next

**Backend Status:** 🔄 → ✅

---

## **PHASE 2: Vercel Frontend Deployment**

### Prepare
- [ ] Open `.env.production` file locally
- [ ] Update with your Railway URL:
  ```
  VITE_API_URL=https://your-railway-url.railway.app
  ```
- [ ] Commit and push:
  ```bash
  git add .env.production
  git commit -m "Update API URL"
  git push origin feature/ux-enhancements
  ```

### Deploy
- [ ] Go to https://vercel.com
- [ ] Create account or log in with GitHub
- [ ] Click "New Project"
- [ ] Click "Import Git Repository"
- [ ] Paste: `https://github.com/Nagham242/Stress_Level_Prediction_WebApp_UsingML`
- [ ] Click "Import"

### Configure
- [ ] Project Name: `stress-level-prediction` (or your choice)
- [ ] Framework: Should show **Vite** ✅
- [ ] Root Directory: Leave as default
- [ ] Build Command: `npm run build` ✅
- [ ] Output Directory: `dist` ✅
- [ ] Add Environment Variable:
  - Name: `VITE_API_URL`
  - Value: `https://your-railway-url.railway.app`
- [ ] Click "Deploy"
- [ ] Wait for deployment (2-3 min)
- [ ] **Save your Vercel URL** ⬅️ You'll need it next

**Frontend Status:** 🔄 → ✅

---

## **PHASE 3: Connect Backend & Frontend**

### Update Railway
- [ ] Go back to Railway dashboard
- [ ] Go to Backend service → Variables
- [ ] Update `ALLOWED_ORIGINS` with your Vercel URL:
  ```
  ALLOWED_ORIGINS=https://stress-level-prediction-xxx.vercel.app
  ```
- [ ] Save (Railway auto-redeploys)
- [ ] Wait 2-3 minutes

**Status:** 🔗 Connected

---

## **PHASE 4: Test**

### Frontend Test
- [ ] Open your Vercel URL in browser
- [ ] See home page ✅
- [ ] Click "Start Assessment"
- [ ] Fill out entire form
- [ ] Click "See My Results"
- [ ] See loading spinner ✅
- [ ] See results page ✅

### Console Check
- [ ] Open browser DevTools (F12)
- [ ] Go to Console tab
- [ ] No red errors ✅

### Backend Check (if needed)
- [ ] Go to Railway dashboard
- [ ] Click Backend service
- [ ] Click "Logs" tab
- [ ] No error messages ✅

**Overall Status:** ✅ DEPLOYED

---

## **URLS TO SAVE**

Save these for future reference:

| Service | URL |
|---------|-----|
| **GitHub** | https://github.com/Nagham242/Stress_Level_Prediction_WebApp_UsingML |
| **Railway Backend** | https://your-app-production-xxxx.railway.app |
| **Vercel Frontend** | https://stress-level-prediction-xxx.vercel.app |

---

## **AFTER DEPLOYMENT**

### Update Code
```bash
git add .
git commit -m "Your changes"
git push origin feature/ux-enhancements
```
Both Vercel and Railway auto-redeploy! 🎉

### Merge to Main (Optional)
- Create Pull Request in GitHub
- Merge `feature/ux-enhancements` → `main`
- Update Railway & Vercel to deploy from `main`

---

## **TROUBLESHOOTING**

| Issue | Solution |
|-------|----------|
| "Can't connect to backend" | Check ALLOWED_ORIGINS matches Vercel URL exactly |
| "CORS error" | Wait 2-3 min for Railway redeploy after changing variables |
| "Form won't submit" | Check browser console (F12), check Railway logs |
| "Page won't load" | Check Vercel build logs in Deployments tab |
| "Model not found" | Verify mlp_model.pkl pushed to GitHub |

---

**Ready to deploy? Go to DEPLOYMENT_WALKTHROUGH.md for step-by-step guide!**

