# Cline Context - Marp to Images Project

## Project Overview
**Name:** marptoimages  
**Purpose:** Convert Markdown Presentations (Marp format) to PNG images  
**Type:** Web application with Express.js backend  
**Deployment:** Vercel-ready

## Technology Stack
- **Backend:** Express.js (v5.1.0)
- **Core Conversion:** @marp-team/marp-cli (v4.2.3)
- **File Upload:** Multer (v2.0.2)
- **Compression:** Archiver (v7.0.1)
- **Frontend:** HTML, JavaScript, Bootstrap 5.3.0

## Project Structure
```
marptoimages/
├── marp-to-images/           # Main application directory
│   ├── index.js              # Express server & conversion logic
│   ├── package.json          # Dependencies
│   ├── vercel.json           # Vercel deployment config
│   ├── public/               # Static frontend files
│   │   ├── index.html        # Main UI
│   │   ├── script.js         # Frontend logic
│   │   ├── style.css         # Styling
│   │   └── sample_marp.md    # Sample Marp file
│   ├── formula/              # Documentation/formulas
│   │   ├── formula_cost_compare.md
│   │   ├── formula_render_cost.md
│   │   ├── formula_vercel_app_created.md
│   │   └── formula_vercel_cost.md
│   ├── uploads/              # Temporary upload storage
│   └── output/               # Temporary conversion output
├── README.md
└── .gitignore
```

## Key Functionality

### Backend (index.js)
1. **Server Setup:** Express server on port 3000
2. **Static Serving:** Serves files from `public/` directory
3. **File Upload:** Handles Marp markdown file uploads via multer
4. **Conversion Process:**
   - Accepts uploaded .md file
   - Converts to PNG images using marp-cli
   - Creates timestamped output directory
   - Zips all generated PNG files
   - Returns zip file for download
   - Cleans up temporary files
5. **Error Handling:** Handles conversion failures and cleanup

### Frontend (public/)
- **index.html:** Bootstrap-based UI with:
  - Textarea for Marp content input
  - Convert button
  - Load Sample button
  - Result display area
- **script.js:** Handles form submission and sample loading
- **style.css:** Custom styling
- **sample_marp.md:** Example Marp presentation

### Deployment (Vercel)
- Configured with vercel.json for serverless deployment
- Uses @vercel/node builder
- Routes all requests to index.js

## Important Considerations

### File Management
- Temporary files created in `uploads/` and `output/`
- Cleanup happens after successful download or on error
- Timestamped directories prevent conflicts

### Conversion Flow
1. User uploads/pastes Marp markdown
2. Backend receives file via POST to `/convert`
3. Marp CLI converts markdown to PNG images
4. Images are archived into a ZIP file
5. ZIP is sent to user as download
6. Temporary files are cleaned up

### Dependencies
- Core conversion relies on @marp-team/marp-cli
- Express handles HTTP server
- Multer manages file uploads
- Archiver creates downloadable ZIP files

## Development Notes
- Server runs on port 3000 locally
- No tests currently configured
- Git repository: rifaterdemsahin/marptoimages
- Latest commit: e25b28411f2dae1a2d1daea7c4f0fd2758d1a9fc

## Potential Enhancement Areas
- Add automated tests
- Improve error messages to users
- Add progress indicators for conversion
- Support additional output formats (PDF, PPTX)
- Add configuration options (image quality, size)
- Implement rate limiting
- Add user authentication for saved presentations
- Better temporary file management
- Add conversion history/logs
