# Formula: Vercel Root Directory Configuration for Subdirectory Projects

**Date:** January 7, 2025  
**Issue:** 404 NOT_FOUND errors when deploying Node.js app from subdirectory  
**Solution:** Configure Vercel Root Directory setting  
**Status:** ✅ RESOLVED

---

## Problem Statement

When deploying a project where the Node.js application is located in a subdirectory (e.g., `marp-to-images/`) rather than the root directory, Vercel returns:

```
404: NOT_FOUND
Code: NOT_FOUND
ID: iad1::xxxxx-xxxxxxxxxxxxx-xxxxxxxxxxxx
```

### Project Structure Causing Issues:

```
marptoimages/                    # Root (Git repository)
├── .github/
├── README.md
├── index.html                   # GitHub Pages redirect
├── vercel.json                  # Root config
└── marp-to-images/              # Actual Node.js app HERE!
    ├── index.js                 # Express server
    ├── package.json
    ├── public/
    └── node_modules/
```

**Problem:** Vercel looks for the app at root level, but it's in `marp-to-images/`

---

## Root Cause

Vercel's default behavior:
1. Looks for `package.json` in the **root directory**
2. Tries to run `index.js` from the **root directory**
3. Ignores subdirectories unless explicitly configured

Since our app is in a subdirectory, Vercel:
- ❌ Doesn't find the Node.js server
- ❌ Deploys as static files only
- ❌ POST endpoints return 404
- ❌ Backend functionality unavailable

---

## Solution 1: Vercel Dashboard (RECOMMENDED)

### Step-by-Step Fix:

**1. Navigate to Settings**
```
Vercel Dashboard
→ Select Project: marptoimages
→ Settings (top navigation)
→ Build and Deployment (left sidebar)  ← NOT "General"!
```

**2. Locate Root Directory Setting**

Look for **"Build & Development Settings"** section:

```
┌─────────────────────────────────────────┐
│ Build & Development Settings           │
├─────────────────────────────────────────┤
