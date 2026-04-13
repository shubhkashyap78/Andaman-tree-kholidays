# 🚀 Vercel Deployment Guide

## ✅ Frontend Already Deployed
https://andaman-tree-kholidays.vercel.app/

## 🔧 Backend Deployment Steps

### Option 1: Deploy Backend on Vercel (Recommended)

1. **Create New Vercel Project for Backend**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Select root directory
   - Click Deploy

2. **Set Environment Variables on Vercel**
   - Go to Project Settings → Environment Variables
   - Add these variables:
   ```
   MONGODB_URI=mongodb+srv://sk8113347_db_user:sDOTrPq6tzLJnbrA@cluster0.qjf61mx.mongodb.net/andaman_holidays?retryWrites=true&w=majority
   JWT_SECRET=andaman_treek_holidays_secret_key_2026_secure
   PORT=5000
   NODE_ENV=production
   ```

3. **Update Frontend API URLs**
   - After backend deployment, copy the backend URL
   - Update these files with your backend URL:
     - `admin-script.js` (line 1)
     - `script.js` (contact and booking forms)

### Option 2: Deploy Backend on Render.com (Free)

1. **Go to https://render.com**
2. **Create New Web Service**
3. **Connect GitHub Repository**
4. **Configure:**
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Add Environment Variables** (same as above)
6. **Deploy**

### Option 3: Deploy Backend on Railway.app (Free)

1. **Go to https://railway.app**
2. **New Project → Deploy from GitHub**
3. **Add Environment Variables**
4. **Deploy**

---

## 📝 Current Setup

### Frontend (Vercel)
✅ https://andaman-tree-kholidays.vercel.app/

### Backend (Need to Deploy)
Choose one option above and deploy

### After Backend Deployment

Update these URLs in your code:
```javascript
// Replace this URL with your deployed backend URL
const API_URL = 'https://YOUR-BACKEND-URL.vercel.app/api';
```

---

## 🔥 Quick Deploy Commands

### Push to GitHub
```bash
git add .
git commit -m "Backend ready for deployment"
git push origin main
```

### Deploy to Vercel (if using Vercel CLI)
```bash
npm i -g vercel
vercel --prod
```

---

## ⚠️ Important Notes

1. **CORS Settings**: Backend already configured for all origins
2. **MongoDB**: Already connected and working
3. **Admin User**: Already created (admin/admin123)
4. **Static Files**: Serving from root directory

---

## 🎯 Final URLs Structure

After deployment:
- Frontend: https://andaman-tree-kholidays.vercel.app/
- Backend API: https://YOUR-BACKEND-URL/api
- Admin Panel: https://andaman-tree-kholidays.vercel.app/admin.html

---

## 🐛 Troubleshooting

### If API not working on Vercel:
1. Check environment variables are set
2. Check backend is deployed and running
3. Check CORS settings
4. Check MongoDB connection string

### If forms not submitting:
1. Open browser console (F12)
2. Check for CORS errors
3. Verify API URL is correct
4. Check network tab for failed requests
