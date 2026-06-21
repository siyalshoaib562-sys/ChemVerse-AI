// ==========================================
// CHEMVERSE AI - MAIN CORE LOGIC
// ==========================================

let elementsData = [];

const periodicTable = document.getElementById("periodicTable");
const searchBox = document.getElementById("searchBox");
const modal = document.getElementById("elementModal");
const elementInfo = document.getElementById("elementInfo");
const closeBtn = document.getElementById("closeBtn");

// 1. FETCH ELEMENTS DATABANK
async function loadElements() {
    try {
        const response = await fetch("data/elements.json");
        elementsData = await response.json();
        renderElements(elementsData);
    } catch (error) {
        console.error("Data tracking reference breakdown:", error);
        periodicTable.innerHTML = `<h2 style="color:#ef4444; grid-column: span 18; text-align: center; margin-top: 50px;">Failed to load elements.json dataset</h2>`;
    }
}

// 2. RENDER THE INTERACTIVE PERIODIC TABLE GRID
function renderElements(elements) {
    periodicTable.innerHTML = "";

    elements.forEach(element => {
        const card = document.createElement("div");
        card.classList.add("element");

        // Map layout positions coordinates
        if (element.row && element.column) {
            card.style.gridRowStart = element.row;
            card.style.gridColumnStart = element.column;
        }

        // Apply chemical classification styles
        if (element.category) {
            const cleanCategory = element.category.toLowerCase().replace(/\s+/g, '-');
            card.classList.add(cleanCategory);
        }

        card.innerHTML = `
            <div class="atomic-num">${element.atomicNumber}</div>
            <div class="symbol">${element.symbol}</div>
            <div class="name">${element.name}</div>
        `;

        // Handle click card interactions
        card.addEventListener("click", () => {
            showElementDetails(element);
        });

        periodicTable.appendChild(card);
    });
}

// 3. GENERATE METRIC SPECS MODAL CARD DATA VIEW
function showElementDetails(element) {
    modal.style.display = "flex";

    elementInfo.innerHTML = `
        <h2 style="font-size: 24px; border-bottom: 2px solid rgba(255,255,255,0.1); padding-bottom: 10px; margin-bottom: 15px;">
            ${element.name} (${element.symbol})
        </h2>
        <div class="info-grid">
            <div class="info-card"><h3>Atomic Number</h3><p>${element.atomicNumber}</p></div>
            <div class="info-card"><h3>Atomic Mass</h3><p>${element.atomicMass} u</p></div>
            <div class="info-card"><h3>Density</h3><p>${element.density ? element.density + ' g/cm³' : 'Unknown'}</p></div>
            <div class="info-card"><h3>Melting Point</h3><p>${element.meltingPoint ? element.meltingPoint + ' K' : 'Unknown'}</p></div>
            <div class="info-card"><h3>Boiling Point</h3><p>${element.boilingPoint ? element.boilingPoint + ' K' : 'Unknown'}</p></div>
            <div class="info-card"><h3>Electron Configuration</h3><p>${element.electronConfiguration || 'Unknown'}</p></div>
            <div class="info-card"><h3>Chemical Category</h3><p>${element.category || 'Unknown'}</p></div>
            <div class="info-card"><h3>Common Application / Uses</h3><p>${element.uses || 'Unknown'}</p></div>
            <div class="info-card"><h3>Discovery Attribution</h3><p>${element.discoveredBy || 'Unknown'}</p></div>
        </div>
    `;
}

// 4. CLOSING ACTIONS INTERFACES FOR MODAL CARDS
if (closeBtn) {
    closeBtn.addEventListener("click", () => { modal.style.display = "none"; });
}
window.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

// 5. INTERACTIVE LIVE SEARCH BAR STRIP ALGORITHM
searchBox.addEventListener("input", () => {
    const keyword = searchBox.value.toLowerCase().trim();
    const filtered = elementsData.filter(element => {
        return (
            element.name.toLowerCase().includes(keyword) ||
            element.symbol.toLowerCase().includes(keyword) ||
            String(element.atomicNumber).includes(keyword)
        );
    });
    renderElements(filtered);
});

// Initialize process execution sequences
loadElements();
