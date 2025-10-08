/**
 * Maximum file size allowed for conversion (5MB)
 * @const {number}
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Debug logging function
 * @param {string} message - The debug message to log
 */
function debugLog(message) {
    const timestamp = new Date().toLocaleTimeString();
    const debugOutput = document.getElementById('debug-output');
    if (debugOutput) {
        debugOutput.textContent += `[${timestamp}] ${message}\n`;
        debugOutput.scrollTop = debugOutput.scrollHeight;
    }
    console.log(`[DEBUG] ${message}`);
}

/**
 * Check server health on page load
 */
async function checkServerHealth() {
    const statusDiv = document.getElementById('server-status');
    debugLog('Checking server health...');
    
    try {
        const response = await fetch('/health');
        if (response.ok) {
            const data = await response.json();
            statusDiv.className = 'alert alert-success';
            statusDiv.innerHTML = `<strong>✅ Server Online</strong> - Version ${data.version || '1.0.3'} - Ready to convert!`;
            debugLog(`Server health check: OK - Version ${data.version} (${data.timestamp})`);
        } else {
            throw new Error(`Server returned ${response.status}`);
        }
    } catch (error) {
        statusDiv.className = 'alert alert-danger';
        statusDiv.innerHTML = `
            <strong>❌ Server Offline!</strong> 
            <br>The server is not running. Please start it with:
            <br><code>cd marp-to-images && npm start</code>
            <br>Then refresh this page.
        `;
        debugLog(`Server health check FAILED: ${error.message}`);
    }
}

// Check server health when page loads
window.addEventListener('DOMContentLoaded', checkServerHealth);

/**
 * Toggle debug panel visibility
 */
document.getElementById('toggle-debug').addEventListener('click', () => {
    const debugPanel = document.getElementById('debug-panel');
    const toggleBtn = document.getElementById('toggle-debug');
    
    if (debugPanel.style.display === 'none') {
        debugPanel.style.display = 'block';
        toggleBtn.textContent = 'Hide Debug';
        debugLog('Debug panel opened');
        debugLog(`Page version: 1.0.1`);
        debugLog(`Current URL: ${window.location.href}`);
        // Re-check server health
        checkServerHealth();
    } else {
        debugPanel.style.display = 'none';
        toggleBtn.textContent = 'Show Debug';
    }
});

/**
 * Clear debug output
 */
document.getElementById('clear-debug').addEventListener('click', () => {
    document.getElementById('debug-output').textContent = '';
    debugLog('Debug output cleared');
});

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
    
    debugLog('=== Conversion Started ===');

    const marpContent = document.getElementById('marp-input').value;
    const resultDiv = document.getElementById('result');
    
    debugLog(`Content length: ${marpContent.length} characters`);
    
    // Validate content
    const validation = validateContent(marpContent);
    debugLog(`Validation result: ${validation.isValid ? 'PASS' : 'FAIL'}`);
    
    if (!validation.isValid) {
        debugLog(`Validation error: ${validation.message}`);
        showError(resultDiv, validation.message);
        return;
    }

    // Create form data
    const formData = new FormData();
    const blob = new Blob([marpContent], { type: 'text/markdown' });
    debugLog(`Created blob: ${blob.size} bytes, type: ${blob.type}`);
    formData.append('marp-file', blob, 'presentation.md');
    debugLog('Form data prepared');

    // Show loading indicator
    showLoading(resultDiv);
    debugLog('Sending request to /convert...');

    try {
        const response = await fetch('/convert', {
            method: 'POST',
            body: formData
        });

        debugLog(`Response status: ${response.status} ${response.statusText}`);

        if (response.ok) {
            const blob = await response.blob();
            debugLog(`Received ZIP file: ${blob.size} bytes`);
            debugLog('=== Conversion Successful ===');
            showSuccess(resultDiv, blob);
        } else {
            const errorText = await response.text();
            debugLog(`Server error: ${errorText}`);
            const errorMessage = errorText || 'Conversion failed. Please check your Marp content and try again.';
            debugLog('=== Conversion Failed ===');
            showError(resultDiv, errorMessage);
        }
    } catch (error) {
        console.error('Conversion error:', error);
        debugLog(`Network error: ${error.message}`);
        debugLog('=== Conversion Failed (Network Error) ===');
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
