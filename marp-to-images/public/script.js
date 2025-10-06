
document.getElementById('upload-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const fileInput = document.getElementById('marp-file');
    formData.append('marp-file', fileInput.files[0]);

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = 'Converting...';

    try {
        const response = await fetch('/convert', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'presentation.zip';
            a.textContent = 'Download Images (zip)';
            a.className = 'btn btn-success';
            resultDiv.innerHTML = '';
            resultDiv.appendChild(a);
        } else {
            const error = await response.text();
            resultDiv.innerHTML = `Error: ${error}`;
        }
    } catch (error) {
        resultDiv.innerHTML = `Error: ${error.message}`;
    }
});
