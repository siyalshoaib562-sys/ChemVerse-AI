// Array to store data globally for search/filter functionality
let elementsData = [];

// Fetch elements dataset
fetch('./data/elements.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Dataset successfully loaded:', data);
        elementsData = data; // Store it globally
        
        // Render the periodic table elements on the screen
        renderPeriodicTable(elementsData);
        
        // Initialize your search feature now that data is available
        setupSearch();
    })
    .catch(error => {
        console.error('Fetch error:', error);
        const tableContainer = document.getElementById('periodic-table');
        if (tableContainer) {
            tableContainer.innerHTML = `<p class="error">Failed to load elements.json dataset</p>`;
        }
    });

// Function to render the elements into your CSS Grid container
function renderPeriodicTable(elements) {
    const tableContainer = document.getElementById('periodic-table');
    if (!tableContainer) return;
    
    tableContainer.innerHTML = ''; // Clear previous contents

    elements.forEach(element => {
        const card = document.createElement('div');
        // Adds classes like "element-card noble-gas" or "element-card nonmetal"
        const categoryClass = element.category.toLowerCase().replace(/ /g, '-');
        card.className = `element-card ${categoryClass}`;
        
        // Position the card using your CSS Grid row and column positions
        card.style.gridRow = element.row;
        card.style.gridColumn = element.column;
        
        // Build the inner HTML structure matching your CSS classes
        card.innerHTML = `
            <div class="atomic-number">${element.atomicNumber}</div>
            <div class="symbol">${element.symbol}</div>
            <div class="name">${element.name}</div>
        `;
        
        // Click event to show detailed information when clicked
        card.addEventListener('click', () => showElementDetails(element));
        
        tableContainer.appendChild(card);
    });
}

// Function to handle the search box input filtering
function setupSearch() {
    const searchInput = document.getElementById('search-input') || document.querySelector('input[type="text"]');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        const filteredElements = elementsData.filter(element => {
            return (
                element.name.toLowerCase().includes(query) ||
                element.symbol.toLowerCase().includes(query) ||
                element.atomicNumber.toString().includes(query)
            );
        });
        
        renderPeriodicTable(filteredElements);
    });
}

// Placeholder function for clicking cards (expand this to open your modal/sidebar)
function showElementDetails(element) {
    console.log('Selected element details:', element);
    // Add your sidebar or modal pop-up code here if you have one!
}
