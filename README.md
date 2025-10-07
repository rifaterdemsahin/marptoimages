# Marp to Images 🖼️

Convert Markdown Presentations (Marp format) to PNG images instantly. A free, easy-to-use web application for transforming your slide decks into downloadable image files.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-lightgrey.svg)](https://expressjs.com/)
[![GitHub Actions](https://img.shields.io/badge/GitHub-Actions-2088FF?logo=github-actions&logoColor=white)](https://github.com/rifaterdemsahin/marptoimages/actions)

## 🌐 Live Demo & Links

- **🚀 Live on Vercel:** [https://marptoimages-2ge3mn7iu-rifaterdemsahins-projects.vercel.app/](https://marptoimages-2ge3mn7iu-rifaterdemsahins-projects.vercel.app/)
- **📦 GitHub Repository:** [https://github.com/rifaterdemsahin/marptoimages](https://github.com/rifaterdemsahin/marptoimages)
- **🔄 GitHub Actions:** [https://github.com/rifaterdemsahin/marptoimages/actions](https://github.com/rifaterdemsahin/marptoimages/actions)
- **📖 GitHub Pages:** [https://rifaterdemsahin.github.io/marptoimages/](https://rifaterdemsahin.github.io/marptoimages/) (redirects to Vercel)
- **📝 Latest Release:** [v1.0.2](https://github.com/rifaterdemsahin/marptoimages/releases)

## 🚀 Features

- **Simple Interface**: Paste your Marp markdown and convert with one click
- **Fast Conversion**: Powered by the official Marp CLI
- **Batch Download**: Get all your slides as PNG images in a convenient ZIP file
- **File Validation**: Automatic validation of file types and sizes
- **Error Handling**: Clear, helpful error messages
- **Responsive Design**: Works on desktop and mobile devices
- **No Registration**: Start converting immediately, no sign-up required
- **Free & Open Source**: MIT licensed

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ⚡ Quick Start

### Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rifaterdemsahin/marptoimages.git
cd marptoimages
```

2. Navigate to the application directory:
```bash
cd marp-to-images
```

3. Install dependencies:
```bash
npm install
```

4. Start the server:
```bash
npm start
```

5. Open your browser and navigate to:
```
http://localhost:3000
```

## 📖 Usage

### Web Interface

1. **Enter Marp Content**: Paste your Marp markdown into the textarea, or click "Load Sample" to see an example
2. **Convert**: Click the "Convert" button
3. **Download**: Once conversion is complete, click the download link to get your images as a ZIP file

### Example Marp Content

```markdown
---
marp: true
theme: default
---

# Slide 1
This is my first slide

---

# Slide 2
This is my second slide
```

### File Size Limits

- Maximum file size: 5MB
- Accepted formats: `.md`, `.markdown`

## 🔌 API Documentation

### POST /convert

Convert Marp markdown to PNG images.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Form data with file field `marp-file`

**Response:**
- Success (200): ZIP file containing PNG images
- Bad Request (400): Invalid file type or missing file
- Payload Too Large (413): File exceeds 5MB limit
- Unprocessable Entity (422): Conversion produced no images
- Internal Server Error (500): Conversion failed

**Example:**
```javascript
const formData = new FormData();
formData.append('marp-file', file);

fetch('/convert', {
    method: 'POST',
    body: formData
})
.then(response => response.blob())
.then(blob => {
    // Handle download
});
```

### GET /health

Health check endpoint for monitoring.

**Response:**
```json
{
    "status": "ok",
    "timestamp": "2025-01-07T19:47:00.000Z"
}
```

## 🛠️ Development

### Project Structure

```
marp-to-images/
├── index.js              # Express server
├── package.json          # Dependencies and scripts
├── vercel.json          # Vercel deployment config
├── public/              # Frontend files
│   ├── index.html       # Main UI
│   ├── script.js        # Client-side logic
│   ├── style.css        # Styling
│   └── sample_marp.md   # Sample presentation
├── uploads/             # Temporary upload storage
└── output/              # Temporary conversion output
```

### Running in Development Mode

```bash
npm run dev
```

### Key Technologies

- **Backend**: Express.js 5.1.0
- **Converter**: @marp-team/marp-cli 4.2.3
- **File Upload**: Multer 2.0.2
- **Compression**: Archiver 7.0.1
- **Frontend**: Bootstrap 5.3.0

### Code Quality Tools

The project includes:
- `.editorconfig` for consistent code formatting
- JSDoc comments for documentation
- Error handling and validation

## 🌐 Deployment

### Vercel (Recommended)

This project is configured for easy deployment to Vercel:

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

### Manual Deployment

1. Set the `PORT` environment variable (defaults to 3000)
2. Ensure Node.js 18+ is installed
3. Run `npm install`
4. Start with `npm start`

### Environment Variables

- `PORT`: Server port (default: 3000)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 To-Do

See [todo.md](todo.md) for the full list of planned improvements and features.

## 🐛 Troubleshooting

Having issues? Check our [Troubleshooting Guide](TROUBLESHOOTING.md) for common problems and solutions.

**Quick fixes:**
- **Conversion fails:** Ensure your Marp content has proper frontmatter (`marp: true`)
- **Server won't start:** Check if port 3000 is already in use
- **No images generated:** Verify your markdown has slide separators (`---`)

For detailed solutions, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Marp Team](https://marp.app/) for the excellent Marp CLI
- [Bootstrap](https://getbootstrap.com/) for the UI framework
- All contributors who help improve this project

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on [GitHub](https://github.com/rifaterdemsahin/marptoimages/issues)
- Check existing issues for solutions

## 🔗 Related Projects

- [Marp](https://marp.app/) - Markdown Presentation Ecosystem
- [Marp CLI](https://github.com/marp-team/marp-cli) - Official Marp CLI

---

Made with ❤️ for the Marp community
