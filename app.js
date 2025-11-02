/* add your code here */

// 🌟 Stock Portfolio Dashboard - Refactored Version

document.addEventListener("DOMContentLoaded", () => {
  // Parse JSON data from global variables
  const stocksData = JSON.parse(stockContent);
  const userData = JSON.parse(userContent);

  // Get buttons
  const saveButton = document.querySelector("#saveUser");
  const deleteButton = document.querySelector("#deleteUser");

  // Body styling for soft gradient background
  document.body.style.background = "linear-gradient(135deg, #dbeafe, #bfdbfe, #93c5fd)";
  document.body.style.fontFamily = "'Poppins', sans-serif";
  document.body.style.minHeight = "100vh";

  /**
   * Create the user list dynamically
   */
  const generateUserList = (users, stocks) => {
    const userList = document.querySelector(".user-list");
    userList.innerHTML = ""; // clear before re-render

    users.forEach(({ user, id }) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${user.lastname}, ${user.firstname}`;
      listItem.id = id;
      listItem.classList.add("user-item");
      listItem.style.transition = "transform 0.2s ease, background-color 0.2s ease";

      // Simple hover animation
      listItem.addEventListener("mouseenter", () => (listItem.style.background = "#e0f2fe"));
      listItem.addEventListener("mouseleave", () => (listItem.style.background = "#f8fafc"));

      userList.appendChild(listItem);
    });

    // Register event on the list container
    userList.addEventListener("click", (e) => handleUserListClick(e, users, stocks));
  };

  /**
   * Handle click on user list
   */
  const handleUserListClick = (e, users, stocks) => {
    const selectedId = e.target.id;
    if (!selectedId) return;

    const selectedUser = users.find((u) => u.id == selectedId);
    populateForm(selectedUser);
    renderPortfolio(selectedUser, stocks);
  };

  /**
   * Fill the user form with selected user's data
   */
  const populateForm = ({ user, id }) => {
    const fields = ["firstname", "lastname", "address", "city", "email"];
    document.querySelector("#userID").value = id;

    fields.forEach((field) => {
      document.querySelector(`#${field}`).value = user[field];
    });
  };

  /**
   * Render the user’s portfolio
   */
  const renderPortfolio = (user, stocks) => {
    const { portfolio } = user;
    const portfolioContainer = document.querySelector(".portfolio-list");
    portfolioContainer.innerHTML = "";

    portfolio.forEach(({ symbol, owned }) => {
      const card = document.createElement("div");
      card.classList.add("portfolio-card");
      card.innerHTML = `
        <p><strong>${symbol}</strong></p>
        <p>Shares: ${owned}</p>
        <button class="view-btn" id="${symbol}">View</button>
      `;

      // Style each portfolio card
      card.style.display = "flex";
      card.style.justifyContent = "space-between";
      card.style.alignItems = "center";
      card.style.background = "#ffffff";
      card.style.borderRadius = "10px";
      card.style.padding = "10px";
      card.style.marginBottom = "8px";
      card.style.boxShadow = "0 1px 6px rgba(0,0,0,0.1)";
      card.style.animation = "fadeIn 0.4s ease";

      portfolioContainer.appendChild(card);
    });

    // Handle view button clicks
    portfolioContainer.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") viewStock(e.target.id, stocks);
    });
  };

  /**
   * Display stock info when "View" is clicked
   */
  const viewStock = (symbol, stocks) => {
    const stock = stocks.find((s) => s.symbol === symbol);
    if (!stock) return;

    document.querySelector("#stockName").textContent = stock.name;
    document.querySelector("#stockSector").textContent = stock.sector;
    document.querySelector("#stockIndustry").textContent = stock.subIndustry;
    document.querySelector("#stockAddress").textContent = stock.address;
    document.querySelector("#logo").src = `logos/${symbol}.svg`;

    const stockForm = document.querySelector(".stock-form");
    stockForm.style.background = "linear-gradient(120deg, #e0f2fe, #f0f9ff)";
    stockForm.style.borderRadius = "10px";
    stockForm.style.transition = "background 0.4s ease";
  };

  /**
   * Delete a user from the list
   */
  deleteButton.addEventListener("click", (e) => {
    e.preventDefault();

    const userId = document.querySelector("#userID").value;
    const index = userData.findIndex((u) => u.id == userId);
    if (index >= 0) {
      userData.splice(index, 1);
      generateUserList(userData, stocksData);
    }

    document.querySelector(".portfolio-list").innerHTML = "";
    document.querySelector("#userForm").reset();
  });

  /**
   * Save (update) user info
   */
  saveButton.addEventListener("click", (e) => {
    e.preventDefault();

    const id = document.querySelector("#userID").value;
    const user = userData.find((u) => u.id == id);
    if (!user) return;

    user.user.firstname = document.querySelector("#firstname").value;
    user.user.lastname = document.querySelector("#lastname").value;
    user.user.address = document.querySelector("#address").value;
    user.user.city = document.querySelector("#city").value;
    user.user.email = document.querySelector("#email").value;

    generateUserList(userData, stocksData);
  });

  // Animate fade-in for main elements
  const fadeInElements = document.querySelectorAll(".user-list, .portfolio-list, .stock-form");
  fadeInElements.forEach((el) => {
    el.style.opacity = 0;
    setTimeout(() => {
      el.style.transition = "opacity 0.8s ease";
      el.style.opacity = 1;
    }, 200);
  });

  // Initialize dashboard
  generateUserList(userData, stocksData);
});