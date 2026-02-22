document.addEventListener("DOMContentLoaded", () => {
  const bestiaryGrid = document.getElementById("bestiaryGrid");
  const menuToggle = document.getElementById("menuToggle");
  const menuIcon = document.getElementById("menuIcon");
  const mainNav = document.querySelector(".main-nav");

  // Fetch the bestiary data
  fetch("bestiary_data.json")
    .then((response) => response.json())
    .then((data) => {
      renderGrid(data);
    })
    .catch((error) => {
      console.error("Error loading bestiary data:", error);
      bestiaryGrid.innerHTML =
        '<p class="error-message">Error loading data. Please check console.</p>';
    });

  function renderGrid(data) {
    bestiaryGrid.innerHTML = "";

    data.forEach((beast) => {
      const card = document.createElement("a");
      card.href = `index.html?id=${beast.id}`;
      card.classList.add("mini-card");

      const imagePath = `assets/Bestiary/${beast.id}.png`;

      card.innerHTML = `
        <div class="mini-card-image-container">
          <img src="${imagePath}" alt="${beast.name}" class="mini-card-image" onerror="this.src='assets/heart.gif'">
        </div>
        <div class="mini-card-id">#${beast.id}</div>
        <div class="mini-card-name">${beast.name}</div>
      `;

      bestiaryGrid.appendChild(card);
    });
  }

  // Mobile Menu Toggle
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      mainNav.classList.toggle("nav-visible");
      document.body.classList.toggle("no-scroll");
    });

    // Close menu when clicking a link
    const navLinks = mainNav.querySelectorAll("ul a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("nav-visible");
        document.body.classList.remove("no-scroll");
      });
    });
  }
});
