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
        
        // Target your container where the grid elements should be rendered
        const tableContainer = document.getElementById('periodic-table'); 
        if (tableContainer) {
            // Clear any previous error text or loading messages
            tableContainer.innerHTML = ''; 
            
            // Render your elements into the layout
            data.forEach(element => {
                const card = document.createElement('div');
                card.className = `element-card ${element.category.toLowerCase().replace(/ /g, '-')}`;
                card.style.gridRow = element.row;
                card.style.gridColumn = element.column;
                
                card.innerHTML = `
                    <div class="atomic-number">${element.atomicNumber}</div>
                    <div class="symbol">${element.symbol}</div>
                    <div class="name">${element.name}</div>
                `;
                
                tableContainer.appendChild(card);
            });
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        
        // Target your exact display error layout from the screen
        const errorContainer = document.querySelector('.main-content') || document.body;
        if (errorContainer) {
            errorContainer.innerHTML = `
                <div style="text-align: center; margin-top: 50px;">
                    <h2 style="color: #ff4d4d; font-family: sans-serif;">Failed to load elements.json dataset</h2>
                    <p style="color: #888;">Please verify the data folder structure on GitHub.</p>
                </div>
            `;
        }
    });
