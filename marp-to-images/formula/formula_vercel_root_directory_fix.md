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
│ Root Directory                          │
│ [marp-to-images        ]    ← SET THIS │
│ Learn more about Root Directory         │
│                                         │
│ Framework Preset                        │
│ [Other                 ]                │
│                                         │
│ Build Command                           │
│ npm run build                           │
│                                         │
│ Output Directory                        │
│ public                                  │
│                                         │
│ Install Command                         │
│ npm install                             │
└─────────────────────────────────────────┘
```

**3. Set Root Directory**
- **Field:** Root Directory
- **Value:** `marp-to-images`
- **Action:** Click "Save"

**4. Redeploy**
```
1. Go to "Deployments" tab
2. Find latest deployment
3. Click (...) three dots menu
4. Select "Redeploy"
5. Wait ~30-60 seconds
```

**5. Verify**
- Visit: `https://marptoimages.vercel.app`
- Should now load the actual Node.js app
- Test /convert endpoint works

---

## Solution 2: Root vercel.json Configuration

Create `vercel.json` at the **repository root**:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "marp-to-images/package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "marp-to-images/index.js"
    }
  ]
}
```

**Then commit and push:**

```bash
git add vercel.json
git commit -m "Configure Vercel for subdirectory deployment"
git push
```

Vercel will auto-deploy with new configuration.

---

## Solution 3: Restructure Project (NOT RECOMMENDED)

Move everything from `marp-to-images/` to root:

```bash
# Backup first!
git checkout -b restructure

# Move files
mv marp-to-images/* .
mv marp-to-images/.* . 2>/dev/null || true

# Remove old directory
rm -rf marp-to-images/

# Update paths in code if needed
# ...

# Commit
git add .
git commit -m "Restructure: move app to root"
git push
```

**Why NOT recommended:**
- ❌ Breaks existing structure
- ❌ May break local development
- ❌ Harder to maintain multiple environments
- ❌ More disruptive change

---

## Verification Steps

### Before Fix:
```bash
curl https://marptoimages.vercel.app
# Result: 404 NOT_FOUND

curl https://marptoimages.vercel.app/health
# Result: 404 NOT_FOUND
```

### After Fix:
```bash
curl https://marptoimages.vercel.app
# Result: HTML page loads

curl https://marptoimages.vercel.app/health
# Result: {"status":"ok","timestamp":"..."}
```

---

## Common Mistakes

### ❌ Mistake 1: Looking in Wrong Settings Tab

**Wrong:**
```
Settings → General → (no Root Directory option)
```

**Correct:**
```
Settings → Build and Deployment → Root Directory
```

### ❌ Mistake 2: Using Wrong Path Syntax

**Wrong:**
```
/marp-to-images/      ← No leading slash
./marp-to-images      ← No dot-slash
marp-to-images/       ← No trailing slash
```

**Correct:**
```
marp-to-images        ← Just the folder name
```

### ❌ Mistake 3: Forgetting to Redeploy

After changing settings:
- ✅ Must click "Redeploy"
- ❌ Settings alone don't auto-redeploy

### ❌ Mistake 4: Testing Wrong URL

**Wrong:**
```
https://marptoimages-6s009rwd8-rifaterdemsahins-projects.vercel.app/
← Preview/build-specific URL, may not work
```

**Correct:**
```
https://marptoimages.vercel.app
← Main production URL
```

---

## Deployment Logs Analysis

### Failed Deployment (Before Fix):

```
Running build in Washington, D.C., USA (East) – iad1
Cloning github.com/rifaterdemsahin/marptoimages
Running "vercel build"
Build Completed in /vercel/output [42ms]
Deploying outputs...
Deployment completed

❌ No framework detected
❌ Static Assets only
❌ No Node.js runtime
```

### Successful Deployment (After Fix):

```
Running build in Washington, D.C., USA (East) – iad1
Cloning github.com/rifaterdemsahin/marptoimages
Build machine configuration: 2 cores, 8 GB
Running "vercel build"
Installing dependencies...
├── express@5.1.0
├── @marp-team/marp-cli@4.2.3
└── multer@2.0.2
Build Completed in /vercel/output [2.3s]
Deploying outputs...
✅ Serverless Functions created
✅ Node.js runtime: nodejs18.x
✅ Routes configured
Deployment completed
```

---

## Technical Details

### Why Subdirectory Structure?

**Advantages:**
1. **Organization:** Separates app from docs/config
2. **Multiple apps:** Can have multiple apps in one repo
3. **GitHub Pages:** Can have different static site at root
4. **Clean separation:** App code vs. repository metadata

**Example:**
```
repo/
├── docs/              # Documentation
├── app1/              # First app (Vercel deployment 1)
├── app2/              # Second app (Vercel deployment 2)
└── README.md          # Repository readme
```

### How Root Directory Works:

When you set Root Directory to `marp-to-images`:

1. **Build Phase:**
   ```bash
   cd marp-to-images
   npm install
   npm run build  # if defined
   ```

2. **Runtime Phase:**
   ```bash
   cd marp-to-images
   node index.js
   ```

3. **File Resolution:**
   - All paths become relative to `marp-to-images/`
   - `require('./config.js')` → looks in `marp-to-images/config.js`
   - Static files served from `marp-to-images/public/`

---

## Alternative Approaches

### Approach A: Monorepo with Vercel

```json
// vercel.json at root
{
  "version": 2,
  "builds": [
    {
      "src": "app1/package.json",
      "use": "@vercel/node",
      "config": { "includeFiles": ["app1/**"] }
    },
    {
      "src": "app2/package.json",
      "use": "@vercel/node",
      "config": { "includeFiles": ["app2/**"] }
    }
  ]
}
```

### Approach B: Separate Git Repositories

```
marptoimages-frontend/     # Repo 1 → Vercel Project 1
marptoimages-backend/      # Repo 2 → Vercel Project 2
marptoimages-docs/         # Repo 3 → GitHub Pages
```

---

## Checklist for Future Deployments

When deploying a subdirectory project to Vercel:

- [ ] Create/update root `vercel.json` with correct paths
- [ ] Set Root Directory in Dashboard → Build and Deployment
- [ ] Verify Framework Preset is correct (or "Other")
- [ ] Check Build Command points to correct package.json
- [ ] Confirm Output Directory is relative to Root Directory
- [ ] Save settings
- [ ] Click "Redeploy" (don't just save!)
- [ ] Test main domain URL (not preview URL)
- [ ] Verify /health endpoint works
- [ ] Test actual functionality (POST requests, etc.)

---

## Quick Reference

### Configuration Values:

| Setting | Value | Location |
|---------|-------|----------|
| Root Directory | `marp-to-images` | Build and Deployment |
| Framework Preset | Other | Build and Deployment |
| Build Command | (default) | Build and Deployment |
| Output Directory | `public` | Build and Deployment |
| Install Command | `npm install` | Build and Deployment |
| Node.js Version | 18.x | Functions settings |

### URLs:

| Purpose | URL |
|---------|-----|
| Production | https://marptoimages.vercel.app |
| GitHub Repo | https://github.com/rifaterdemsahin/marptoimages |
| GitHub Pages | https://rifaterdemsahin.github.io/marptoimages/ |
| Vercel Dashboard | https://vercel.com/dashboard |

---

## Summary

**Problem:** Node.js app in subdirectory not deploying correctly on Vercel

**Solution:** Set Root Directory to `marp-to-images` in:
```
Dashboard → Settings → Build and Deployment → Root Directory
```

**Verification:**
```bash
curl https://marptoimages.vercel.app/health
# Should return: {"status":"ok","timestamp":"..."}
```

**Key Takeaway:** Always set Root Directory when your app isn't in the repository root!

---

**Remember:** After ANY setting changes in Vercel Dashboard:
1. Click "Save"
2. Go to Deployments
3. Click "Redeploy"
4. Wait for completion
5. Test the main domain URL

The settings don't apply until you redeploy!
