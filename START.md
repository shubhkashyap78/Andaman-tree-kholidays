# 🚀 QUICK START GUIDE

## Step 1: Install Dependencies
```bash
npm install
```

## Step 2: Test MongoDB Connection
```bash
node test-connection.js
```

Agar ✅ dikhe to MongoDB working hai!

## Step 3: Create Admin User
```bash
node create-admin.js
```

## Step 4: Start Server
```bash
npm start
```

## Step 5: Open Admin Panel
http://localhost:5000/admin.html

Login:
- Username: admin
- Password: admin123

## Step 6: Open Website
http://localhost:5000/index.html

---

## ❌ Agar "Connection Error" aaye to:

### Solution 1: Check Dependencies
```bash
npm install
```

### Solution 2: Check MongoDB
```bash
node test-connection.js
```

### Solution 3: Check Server Running
Server console mein ye dikhna chahiye:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

### Solution 4: Check Port
Agar port 5000 busy hai to .env mein change karo:
```
PORT=3000
```

### Solution 5: Frontend Connection
Agar admin panel mein login nahi ho raha:
- Check browser console (F12)
- Server running hai ya nahi check karo
- URL sahi hai: http://localhost:5000/admin.html

---

## 📝 Important URLs:
- Admin Panel: http://localhost:5000/admin.html
- Main Website: http://localhost:5000/index.html
- API Base: http://localhost:5000/api

## 🔑 Default Admin:
- Username: admin
- Password: admin123
