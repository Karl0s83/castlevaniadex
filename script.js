document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const resultsContainer = document.getElementById("resultsContainer");

  let bestiaryData = [];

  // Fetch the bestiary data
  fetch("bestiary_data.json")
    .then((response) => response.json())
    .then((data) => {
      bestiaryData = data;
    })
    .catch((error) => {
      console.error("Error loading bestiary data:", error);
      resultsContainer.innerHTML =
        '<p class="error-message">Error loading data. Please check console.</p>';
    });

  function performSearch() {
    const query = searchInput.value.trim().toLowerCase();

    if (query.length === 0) {
      renderPlaceholder();
      return;
    }

    const filteredData = bestiaryData.filter((beast) => {
      const isNumericQuery = /^\d+$/.test(query);

      if (isNumericQuery) {
        return parseInt(beast.id) === parseInt(query);
      }

      // Otherwise, we search by name
      const nameMatch = beast.name.toLowerCase().includes(query);
      return nameMatch;
    });

    renderResults(filteredData);
  }

  // Trigger search on button click
  const searchButton = document.getElementById("searchButton");
  searchButton.addEventListener("click", performSearch);

  // Trigger search on Enter key
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  });

  // Clear results when input is empty
  searchInput.addEventListener("input", (e) => {
    if (e.target.value.trim().length === 0) {
      renderPlaceholder();
    }
  });

  function renderPlaceholder() {
    resultsContainer.innerHTML = `
            <div class="placeholder-message">
                <p>Search for a beast from the castle...</p>
            </div>
        `;
  }

  function renderResults(results) {
    resultsContainer.innerHTML = "";

    if (results.length === 0) {
      renderPlaceholder();
      resultsContainer.innerHTML = `
        <div class="placeholder-message">
            <p>No beast found matching your query.</p>
        </div>
      `;
      return;
    }

    results.forEach((beast) => {
      const card = document.createElement("div");
      card.classList.add("bestiary-card");

      // Image path assumption: assets/Bestiary/{id}.png
      const imagePath = `assets/Bestiary/${beast.id}.png`;

      // Helper to format arrays (Weakness/Drops)
      const formatList = (items, emptyText = "None") => {
        if (!items || items.length === 0) return `<li>${emptyText}</li>`;
        return items.map((item) => `<li>${item}</li>`).join("");
      };

      card.innerHTML = `
            <div class="card-image-container">
                <img src="${imagePath}" alt="${beast.name}" class="card-image" onerror="this.src='assets/heart.gif'"> 
            </div>
            <div class="card-details">
                <div class="card-header">
                    <span class="card-id">#${beast.id}</span>
                    <h2 class="card-name">${beast.name}</h2>
                </div>

                <div class="stats-row">
                    <div class="stat-item">
                        <span class="stat-label">LVL</span>
                        <span class="stat-value">${beast.level || "?"}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">HP</span>
                        <span class="stat-value">${beast.hp || "?"}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">XP</span>
                        <span class="stat-value">${beast.xp || "0"}</span>
                    </div>
                </div>

                <div class="info-grid">
                    <div class="info-column">
                        <h4>Weakness</h4>
                        <ul>${formatList(beast.weak)}</ul>
                    </div>
                    <div class="info-column">
                        <h4>Drops</h4>
                        <ul>${formatList(beast.drops)}</ul>
                    </div>
                </div>

                <p class="card-description">${beast.description}</p>
                <p class="card-location"><span>Location:</span> ${beast.location}</p>
            </div>
        `;

      resultsContainer.appendChild(card);
    });
  }

  // Initial render
  renderPlaceholder();
});
