const videoUpload = document.getElementById('videoUpload');

videoUpload.addEventListener('change', function(event) {
    const files = event.target.files;
    const formData = new FormData();
    for (const file of files) {
        formData.append('video', file);
        formData.append('description', 'Sample description');
    }

    fetch('/upload', {
        method: 'POST',
        body: formData
    }).then(response => response.json()).then(data => {
        if (data.success) {
            alert('Videos uploaded successfully!');
        } else {
            alert('Failed to upload videos: ' + data.message);
        }
    });
});
