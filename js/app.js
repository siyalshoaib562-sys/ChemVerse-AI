// Fetch the elements dataset using a relative path compatible with GitHub Pages
fetch('./data/elements.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Dataset successfully loaded:', data);
        // Call your function here to render the periodic table using the loaded data
        // e.g., initializePeriodicTable(data);
    })
    .catch(error => {
        console.error('Fetch error:', error);
        // Display the error message on the screen if the layout requires it
        const errorContainer = document.getElementById('error-message');
        if (errorContainer) {
            errorContainer.innerText = 'Failed to load elements.json dataset';
        }
    });
