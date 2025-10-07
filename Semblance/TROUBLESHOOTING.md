# Troubleshooting Guide

## Common Issues and Solutions

### Error: "Conversion failed. Please check your Marp content and try again"

#### Problem
This error occurs when the Marp CLI fails to convert the markdown file to images. The most common causes are:

1. **Incorrect Marp CLI arguments** (FIXED in latest version)
2. Missing or malformed Marp frontmatter
3. Invalid markdown syntax
4. Server not running

#### The Fix (Applied)

**Issue #1: Incorrect Marp CLI arguments**

**What was wrong:**
```javascript
// OLD (INCORRECT)
await marpCli([
    '--image', 'png',                    // Wrong flag
    '--input-dir', path.dirname(inputPath),  // Unnecessary complexity
    path.basename(inputPath),
    '--output', outputDir
]);
```

**What was fixed:**
```javascript
// NEW (CORRECT)
await marpCli([
    inputPath,              // Input file path
    '--images', 'png',      // Correct flag for image export
    '-o', outputDir         // Output directory
]);
```

**Issue #2: File Extension Assumption (CRITICAL)**

**What was wrong:**
```javascript
// OLD (BROKEN) - Assumes .png extension
const imageFiles = fs.readdirSync(outputDir).filter(file => file.endsWith('.png'));
```

**Discovery:** Marp CLI creates PNG files **WITHOUT the .png extension**!
- Generated files: `output.001`, `output.002`, `output.003` (no .png!)
- These ARE valid PNG images, just without the extension
- The filter always returned empty array, causing error

**What was fixed:**
```javascript
// NEW (WORKING) - Detects all files
const allFiles = fs.readdirSync(outputDir);
const imageFiles = allFiles.filter(file => {
    const filePath = path.join(outputDir, file);
    try {
        const stats = fs.statSync(filePath);
        return stats.isFile() && file !== 'presentation.zip';
    } catch {
        return false;
    }
});

// Rename files to have .png extension
const renamedFiles = [];
imageFiles.forEach((file, index) => {
    const oldPath = path.join(outputDir, file);
    const newName = `slide-${String(index + 1).padStart(3, '0')}.png`;
    const newPath = path.join(outputDir, newName);
    fs.renameSync(oldPath, newPath);
    renamedFiles.push(newName);
});
```

**Key changes:**
- Changed `--image` to `--images` (correct flag)
- Simplified to pass full input path directly
- Used shorter `-o` flag for output
- **Don't assume .png extension** - check for all files
- **Rename files** to user-friendly names with .png extension

#### How to Verify the Fix

1. **Start the server:**
   ```bash
   cd marp-to-images
   npm start
   ```

2. **Open browser:**
   ```
   http://localhost:3000
   ```

3. **Click "Load Sample"** to load the example Marp content

4. **Click "Convert"** - should successfully generate images

5. **Check the download** - should receive a ZIP file with PNG images

#### Valid Marp Content Example

Your Marp markdown must have the frontmatter at the top:

```markdown
---
marp: true
theme: default
---

# Slide 1
Content here

---

# Slide 2
More content
```

### Other Common Issues

#### Issue: "No file uploaded"
**Solution:** Make sure you've entered content in the textarea before clicking Convert.

#### Issue: "File is too large. Maximum size is 5MB"
**Solution:** Reduce the size of your Marp content. Split large presentations into multiple files.

#### Issue: "Invalid file type. Only Markdown (.md) files are allowed"
**Solution:** Ensure your content is valid markdown. The system only accepts .md files.

#### Issue: Server won't start
**Possible causes:**
1. Port 3000 is already in use
   - **Solution:** Kill the process using port 3000 or set a different PORT environment variable
   ```bash
   PORT=8080 npm start
   ```

2. Missing dependencies
   - **Solution:** Run `npm install` again

3. Node.js version too old
   - **Solution:** Update to Node.js 18.0.0 or higher

#### Issue: Conversion produces no images
**Check:**
1. Marp frontmatter is present (must start with `---` and include `marp: true`)
2. Slides are separated with `---`
3. Content is valid markdown

### Getting Help

If you're still experiencing issues:

1. Check the server console for detailed error messages
2. Verify your Marp syntax at [marp.app](https://marp.app)
3. Open an issue on GitHub with:
   - Error message
   - Sample Marp content (if possible)
   - Node.js version (`node --version`)
   - Steps to reproduce

### Testing the Application

To verify everything is working:

```bash
# 1. Navigate to project
cd marp-to-images

# 2. Install dependencies
npm install

# 3. Start server
npm start

# 4. Open browser to http://localhost:3000

# 5. Click "Load Sample" - should load example content

# 6. Click "Convert" - should download ZIP with 3 PNG images
```

### Directory Structure

After successful conversion, the temporary structure looks like:

```
marp-to-images/
├── uploads/
│   └── [temp-file]        # Temporary uploaded file (auto-deleted)
└── output/
    └── [timestamp]/       # Temporary output folder (auto-deleted)
        ├── slide-1.png
        ├── slide-2.png
        ├── slide-3.png
        └── presentation.zip
```

**Note:** Both `uploads/` and `output/` directories are automatically cleaned up after download to save disk space.

## Debug Mode

To see detailed logs, you can modify the server to add more verbose output:

```javascript
// In index.js, add console.log statements:
console.log('Converting file:', inputPath);
console.log('Output directory:', outputDir);
console.log('Generated images:', imageFiles);
```

This will help identify where the conversion process might be failing.
