/**
 * Maximum file size allowed for conversion (5MB)
 * @const {number}
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Validates the Marp content before submission
 * @param {string} content - The Marp markdown content
 * @returns {Object} Validation result with isValid flag and message
 */
function validateContent(content) {
    if (!content || content.trim().length === 0) {
        return { isValid: false, message: 'Please enter some Marp content.' };
    }
    
    const size = new Blob([content]).size;
    if (size > MAX_FILE_SIZE) {
        return { 
            isValid: false, 
            message: `Content is too large (${(size / 1024 / 1024).toFixed(2)}MB). Maximum allowed size is ${MAX_FILE_SIZE / 1024 / 1024}MB.` 
        };
    }
    
    return { isValid: true, message: '' };
}

/**
 * Displays a loading indicator in the result div
 * @param {HTMLElement} resultDiv - The result div element
 */
function showLoading(resultDiv) {
    resultDiv.innerHTML = `
        <div class="alert alert-info" role="status">
            <div class="spinner-border spinner-border-sm me-2" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            Converting your presentation to images...
        </div>
    `;
}

/**
 * Displays an error message in the result div
 * @param {HTMLElement} resultDiv - The result div element
 * @param {string} message - The error message to display
 */
function showError(resultDiv, message) {
    resultDiv.innerHTML = `
        <div class="alert alert-danger" role="alert">
            <strong>Error:</strong> ${message}
        </div>
    `;
}

/**
 * Displays a success message with download link
 * @param {HTMLElement} resultDiv - The result div element
 * @param {Blob} blob - The blob containing the ZIP file
 */
function showSuccess(resultDiv, blob) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'presentation.zip';
    a.textContent = 'Download Images (ZIP)';
    a.className = 'btn btn-success btn-lg';
    
    resultDiv.innerHTML = `
        <div class="alert alert-success" role="alert">
            <strong>Success!</strong> Your presentation has been converted to images.
        </div>
    `;
    resultDiv.appendChild(a);
}

/**
 * Handles form submission for Marp conversion
 */
document.getElementById('upload-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const marpContent = document.getElementById('marp-input').value;
    const resultDiv = document.getElementById('result');
    
    // Validate content
    const validation = validateContent(marpContent);
    if (!validation.isValid) {
        showError(resultDiv, validation.message);
        return;
    }

    // Create form data
    const formData = new FormData();
    const blob = new Blob([marpContent], { type: 'text/markdown' });
    formData.append('marp-file', blob, 'presentation.md');

    // Show loading indicator
    showLoading(resultDiv);

    try {
        const response = await fetch('/convert', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const blob = await response.blob();
            showSuccess(resultDiv, blob);
        } else {
            const errorText = await response.text();
            const errorMessage = errorText || 'Conversion failed. Please check your Marp content and try again.';
            showError(resultDiv, errorMessage);
        }
    } catch (error) {
        console.error('Conversion error:', error);
        showError(resultDiv, 'Network error occurred. Please check your connection and try again.');
    }
});

/**
 * Loads the sample Marp content into the textarea
 */
document.getElementById('load-sample').addEventListener('click', async () => {
    const resultDiv = document.getElementById('result');
    
    try {
        const response = await fetch('sample_marp.md');
        
        if (!response.ok) {
            showError(resultDiv, 'Failed to load sample file.');
            return;
        }
        
        const content = await response.text();
        document.getElementById('marp-input').value = content;
        
        resultDiv.innerHTML = `
            <div class="alert alert-info" role="alert">
                Sample Marp content loaded. Click "Convert" to generate images.
            </div>
        `;
    } catch (error) {
        console.error('Error loading sample:', error);
        showError(resultDiv, 'Failed to load sample file. Please try again.');
    }
});
