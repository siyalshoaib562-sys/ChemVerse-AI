// ============================
// CHEMVERSE AI
// app.js
// ============================

let elementsData = [];

const periodicTable = document.getElementById("periodicTable");
const searchBox = document.getElementById("searchBox");

const modal = document.getElementById("elementModal");
const elementInfo = document.getElementById("elementInfo");
const closeBtn = document.getElementById("closeBtn");

const chatMessages = document.getElementById("chatMessages");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

const chatToggleBtn = document.getElementById("chatToggleBtn");
const chatbotContainer = document.getElementById("chatbot");

// ============================
// LOAD ELEMENTS JSON
// ============================

async function loadElements() {
    try {
        const response = await fetch("data/elements.json");
        elementsData = await response.json();
        renderElements(elementsData);
    } catch (error) {
        console.error("Failed to load elements:", error);
        periodicTable.innerHTML = `
            <h2 style="color:red; grid-column: span 18; text-align: center;">
                Failed to load elements.json
            </h2>
        `;
    }
}

// ============================
// RENDER ELEMENTS
// ============================

function renderElements(elements) {
    periodicTable.innerHTML = "";

    elements.forEach(element => {
        const card = document.createElement("div");
        card.classList.add("element");

        // Dynamic positioning coordinates matching style.css layout selectors
        if (element.row && element.column) {
            card.style.gridRowStart = element.row;
            card.style.gridColumnStart = element.column;
        }

        // Apply clean standard category parameters
        if (element.category) {
            const cleanCategory = element.category.toLowerCase().replace(/\s+/g, '-');
            card.classList.add(cleanCategory);
        }

        // Inner structures mapped to match styling rules perfectly
        card.innerHTML = `
            <div class="atomic-num">${element.atomicNumber}</div>
            <div class="symbol">${element.symbol}</div>
            <div class="name">${element.name}</div>
        `;

        card.addEventListener("click", () => {
            showElementDetails(element);
        });

        periodicTable.appendChild(card);
    });
}

// ============================
// ELEMENT DETAILS MODAL
// ============================

function showElementDetails(element) {
    modal.style.display = "flex";

    elementInfo.innerHTML = `
        <h2>${element.name} (${element.symbol})</h2>
        <div class="info-grid">
            <div class="info-card">
                <h3>Atomic Number</h3>
                <p>${element.atomicNumber}</p>
            </div>
            <div class="info-card">
                <h3>Atomic Mass</h3>
                <p>${element.atomicMass}</p>
            </div>
            <div class="info-card">
                <h3>Density</h3>
                <p>${element.density || 'Unknown'}</p>
            </div>
            <div class="info-card">
                <h3>Melting Point</h3>
                <p>${element.meltingPoint || 'Unknown'}</p>
            </div>
            <div class="info-card">
                <h3>Boiling Point</h3>
                <p>${element.boilingPoint || 'Unknown'}</p>
            </div>
            <div class="info-card">
                <h3>Electron Configuration</h3>
                <p>${element.electronConfiguration || 'Unknown'}</p>
            </div>
            <div class="info-card">
                <h3>Category</h3>
                <p>${element.category || 'Unknown'}</p>
            </div>
            <div class="info-card">
                <h3>Uses</h3>
                <p>${element.uses || 'Unknown'}</p>
            </div>
            <div class="info-card">
                <h3>Discovered By</h3>
                <p>${element.discoveredBy || 'Unknown'}</p>
            </div>
        </div>
    `;
}

// ============================
// CLOSE MODAL EVENTS
// ============================

closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// ============================
// SEARCH LOGIC
// ============================

searchBox.addEventListener("input", () => {
    const keyword = searchBox.value.toLowerCase();

    const filtered = elementsData.filter(element => {
        return (
            element.name.toLowerCase().includes(keyword) ||
            element.symbol.toLowerCase().includes(keyword) ||
            String(element.atomicNumber).includes(keyword)
        );
    });

    renderElements(filtered);
});

// ============================
// CHATBOT HANDLING UI
// ============================

function addMessage(message, sender) {
    const div = document.createElement("div");
    div.classList.add("chat-message", sender);
    div.textContent = message;

    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function localChemistryBot(question) {
    const q = question.toLowerCase();

    if (q.includes("hydrogen")) {
        return "Hydrogen is the lightest chemical element with atomic number 1.";
    }
    if (q.includes("oxygen")) {
        return "Oxygen has atomic number 8 and is essential for respiration.";
    }
    if (q.includes("carbon")) {
        return "Carbon is the foundation of organic chemistry and life.";
    }
    if (q.includes("periodic table")) {
        return "The periodic table organizes all chemical elements by atomic number.";
    }
    if (q.includes("atom")) {
        return "An atom is the smallest unit of an element that retains its properties.";
    }

    return "I couldn't find that in offline mode. Connect an AI API for advanced chemistry answers.";
}

function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, "user");
    userInput.value = "";

    const reply = localChemistryBot(text);

    setTimeout(() => {
        addMessage(reply, "bot");
    }, 500);
}

// ============================
// CHATBOT VISIBILITY TOGGLE
// ============================

chatToggleBtn.addEventListener("click", () => {
    chatbotContainer.classList.toggle("active");
    
    if (chatbotContainer.classList.contains("active")) {
        chatToggleBtn.innerHTML = "❌";
        chatToggleBtn.style.background = "#ef4444";
    } else {
        chatToggleBtn.innerHTML = "💬";
        chatToggleBtn.style.background = "linear-gradient(135deg, #2563eb, #1d4ed8)";
    }
});

sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});

// Start application
loadElements();