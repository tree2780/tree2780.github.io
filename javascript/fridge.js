const search = document.querySelector(".search input");
const filter = document.getElementById("filterdropdown");
const ingredientsContainer = document.querySelector(".ingredients");

const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const modal = document.getElementById("addIngredientModal");
const ingredientForm = document.getElementById("ingredientForm");

let ingredientsData = [];

// Fetch ingredients from JSON
async function loadIngredients() {
    try {
        const savedData = localStorage.getItem("fridgeIngredients");
        if (savedData) {
            ingredientsData = JSON.parse(savedData);
        } else {
            const response = await fetch("../data/ingredients.json");
            ingredientsData = await response.json();
        }
        renderIngredients(ingredientsData);
    } catch (error) {
        console.error("Error loading ingredients:", error);
    }
}

// Group items with the same name in batches :D
function groupIngredients(data) {
    const groupedMap = {};

    data.forEach(item => {
        const key = item.name.trim().toLowerCase();
        
        if (!groupedMap[key]) {
            groupedMap[key] = {
                name: item.name,
                type: item.type, 
                items: [] 
            };
        }

        groupedMap[key].items.push({
            quantity: item.quantity,
            expires: item.expires,
            location: item.location,
            type: item.type
        });

        if (item.type.toLowerCase() === "expired") {
            groupedMap[key].type = "expired";
        }
    });

    return Object.values(groupedMap);
}

// Render ingredients
function renderIngredients(data) {
    ingredientsContainer.innerHTML = "";
    
    const groupedData = groupIngredients(data);
    
    groupedData.forEach(group => {
        const details = document.createElement("details");
        details.classList.add("ingredient");
        details.dataset.type = group.type.toLowerCase();

        let batchesHTML = group.items.map(batch => `
            <div class="batch-item" style="margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px dashed #eee;">
                <p><strong>Quantity:</strong> ${batch.quantity}</p>
                <p><strong>Expires:</strong> ${batch.expires}</p>
                <p><strong>Location:</strong> ${batch.location}</p>
            </div>
        `).join("");

        details.innerHTML = `
            <summary>
                <h2>${group.name} <span style="font-size: 0.8rem; color: #666;">(${group.items.length} batch${group.items.length > 1 ? 'es' : ''})</span></h2>
                <span>▼</span>
            </summary>
            <div class="ingredient-content">
                ${batchesHTML}
            </div>
        `;
        ingredientsContainer.appendChild(details);
    });

    updateIngredients(); 
}

// Search and Filter Functionality
function updateIngredients() {
    const searchText = search.value.toLowerCase();
    const filterValue = filter.value.toLowerCase();
    const ingredientCards = document.querySelectorAll(".ingredient");

    ingredientCards.forEach(item => {
        const name = item.querySelector("h2").textContent.toLowerCase();
        const type = item.dataset.type.toLowerCase();

        const matchesSearch = name.includes(searchText);
        const matchesFilter =
            filterValue === "all" ||
            filterValue === "filter" ||
            filterValue === type;

        item.style.display = (matchesSearch && matchesFilter) ? "" : "none";
    });
}

// Event Listeners
search.addEventListener("input", updateIngredients);
filter.addEventListener("change", updateIngredients);

// Modal Controls
openModalBtn.addEventListener("click", () => modal.showModal());
closeModalBtn.addEventListener("click", () => modal.close());

// Handle Adding New Ingredients......
ingredientForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newItem = {
        name: document.getElementById("newName").value,
        type: document.getElementById("newType").value,
        quantity: document.getElementById("newQuantity").value,
        expires: document.getElementById("newExpires").value,
        location: document.getElementById("newLocation").value
    };

    ingredientsData.push(newItem);
    
    localStorage.setItem("fridgeIngredients", JSON.stringify(ingredientsData));

    renderIngredients(ingredientsData);
    
    ingredientForm.reset();
    modal.close();
});

// Initial load
loadIngredients();

// ==========================================
// Floating Dock Active State Logic
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    // Get the current filename (e.g., 'fridge.html')
    const currentPath = window.location.pathname.split("/").pop();
    const dockItems = document.querySelectorAll(".dock-item");

    if (dockItems.length > 0) {
        dockItems.forEach(item => {
            item.classList.remove("active");
            const itemHref = item.getAttribute("href");
            
            // Check if the link matches the current page
            if (itemHref === currentPath || (currentPath === "" && itemHref === "index.html")) {
                item.classList.add("active");
            }
        });
    }
});