# 🚀 DEPLOYMENT WALKTHROUGH: Railway + Vercel

## **You Have:**
- ✅ GitHub repo: https://github.com/Nagham242/Stress_Level_Prediction_WebApp_UsingML
- ✅ Feature branch: `feature/ux-enhancements` (ready to deploy)
- ✅ Main branch: clean and untouched

---

# **STEP 1: Deploy Backend on Railway** ⚙️

## **1.1 Sign Up / Log In to Railway**

1. Go to https://railway.app
2. Click **"Start a New Project"** (if new) or **"+ New Project"** (if logged in)

## **1.2 Connect Your GitHub Repo**

1. Select **"Deploy from GitHub repo"**
2. Click **"Connect with GitHub"**
3. Authorize Railway to access your GitHub account
4. Select your repo: `Nagham242/Stress_Level_Prediction_WebApp_UsingML`
5. Select branch: `feature/ux-enhancements` ⭐

## **1.3 Configure Deployment**

1. Railway will ask which folder to deploy
   - **Select: `backend`** folder
   - This tells Railway to look for `Procfile` in backend/

2. Railway will auto-detect and start deploying
3. Wait for deployment to complete (2-3 minutes)

## **1.4 Get Your Backend URL**

1. In Railway dashboard, go to your **Backend** service
2. Click on **"Settings"** or look for the **"View"** section
3. Find the public URL - it looks like:
   ```
   https://your-app-production-xxxx.railway.app
   ```
4. **Copy this URL and save it** - you'll need it for the frontend!

## **1.5 Set Environment Variables**

1. Still in Railway dashboard, go to your Backend service
2. Click **"Variables"** tab
3. Add these variables:

| Name | Value |
|------|-------|
| `FLASK_DEBUG` | `false` |
| `PORT` | `5000` |
| `ALLOWED_ORIGINS` | `http://localhost:3000` (for now, we'll update this later) |

4. Click **"Add"** for each variable
5. Railway will auto-redeploy

✅ **Backend deployed!**

---

# **STEP 2: Deploy Frontend on Vercel** 🚀

## **2.1 Update Environment File**

Before deploying, you need to tell the frontend where the backend is.

1. Open `.env.production` file locally
2. Replace the URL with your Railway backend URL:
```
VITE_API_URL=https://your-app-production-xxxx.railway.app
```
(Use the URL you copied from Railway in Step 1.4)

3. Save the file
4. Commit and push to GitHub:
```bash
git add .env.production
git commit -m "Update API URL for production"
git push origin feature/ux-enhancements
```

## **2.2 Sign Up / Log In to Vercel**

1. Go to https://vercel.com
2. Click **"Sign Up"** (or log in if you have an account)
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

## **2.3 Import Your Project**

1. Click **"New Project"** (or **"+ Add New"** → **"Project"**)
2. Click **"Import Git Repository"**
3. Paste your repo URL:
   ```
   https://github.com/Nagham242/Stress_Level_Prediction_WebApp_UsingML
   ```
4. Click **"Import"**

## **2.4 Configure Project Settings**

Vercel will show you a configuration page:

| Setting | Value |
|---------|-------|
| **Project Name** | `stress-level-prediction` |
| **Framework** | Should auto-detect as **Vite** ✅ |
| **Root Directory** | `.` (leave empty/default) |
| **Build Command** | `npm run build` ✅ |
| **Output Directory** | `dist` ✅ |

Everything should auto-fill correctly!

## **2.5 Add Environment Variables to Vercel**

1. Scroll down to **"Environment Variables"** section
2. Add this variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-app-production-xxxx.railway.app` (your Railway URL)
3. Click **"Add"**

## **2.6 Deploy!**

1. Click **"Deploy"**
2. Wait for deployment (2-3 minutes)
3. You'll see a ✅ checkmark when complete

## **2.7 Get Your Frontend URL**

1. After deployment, Vercel shows your URL:
   ```
   https://stress-level-prediction-xxx.vercel.app
   ```
2. **Copy this URL and save it**

✅ **Frontend deployed!**

---

# **STEP 3: Update Backend CORS Settings** 🔗

Now you need to tell the backend that your frontend is allowed to communicate with it.

1. Go back to **Railway dashboard**
2. Click on your **Backend** service
3. Go to **"Variables"** tab
4. Find `ALLOWED_ORIGINS` variable
5. Update it to your Vercel URL:
   ```
   ALLOWED_ORIGINS=https://stress-level-prediction-xxx.vercel.app
   ```
6. Railway auto-redeploys

---

# **STEP 4: Test Everything!** ✅

1. Open your Vercel frontend URL in a browser:
   ```
   https://stress-level-prediction-xxx.vercel.app
   ```

2. You should see the home page
3. Click **"Start Assessment"**
4. Fill out the entire form
5. Click **"See My Results"**

## **You should see:**
- ✅ Loading spinner appears
- ✅ Results page shows your stress level
- ✅ No errors in browser console (F12)

## **If something doesn't work:**

### ❌ "Unable to connect to prediction service"
- Check that `ALLOWED_ORIGINS` in Railway exactly matches your Vercel URL
- Check that `VITE_API_URL` in Vercel exactly matches your Railway URL
- Wait 2-3 minutes for Railway to redeploy after changing variables

### ❌ Form won't submit
- Open browser console (F12 → Console tab)
- Look for error messages
- Check Railway logs: Railway Dashboard → Backend → Logs tab

### ❌ Page won't load at all
- Check Vercel build logs: Vercel Dashboard → Your Project → Deployments → Click the deployment → View logs
- Check that all files are in the repo

---

# **SUMMARY OF URLS YOU'LL GET:**

After deployment, you'll have:

1. **Backend (Railway):**
   ```
   https://your-app-production-xxxx.railway.app
   ```

2. **Frontend (Vercel):**
   ```
   https://stress-level-prediction-xxx.vercel.app
   ```

3. **GitHub:**
   ```
   https://github.com/Nagham242/Stress_Level_Prediction_WebApp_UsingML
   ```

---

# **AUTOMATIC REDEPLOYMENT**

From now on, whenever you push to `feature/ux-enhancements`:
```bash
git add .
git commit -m "Your changes"
git push origin feature/ux-enhancements
```

**Both Vercel and Railway automatically redeploy!** 🎉

---

# **NEXT STEPS (Optional)**

Once everything works:

1. **Merge feature branch to main** (in GitHub)
   - Create a Pull Request
   - Review changes
   - Merge to main
   - Update Railway and Vercel to deploy from main branch

2. **Add custom domain** (optional)
   - Vercel and Railway both support custom domains
   - You can add your own domain like `mystressapp.com`

---

**You're all set! Good luck! 🚀**

