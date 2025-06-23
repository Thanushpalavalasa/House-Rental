// public/js/owner.js (Corrected Version)

document.addEventListener('DOMContentLoaded', () => {
    const addListingForm = document.getElementById('add-listing-form');
    const messageDiv = document.getElementById('message');

    const token = localStorage.getItem('token');
    
    if (!token) {
        // Redirect to login if the user isn't authenticated
        window.location.href = '/login.html';
        return; 
    }

    addListingForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        messageDiv.textContent = '';
        messageDiv.className = 'message';

        // =============================================================
        //               THE FIX IS HERE
        // =============================================================
        // Create a data object from the form inputs, INCLUDING the new phone number
        const formData = {
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            bedrooms: document.getElementById('bedrooms').value,
            rentAmount: document.getElementById('rentAmount').value,
            // Add this line to get the phone number value
            phoneNumber: document.getElementById('phoneNumber').value, 
            description: document.getElementById('description').value,
        };
        // =============================================================

        try {
            const res = await fetch('/api/houses/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Note: Your server might be expecting 'x-auth-token' or 'Authorization'.
                    // Use the one that matches your 'protect' middleware.
                    // Assuming 'Authorization' based on your provided file.
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            // This is a robust way to handle both success and error responses
            if (!res.ok) {
                // 'data.msg' or 'data.message' depends on what your server sends back on error
                throw new Error(data.msg || data.message || 'Failed to add listing. Please check your inputs.');
            }

            // On success
            messageDiv.textContent = 'Listing added successfully!';
            messageDiv.className = 'message success';
            addListingForm.reset(); 

        } catch (err) {
            // On failure
            messageDiv.textContent = err.message;
            messageDiv.className = 'message error';
            console.error('Add Listing Error:', err);
        }
    });
});