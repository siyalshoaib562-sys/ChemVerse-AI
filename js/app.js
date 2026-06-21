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

const settingsToggleBtn = document.getElementById("settingsToggleBtn");
const apiSettingsPanel = document.getElementById("apiSettingsPanel");
const apiKeyInput = document.getElementById("apiKeyInput");
const saveKeyBtn = document.getElementById("saveKeyBtn");

// Load elements database configuration
async function loadElements() {
    try {
        const response = await fetch("data/elements.json");
        elementsData = await response.json();
        renderElements(elementsData);
    } catch (error) {
        console.error("Failed to load elements:", error);
        periodicTable.innerHTML = `<h2 style="color:red; grid-column: span 18; text-align: center;">Failed to load elements.json</h2>`;
    }
}

// Render interface columns
function renderElements(elements) {
    periodicTable.innerHTML = "";

    elements.forEach(element => {
        const card = document.createElement("div");
        card.classList.add("element");

        if (element.row && element.column) {
            card.style.gridRowStart = element.row;
            card.style.gridColumnStart = element.column;
        }

        if (element.category) {
            const cleanCategory = element.category.toLowerCase().replace(/\s+/g, '-');
            card.classList.add(cleanCategory);
        }

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

// Display element modal details
function showElementDetails(element) {
    modal.style.display = "flex";

    elementInfo.innerHTML = `
        <h2>${element.name} (${element.symbol})</h2>
        <div class="info-grid">
            <div class="info-card"><h3>Atomic Number</h3><p>${element.atomicNumber}</p></div>
            <div class="info-card"><h3>Atomic Mass</h3><p>${element.atomicMass}</p></div>
            <div class="info-card"><h3>Density</h3><p>${element.density || 'Unknown'}</p></div>
            <div class="info-card"><h3>Melting Point</h3><p>${element.meltingPoint || 'Unknown'}</p></div>
            <div class="info-card"><h3>Boiling Point</h3><p>${element.boilingPoint || 'Unknown'}</p></div>
            <div class="info-card"><h3>Electron Configuration</h3><p>${element.electronConfiguration || 'Unknown'}</p></div>
            <div class="info-card"><h3>Category</h3><p>${element.category || 'Unknown'}</p></div>
            <div class="info-card"><h3>Uses</h3><p>${element.uses || 'Unknown'}</p></div>
            <div class="info-card"><h3>Discovered By</h3><p>${element.discoveredBy || 'Unknown'}</p></div>
        </div>
    `;
}

if (closeBtn) {
    closeBtn.addEventListener("click", () => { modal.style.display = "none"; });
}
window.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

// Interactive search filter interface
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

// Chatbot UI message router
function addMessage(message, sender) {
    const div = document.createElement("div");
    div.classList.add("chat-message", sender);
    div.textContent = message;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Network interface connection layer to Google Gemini API
async function askGeminiAI(question) {
    const savedKey = localStorage.getItem("gemini_api_key");

    if (!savedKey) {
        const q = question.toLowerCase();
        if (q.includes("hydrogen")) return "Hydrogen is the lightest chemical element with atomic number 1.";
        if (q.includes("oxygen")) return "Oxygen has atomic number 8 and is essential for respiration.";
        if (q.includes("carbon")) return "Carbon is the foundation of organic chemistry and life.";
        return "Offline Mode: Click the ⚙️ gear icon above and paste a Gemini API Key to make me smart!";
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${savedKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `You are an expert chemistry teaching assistant. Answer this query cleanly: ${question}` }] }]
            })
        });

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("AI Fetch Error:", error);
        return "Failed to connect to Gemini AI. Check your internet connection or verify your API key.";
    }
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, "user");
    userInput.value = "";

    addMessage("Thinking...", "bot");
    const lastBotMessage = chatMessages.lastChild;

    const reply = await askGeminiAI(text);
    lastBotMessage.textContent = reply;
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// View toggle controller hooks
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

if (settingsToggleBtn) {
    settingsToggleBtn.addEventListener("click", () => {
        apiSettingsPanel.classList.toggle("hidden");
        const savedKey = localStorage.getItem("gemini_api_key");
        if (savedKey) apiKeyInput.value = savedKey;
    });
}

if (saveKeyBtn) {
    saveKeyBtn.addEventListener("click", () => {
        const key = apiKeyInput.value.trim();
        if (key) {
            localStorage.setItem("gemini_api_key", key);
            alert("Gemini API Key securely saved on your device!");
            apiSettingsPanel.classList.add("hidden");
        } else {
            localStorage.removeItem("gemini_api_key");
            alert("API Key cleared.");
        }
    });
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(); });

loadElements();
