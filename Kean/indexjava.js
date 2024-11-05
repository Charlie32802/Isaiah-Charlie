// Image Preview Logic
function previewImage(event) {
    const reader = new FileReader();
    const preview = document.getElementById('profilePreview');

    reader.onload = function() {
        preview.src = reader.result;
    };

    if (event.target.files[0]) {
        reader.readAsDataURL(event.target.files[0]);
    }
}

// Toggle between login and register forms
document.getElementById('showRegisterLink').onclick = function() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('registerContainer').style.display = 'block';
    resetProfilePicture();
};

document.getElementById('showLoginLink').onclick = function() {
    document.getElementById('registerContainer').style.display = 'none';
    document.getElementById('loginContainer').style.display = 'block';
};

// Reset profile picture to default when switching forms
function resetProfilePicture() {
    document.getElementById('profilePreview').src = 'profile-pic.jpg';
    document.getElementById('profilePicture').value = '';
    document.getElementById('passwordError').style.display = 'none'; // Hide error message on switch
}

// Handle registration form submission
document.getElementById('registerForm').onsubmit = function(event) {
    event.preventDefault(); // Prevent default form submission

    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorMessage = document.getElementById('passwordError');

    // Check if passwords match
    if (password !== confirmPassword) {
        errorMessage.style.display = 'block'; // Show error message
        return; // Stop the form submission
    } else {
        errorMessage.style.display = 'none'; // Hide error message if passwords match
    }

    const profilePicture = document.getElementById('profilePicture').value;

    // Show notification modal if profile picture is not selected
    if (!profilePicture) {
        showModal();
    } else {
        window.location.href = "success.html"; // Redirect to success.html
    }
};

// Show modal
function showModal() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('modal').style.display = 'block';
    document.getElementById('mainContent').classList.add('blur'); // Blur background
}

// Hide modal
function hideModal() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('modal').style.display = 'none';
    document.getElementById('mainContent').classList.remove('blur'); // Unblur background
}

// Handle Yes button in modal (Proceed without profile picture)
document.getElementById('yesButton').onclick = function() {
    hideModal();
    window.location.href = "success.html"; // Redirect to success.html
};

// Handle No button in modal (Stay on registration form)
document.getElementById('noButton').onclick = function() {
    hideModal(); // Close modal without redirect
};