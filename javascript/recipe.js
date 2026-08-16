document.addEventListener("DOMContentLoaded", function() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const recipes = document.querySelectorAll(".recipe");
    const searchInput = document.getElementById("recipeSearch");

    const generateBtn = document.getElementById("generateRecipeBtn");
    const resultContainer = document.getElementById("recipeResultContainer");

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

    if (searchInput) {
        searchInput.addEventListener("input", updateRecipes);
    }

    function updateRecipes() {
        const activeButton = document.querySelector(".filter-btn.active");
        const searchQuery = searchInput ? searchInput.value.toLowerCase() : "";
        
        const filter = activeButton ? activeButton.dataset.filter : null;

        recipes.forEach(recipe => {
            // Safety check: Don't hide the AI Generator card when filtering
            if (recipe.id === "ai-generator-card") return;

            const recipeTitleEl = recipe.querySelector("h2");
            const recipeTitle = recipeTitleEl ? recipeTitleEl.textContent.toLowerCase() : "";
            
            const matchesFilter = !filter || recipe.dataset.type === filter;
            const matchesSearch = recipeTitle.includes(searchQuery);

            if (matchesFilter && matchesSearch) {
                recipe.style.display = "block";
            } else {
                recipe.style.display = "none";
            }
        });
    }

    const currentPath = window.location.pathname.split("/").pop();
    const dockItems = document.querySelectorAll(".dock-item");

    if (dockItems.length > 0) {
        dockItems.forEach(item => {
            item.classList.remove("active");
            const itemHref = item.getAttribute("href");
            
            if (itemHref === currentPath || (currentPath === "" && itemHref === "index.html")) {
                item.classList.add("active");
            }
        });
    }

    if (generateBtn) {
        generateBtn.addEventListener("click", async () => {
            resultContainer.style.display = "block";
            resultContainer.innerHTML = `<p style="color: var(--sif-grey);">Scanning your fridge inventory...</p>`;

            try {
                // 1. Fetch the fridge data from the provided ingredients.json file
                const response = await fetch("../data/ingredients.json"); 
                const fridgeData = await response.json();
                
                // 2. Filter for fresh items and extract their names
                const freshIngredients = fridgeData
                    .filter(item => item.type === "fresh")
                    .map(item => item.name);
                
                if (freshIngredients.length === 0) {
                    resultContainer.innerHTML = `<p style="color: var(--sif-primary); font-weight: 600;">You don't have any fresh ingredients to cook with!</p>`;
                    return;
                }

                // 3. Select an ingredient to search with
                const searchIngredient = freshIngredients[0]; 
                resultContainer.innerHTML = `<p style="color: var(--sif-grey);">Finding a recipe using <strong>${searchIngredient}</strong>...</p>`;

                // 4. Query the API for meals containing this ingredient
                const apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchIngredient}`);
                const data = await apiResponse.json();

                if (data.meals && data.meals.length > 0) {
                    const randomMeal = data.meals[Math.floor(Math.random() * data.meals.length)];
                    
                    // 5. SECOND FETCH: Get the full recipe details using the meal ID
                    resultContainer.innerHTML = `<p style="color: var(--sif-grey);">Fetching instructions for <strong>${randomMeal.strMeal}</strong>...</p>`;
                    
                    const detailResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${randomMeal.idMeal}`);
                    const detailData = await detailResponse.json();
                    const fullMeal = detailData.meals[0];

                    // 6. Determine the best link to show (Source URL > YouTube > Google Search Fallback)
                    const recipeLink = fullMeal.strSource || fullMeal.strYoutube || `https://www.google.com/search?q=${encodeURIComponent(fullMeal.strMeal + ' recipe')}`;
                    
                    // 7. Display the result
                    resultContainer.innerHTML = `
                        <div style="border-top: 1px solid var(--sif-border); padding-top: 15px; margin-top: 15px;">
                            <h3 style="margin-bottom: 10px; color: var(--sif-black); font-size: 1.1rem;">${fullMeal.strMeal}</h3>
                            <img src="${fullMeal.strMealThumb}" alt="${fullMeal.strMeal}" style="width: 100%; border-radius: 12px; margin-bottom: 15px; object-fit: cover; border: 1px solid var(--sif-border);">
                            <p style="font-size: 0.95rem; color: var(--sif-grey); margin-bottom: 15px;">
                                Perfect! This recipe uses your fresh <strong>${searchIngredient}</strong>.
                            </p>
                            <a href="${recipeLink}" target="_blank" style="display: block; text-align: center; background-color: var(--sif-primary); color: white; padding: 12px; border-radius: 12px; text-decoration: none; font-weight: 600; transition: opacity 0.2s ease;">
                                View Full Recipe
                            </a>
                        </div>
                    `;
                } else {
                    resultContainer.innerHTML = `<p style="color: var(--sif-grey);">We couldn't find a specific recipe for <strong>${searchIngredient}</strong> right now. Try adding different ingredients!</p>`;
                }

            } catch (error) {
                console.error("Error generating recipe:", error);
                resultContainer.innerHTML = `<p style="color: var(--sif-primary); font-weight: 600;">Error loading fridge data. Please ensure ingredients.json is accessible via a local server.</p>`;
            }
        });
    }
});