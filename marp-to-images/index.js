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

// Serve static files from the 'public' directory
app.use(express.static('public'));

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
 * Configure multer for file uploads with size and type restrictions
 */
const upload = multer({ 
    dest: 'uploads/',
    limits: {
        fileSize: MAX_FILE_SIZE
    },
    fileFilter: fileFilter
});

/**
 * Create required directories if they don't exist
 */
const ensureDirectories = () => {
    const directories = ['uploads', 'output'];
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
        outputDir = path.join('output', `${Date.now()}`);
        
        // Create output directory
        fs.mkdirSync(outputDir, { recursive: true });

        // Convert Marp markdown to images
        await marpCli([
            '--image', 'png',
            '--input-dir', path.dirname(inputPath),
            path.basename(inputPath),
            '--output', outputDir
        ]);

        // Check if conversion produced any images
        const imageFiles = fs.readdirSync(outputDir).filter(file => file.endsWith('.png'));
        
        if (imageFiles.length === 0) {
            throw new Error('Conversion produced no images. Please check your Marp content.');
        }

        // Create ZIP archive of images
        const zipPath = path.join(outputDir, 'presentation.zip');
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        // Handle archive completion
        output.on('close', () => {
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
            throw err;
        });

        // Pipe archive to output stream
        archive.pipe(output);

        // Add all PNG files to archive
        for (const file of imageFiles) {
            archive.file(path.join(outputDir, file), { name: file });
        }

        await archive.finalize();

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
