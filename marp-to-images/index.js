const express = require('express');
const multer = require('multer');
const { marpCli } = require('@marp-team/marp-cli');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const app = express();
const port = process.env.PORT || 3000;

/**
 * Maximum file size allowed for upload (5MB)
 * @const {number}
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Serve static files from the 'public' directory with no-cache headers
app.use(express.static('public', {
    setHeaders: (res, path) => {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }
}));

/**
 * Custom file filter for multer to only accept markdown files
 * @param {Object} req - Express request object
 * @param {Object} file - Multer file object
 * @param {Function} cb - Callback function
 */
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['text/markdown', 'text/plain', 'application/octet-stream'];
    const allowedExtensions = ['.md', '.markdown'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only Markdown (.md) files are allowed.'));
    }
};

/**
 * Detect if running on Vercel (serverless environment)
 */
const isVercel = process.env.VERCEL === '1';

/**
 * Set base directories based on environment
 * Vercel: Use /tmp (only writable directory)
 * Local: Use current directory
 */
const UPLOADS_DIR = isVercel ? '/tmp/uploads' : 'uploads';
const OUTPUT_DIR = isVercel ? '/tmp/output' : 'output';

/**
 * Configure multer for file uploads with size and type restrictions
 */
const upload = multer({ 
    dest: UPLOADS_DIR,
    limits: {
        fileSize: MAX_FILE_SIZE
    },
    fileFilter: fileFilter
});

/**
 * Create required directories if they don't exist
 */
const ensureDirectories = () => {
    const directories = [UPLOADS_DIR, OUTPUT_DIR];
    directories.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
};

ensureDirectories();

/**
 * Clean up temporary files and directories
 * @param {string[]} paths - Array of file/directory paths to remove
 */
const cleanupFiles = (paths) => {
    paths.forEach(filePath => {
        if (filePath && fs.existsSync(filePath)) {
            fs.rm(filePath, { recursive: true, force: true }, (err) => {
                if (err) {
                    console.error(`Error cleaning up ${filePath}:`, err);
                }
            });
        }
    });
};

/**
 * Handle file conversion from Marp markdown to PNG images
 * @route POST /convert
 */
app.post('/convert', upload.single('marp-file'), async (req, res) => {
    let inputPath = null;
    let outputDir = null;

    try {
        // Validate file upload
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        inputPath = req.file.path;
        outputDir = path.join(OUTPUT_DIR, `${Date.now()}`);
        
        // Create output directory
        fs.mkdirSync(outputDir, { recursive: true });

        // Convert Marp markdown to images
        console.log('[DEBUG] Converting Marp file:', inputPath);
        console.log('[DEBUG] Output directory:', outputDir);
        
        // Marp CLI needs the output to end with a filename pattern
        // Using {name} will be replaced with the input filename
        const outputPattern = path.join(outputDir, '{name}');
        console.log('[DEBUG] Output pattern:', outputPattern);
        
        await marpCli([
            inputPath,
            '--images', 'png',
            '-o', outputPattern
        ]);

        console.log('[DEBUG] Marp CLI conversion completed');

        // Check if conversion produced any images
        // Marp CLI creates files without .png extension (e.g., output.001, output.002)
        const allFiles = fs.readdirSync(outputDir);
        console.log('[DEBUG] Files in output directory:', allFiles);
        const imageFiles = allFiles.filter(file => {
            // Check if file is a PNG image (files may not have .png extension)
            const filePath = path.join(outputDir, file);
            try {
                const stats = fs.statSync(filePath);
                return stats.isFile() && file !== 'presentation.zip';
            } catch {
                return false;
            }
        });
        
        if (imageFiles.length === 0) {
            throw new Error('Conversion produced no images. Please check your Marp content.');
        }

        // Rename files to have .png extension for clarity
        console.log('[DEBUG] Renaming files to add .png extension...');
        const renamedFiles = [];
        imageFiles.forEach((file, index) => {
            const oldPath = path.join(outputDir, file);
            const newName = `slide-${String(index + 1).padStart(3, '0')}.png`;
            const newPath = path.join(outputDir, newName);
            console.log(`[DEBUG] Renaming: ${file} -> ${newName}`);
            fs.renameSync(oldPath, newPath);
            renamedFiles.push(newName);
        });
        console.log('[DEBUG] Renamed files:', renamedFiles);

        // Create ZIP archive of images
        console.log('[DEBUG] Creating ZIP archive...');
        const zipPath = path.join(outputDir, 'presentation.zip');
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        // Handle archive completion
        output.on('close', () => {
            console.log('[DEBUG] Archive created. Total bytes:', archive.pointer());
            console.log('[DEBUG] ZIP path:', zipPath);
            res.download(zipPath, 'presentation.zip', (err) => {
                if (err) {
                    console.error('Download error:', err);
                }
                // Clean up after download
                cleanupFiles([inputPath, outputDir]);
            });
        });

        // Handle archive errors
        archive.on('error', (err) => {
            console.error('[DEBUG] Archive error:', err);
            throw err;
        });

        // Pipe archive to output stream
        archive.pipe(output);

        // Add all renamed PNG files to archive
        console.log('[DEBUG] Adding files to ZIP...');
        for (const file of renamedFiles) {
            const filePath = path.join(outputDir, file);
            console.log(`[DEBUG] Adding to ZIP: ${filePath}`);
            archive.file(filePath, { name: file });
        }

        console.log('[DEBUG] Finalizing archive...');
        await archive.finalize();
        console.log('[DEBUG] Archive finalized successfully');

    } catch (error) {
        console.error('Conversion error:', error);
        
        // Clean up on error
        cleanupFiles([inputPath, outputDir]);
        
        // Send appropriate error response
        if (error.message.includes('Invalid file type')) {
            return res.status(400).send(error.message);
        } else if (error.message.includes('File too large')) {
            return res.status(413).send('File is too large. Maximum size is 5MB.');
        } else if (error.message.includes('no images')) {
            return res.status(422).send(error.message);
        } else {
            return res.status(500).send('Conversion failed. Please check your Marp content and try again.');
        }
    }
});

/**
 * Handle multer errors (file size, file type, etc.)
 */
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).send('File is too large. Maximum size is 5MB.');
        }
        return res.status(400).send(error.message);
    } else if (error) {
        return res.status(400).send(error.message);
    }
    next();
});

/**
 * Health check endpoint
 * @route GET /health
 */
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Start the Express server
 */
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
