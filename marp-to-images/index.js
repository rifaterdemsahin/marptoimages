
const express = require('express');
const multer = require('multer');
const { marpCli } = require('@marp-team/marp-cli');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Create uploads and output directories if they don't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}
if (!fs.existsSync('output')) {
    fs.mkdirSync('output');
}

app.post('/convert', upload.single('marp-file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const inputPath = req.file.path;
    const outputDir = path.join('output', `${Date.now()}`);
    fs.mkdirSync(outputDir, { recursive: true });

    try {
        await marpCli(['--image', 'png', '--input-dir', path.dirname(inputPath), path.basename(inputPath), '--output', outputDir]);

        const zipPath = path.join(outputDir, 'presentation.zip');
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', {
            zlib: { level: 9 } // Sets the compression level.
        });

        output.on('close', () => {
            res.download(zipPath, 'presentation.zip', (err) => {
                if (err) {
                    console.error(err);
                }
                // Clean up
                fs.rm(req.file.path, { recursive: true, force: true }, () => {});
                fs.rm(outputDir, { recursive: true, force: true }, () => {});
            });
        });

        archive.on('error', (err) => {
            throw err;
        });

        archive.pipe(output);
        const imageFiles = fs.readdirSync(outputDir).filter(file => file.endsWith('.png'));

        for (const file of imageFiles) {
            archive.file(path.join(outputDir, file), { name: file });
        }

        archive.finalize();

    } catch (error) {
        console.error(error);
        res.status(500).send('Conversion failed.');
        // Clean up
        fs.rm(req.file.path, { recursive: true, force: true }, () => {});
        fs.rm(outputDir, { recursive: true, force: true }, () => {});
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
