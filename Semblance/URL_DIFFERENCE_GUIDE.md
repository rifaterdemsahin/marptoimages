# URL Difference Guide: localhost:3000 vs localhost:5500

**Date:** January 7, 2025  
**Issue:** Understanding why different localhost ports behave differently  
**Status:** ✅ EXPLAINED

---

## The Problem

Users may encounter confusion when accessing the application through different URLs:

- ✅ **`http://localhost:3000`** - WORKS perfectly
- ❌ **`http://localhost:5500`** or **`http://127.0.0.1:5500`** - FAILS with 404/405 errors

## Why This Happens

### Two Different Servers

When developing this application, you actually have access to **TWO completely different servers**:

#### 1. VSCode Live Server (Port 5500) ❌
- **What it is:** A simple static file server built into VSCode
- **Purpose:** Previewing HTML/CSS/JavaScript files during development
- **How to activate:** Right-click HTML file → "Open with Live Server"
- **URL:** `http://127.0.0.1:5500/...` or `http://localhost:5500/...`
- **Capabilities:**
  - ✅ Serves HTML files
  - ✅ Serves CSS files
  - ✅ Serves JavaScript files
  - ✅ Serves images
  - ❌ **CANNOT run backend code**
  - ❌ **CANNOT handle POST requests**
  - ❌ **CANNOT process /convert endpoint**
  - ❌ **CANNOT run Node.js/Express**

#### 2. Node.js Express Server (Port 3000) ✅
- **What it is:** Our actual application server running Node.js
- **Purpose:** Running the full Marp to Images application
- **How to activate:** Run `npm start` in the marp-to-images directory
- **URL:** `http://localhost:3000`
- **Capabilities:**
  - ✅ Serves HTML files
  - ✅ Serves CSS files
  - ✅ Serves JavaScript files
  - ✅ **Runs backend code (index.js)**
  - ✅ **Handles POST requests**
  - ✅ **Processes /convert endpoint**
  - ✅ **Runs Marp CLI conversions**
  - ✅ **Creates and serves ZIP files**

---

## Visual Comparison

### Architecture Diagram

```
┌─────────────────────────────────────────┐
│      VSCode Live Server (Port 5500)     │
│              ❌ WON'T WORK              │
├─────────────────────────────────────────┤
│                                         │
│  Browser Request                        │
│  GET /index.html ──> ✅ Returns HTML   │
│  GET /script.js  ──> ✅ Returns JS     │
│  POST /convert   ──> ❌ 405 ERROR!     │
│                      (No backend!)      │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│   Node.js Express Server (Port 3000)    │
│              ✅ WORKS FULLY             │
├─────────────────────────────────────────┤
│                                         │
│  Browser Request                        │
│  GET /index.html ──> ✅ Returns HTML   │
│  GET /script.js  ──> ✅ Returns JS     │
│  POST /convert   ──> ✅ Processes!     │
│                      ├─ Receives file   │
│                      ├─ Runs Marp CLI   │
│                      ├─ Creates ZIP     │
│                      └─ Returns ZIP     │
│                                         │
└─────────────────────────────────────────┘
```

---

## Real-World Example

### What Happens on Port 5500 (Live Server)

```javascript
// Browser tries to POST to /convert
fetch('/convert', { method: 'POST', body: formData })

// Live Server says:
// "I don't know what /convert is! I only serve files!"
// Returns: 405 Method Not Allowed or 404 Not Found
```

**Result:** ❌ Conversion fails, ZIP never created

### What Happens on Port 3000 (Node.js Server)

```javascript
// Browser tries to POST to /convert
fetch('/convert', { method: 'POST', body: formData })

// Express Server (index.js) says:
// "I have a handler for POST /convert!"
app.post('/convert', upload.single('marp-file'), async (req, res) => {
    // 1. Receive the file
    // 2. Run Marp CLI
    // 3. Create ZIP
    // 4. Send ZIP back
})
```

**Result:** ✅ Conversion succeeds, ZIP downloaded

---

## How to Identify Which Server You're Using

### Check the URL Bar

```
❌ http://127.0.0.1:5500/marp-to-images/public/index.html
   ├─ IP address (127.0.0.1) instead of localhost
   ├─ Port 5500 (Live Server)
   └─ File path visible (/marp-to-images/public/)
   
✅ http://localhost:3000
   ├─ localhost domain
   ├─ Port 3000 (Node.js server)
   └─ Clean URL (Express routing)
```

### Check the Status Indicator

The application now includes a built-in health check:

```
❌ Server Offline!
   The server is not running. Please start it with:
   cd marp-to-images && npm start
   Then refresh this page.
```

This appears when:
- You're on Live Server (port 5500)
- Node.js server isn't running
- Wrong URL is being used

```
✅ Server Online - Version 1.0.1 - Ready to convert!
```

This appears when:
- You're on the correct URL (localhost:3000)
- Node.js server is running
- Backend is accessible

---

## Common Mistakes and Solutions

### Mistake 1: Opening HTML File Directly

```bash
# ❌ WRONG: Double-clicking index.html
file:///Users/you/projects/marptoimages/marp-to-images/public/index.html

# Problem: No server at all! Fetch requests fail completely.
```

**Solution:** Always use a server (preferably localhost:3000)

### Mistake 2: Using VSCode Live Server

```bash
# ❌ WRONG: Right-click index.html → "Open with Live Server"
http://127.0.0.1:5500/marp-to-images/public/index.html

# Problem: Static file server, no backend functionality.
```

**Solution:** Don't use Live Server for this app!

### Mistake 3: Forgetting to Start Node.js Server

```bash
# ✅ CORRECT: But forgot to run npm start
http://localhost:3000

# Problem: "Connection refused" - server isn't running
```

**Solution:** Run `npm start` first, THEN open browser

### Mistake 4: Wrong Port Number

```bash
# ❌ WRONG: Typo in port number
http://localhost:3030  # Should be 3000
http://localhost:300   # Should be 3000
```

**Solution:** Always use **localhost:3000**

---

## Step-by-Step: The Right Way

### 1. Start the Node.js Server

```bash
cd /path/to/marptoimages/marp-to-images
npm start
```

**Wait for:**
```
> marp-to-images@1.0.1 start
> node index.js

Server listening at http://localhost:3000
```

### 2. Open Browser

**Type EXACTLY:**
```
http://localhost:3000
```

**Look for green status:**
```
✅ Server Online - Version 1.0.1 - Ready to convert!
```

### 3. Use the Application

Now you can:
- Load samples
- Convert presentations
- Download ZIP files

---

## Technical Details

### Why Two Servers?

**Live Server (5500):**
- Installed as a VSCode extension
- Automatically serves files when you right-click
- Good for: Simple HTML/CSS/JS preview
- **Not good for:** Full-stack applications

**Express Server (3000):**
- Installed via npm (in package.json)
- Manually started with `npm start`
- Good for: Full-stack applications with backend
- **Perfect for:** This Marp conversion app

### Port Numbers Explained

- **Port:** A number that identifies a specific service on your computer
- **3000:** Commonly used for Node.js development servers
- **5500:** Default for VSCode Live Server extension
- **Different ports = Different programs**

Think of ports like apartment numbers:
- Port 3000 = Apartment where Node.js server lives
- Port 5500 = Apartment where Live Server lives
- They can't talk to each other!

---

## Debug Panel Clues

When you open the debug panel, it shows:

```
[time] Current URL: http://127.0.0.1:5500/...
```

❌ **This is WRONG!** Should be localhost:3000

```
[time] Current URL: http://localhost:3000/
```

✅ **This is CORRECT!**

---

## Quick Reference

### ❌ DON'T Use These URLs:

- `http://127.0.0.1:5500/...`
- `http://localhost:5500/...`
- `file:///...`
- Any URL with port 5500

### ✅ DO Use This URL:

- `http://localhost:3000`

### 🔧 How to Start:

```bash
cd marp-to-images
npm start
# Wait for "Server listening at http://localhost:3000"
# Then open http://localhost:3000 in browser
```

---

## Summary

| Feature | Live Server (5500) | Node.js Server (3000) |
|---------|-------------------|---------------------|
| Serves HTML/CSS/JS | ✅ Yes | ✅ Yes |
| Auto-refresh | ✅ Yes | ❌ No |
| Backend processing | ❌ No | ✅ Yes |
| POST /convert | ❌ No | ✅ Yes |
| Run Marp CLI | ❌ No | ✅ Yes |
| Create ZIP files | ❌ No | ✅ Yes |
| **USE FOR THIS APP?** | **❌ NO** | **✅ YES** |

---

## Conclusion

**Always use `http://localhost:3000` for this application!**

The VSCode Live Server (port 5500) is a helpful tool for simple web development, but it's not designed for full-stack applications that need backend processing. Our Marp to Images application requires:

1. File upload handling (multer)
2. Marp CLI execution
3. Image generation
4. ZIP file creation
5. File downloads

All of these require a **real backend server** (Express on port 3000), which Live Server cannot provide.

**Remember:** If you see port 5500 in the URL bar, you're in the wrong place! Close that tab and go to localhost:3000.
