//document.addEventListener('DOMContentLoaded', function () {
//    // Toggle sidebar visibility on menu button click
//    document.getElementById('menu-toggle').addEventListener('click', function () {
//        document.getElementById('sidebar').classList.toggle('active');
//    });
//});


    // Add event listener for photo input change
    document.getElementById('photo').addEventListener('change', function (event) {
        const fileInput = this;
        const fileName = fileInput.files.length > 0 ? fileInput.files[0].name : 'Фото';
        document.getElementById('file-name').textContent = fileName;

        if (fileInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById('photo-preview').src = e.target.result;
            }
            reader.readAsDataURL(fileInput.files[0]);
        }
    });
});

// Function to reset the form
function resetForm() {
    // Clear all text fields
    document.querySelectorAll('.form-control').forEach(input => {
        input.value = '';
    });

    // Reset the image preview
    document.getElementById('photo-preview').src = '/Admin_Image/DefaultImage.png';

    // Reset the file name display
    document.getElementById('file-name').textContent = 'Фото';

    // Clear the file input
    document.getElementById('photo').value = '';
}

