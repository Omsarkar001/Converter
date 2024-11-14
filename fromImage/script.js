function convertImage() {
    const fileInput = document.getElementById('fileInput');
    const formatSelect = document.getElementById('formatSelect');
    const outputImage = document.getElementById('outputImage');
    const downloadLink = document.getElementById('downloadLink');

    // Clear previous output
    outputImage.style.display = 'none';
    downloadLink.style.display = 'none';

    if (fileInput.files.length === 0) {
        alert('Please select an image file!');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();
    const selectedFormat = formatSelect.value;

    reader.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;

        img.onload = function() {
            if (selectedFormat === 'pdf') {
                // Convert to PDF using jsPDF
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF();

                const width = pdf.internal.pageSize.getWidth();
                const height = (img.height / img.width) * width;

                pdf.addImage(img, 'JPEG', 0, 0, width, height);

                const pdfUrl = pdf.output('bloburl');

                // Set download link for PDF
                downloadLink.href = pdfUrl;
                downloadLink.download = 'converted-image.pdf';
                downloadLink.style.display = 'inline-block';
                downloadLink.textContent = 'Download PDF';

            } else {
                // Create a canvas and draw the image on it
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                let convertedDataUrl;
                if (selectedFormat === 'jpeg') {
                    convertedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
                } else if (selectedFormat === 'png') {
                    convertedDataUrl = canvas.toDataURL('image/png');
                }

                outputImage.src = convertedDataUrl;
                outputImage.style.display = 'block';

                // Set up the download link for JPEG/PNG
                downloadLink.href = convertedDataUrl;
                downloadLink.download = `converted-image.${selectedFormat}`;
                downloadLink.style.display = 'inline-block';
                downloadLink.textContent = `Download ${selectedFormat.toUpperCase()}`;
            }
        };
    };

    reader.readAsDataURL(file);
}
