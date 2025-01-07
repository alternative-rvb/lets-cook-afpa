export default class Recipe {
  constructor(
    recipesSelector,
    searchBarSelector,
    filter1Selector,
    filter2Selector
  ) {
    this.recipeContainer = document.querySelector(recipesSelector);
    this.searchBarElement = document.querySelector(searchBarSelector);
    this.filter1Element = document.querySelector(filter1Selector);
    this.filter2Element = document.querySelector(filter2Selector);

    if (
      !this.recipeContainer ||
      !this.searchBarElement ||
      !this.filter1Element ||
      !this.filter2Element
    ) {
      console.error("Un ou plusieurs éléments HTML sont introuvables.");
      return;
    }

    this.currentKeyWord = "";
    this.currentFilter = "";
    this.currentLimit = 12;

    this.init();
  }

  async fetchData(keyWord = "", filterSortBy = "", limit = 12) {
    const queryKeyWord = keyWord ? `/search?q=${keyWord}` : "";
    const queryFilter = filterSortBy
      ? `${queryKeyWord ? "&" : "?"}${filterSortBy}`
      : "";
    const queryLimit = limit
      ? `${queryKeyWord || queryFilter ? "&" : "?"}limit=${limit}`
      : "";

    const url = `https://dummyjson.com/recipes${queryKeyWord}${queryFilter}${queryLimit}`;
    console.log("url:", url);

    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  async displayData(keyWord = "", filterSortBy = "", limit = 12) {
    this.recipeContainer.innerHTML = "Chargement en cours...";

    const data = await this.fetchData(keyWord, filterSortBy, limit);
    this.recipeContainer.innerHTML = "";

    if (!data.recipes || data.recipes.length === 0) {
      this.recipeContainer.innerHTML = "<p>Aucune recette trouvée.</p>";
      return;
    }

    data.recipes.forEach((element) => {
      const article = document.createElement("article");
      article.classList.add("recipe");
      article.innerHTML = `
        <div class="recipe__image-container">
          <img class="recipe__image" src="${element.image}" alt="${element.title}">
        </div>
        <h3 class="recipe__title">${element.name} - ${element.id}</h3>
        <p class="recipe__ingredients">${element.ingredients}</p>
        <p class="recipe__links">
          <a href="recette.html?id=${element.id}&name=${element.name}">Voir la recette →</a>
        </p>
      `;
      this.recipeContainer.appendChild(article);
    });
  }

  handleSearchInput = (event) => {
    this.currentKeyWord = event.target.value.trim().toLowerCase();
    console.log("currentKeyWord:", this.currentKeyWord);
    this.displayData(
      this.currentKeyWord,
      this.currentFilter,
      this.currentLimit
    );
  };

  handleFilter1Change = (event) => {
    switch (event.target.value) {
      case "name-asc":
        this.currentFilter = "sortBy=name&order=asc";
        break;
      case "name-desc":
        this.currentFilter = "sortBy=name&order=desc";
        break;
      case "id-asc":
        this.currentFilter = "sortBy=id&order=asc";
        break;
      case "id-desc":
        this.currentFilter = "sortBy=id&order=desc";
        break;
      default:
        this.currentFilter = "";
    }
    this.displayData(
      this.currentKeyWord,
      this.currentFilter,
      this.currentLimit
    );
  };

  handleFilter2Change = (event) => {
    switch (event.target.value) {
      case "4":
        this.currentLimit = 4;
        break;
      case "8":
        this.currentLimit = 8;
        break;
      case "12":
        this.currentLimit = 12;
        break;
      case "24":
        this.currentLimit = 24;
        break;
      case "36":
        this.currentLimit = 36;
        break;
      default:
        this.currentLimit = "";
    }
    this.displayData(
      this.currentKeyWord,
      this.currentFilter,
      this.currentLimit
    );
  };

  init() {
    this.searchBarElement.addEventListener("input", this.handleSearchInput);
    this.filter1Element.addEventListener("change", this.handleFilter1Change);
    this.filter2Element.addEventListener("change", this.handleFilter2Change);
    this.displayData();
  }
}

// Utilisation de la classe
// const recipesApp = new Recipe(".recipes", ".search-bar", "#filter1", "#filter2");
// recipesApp.init();
