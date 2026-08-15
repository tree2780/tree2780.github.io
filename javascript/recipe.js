document.addEventListener("DOMContentLoaded", function() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const recipes = document.querySelectorAll(".recipe");
    const searchInput = document.getElementById("recipeSearch");

    // ==========================================
    // Filter Buttons Logic
    // ==========================================
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const isActive = button.classList.contains("active");
            
            // Remove active class from all
            filterButtons.forEach(btn => btn.classList.remove("active"));
            
            // Toggle active class
            if (!isActive) {
                button.classList.add("active");
            }
            
            updateRecipes();
        });
    });

    // ==========================================
    // Search Logic (Bonus functionality)
    // ==========================================
    searchInput.addEventListener("input", updateRecipes);

    // ==========================================
    // Main Update Function
    // ==========================================
    function updateRecipes() {
        const activeButton = document.querySelector(".filter-btn.active");
        const searchQuery = searchInput.value.toLowerCase();
        
        const filter = activeButton ? activeButton.dataset.filter : null;

        recipes.forEach(recipe => {
            const recipeTitle = recipe.querySelector("h2").textContent.toLowerCase();
            const matchesFilter = !filter || recipe.dataset.type === filter;
            const matchesSearch = recipeTitle.includes(searchQuery);

            if (matchesFilter && matchesSearch) {
                recipe.style.display = "block";
            } else {
                recipe.style.display = "none";
            }
        });
    }

    // ==========================================
    // Floating Dock Active State Logic
    // ==========================================
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