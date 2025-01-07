export default class Recipe {
  constructor(recipesSelector, searchBarSelector, filter1Selector, filter2Selector) {
    try {
      // Sélection des éléments HTML
      this.recipeContainer = document.querySelector(recipesSelector);
      this.searchBarElement = document.querySelector(searchBarSelector);
      this.filter1Element = document.querySelector(filter1Selector);
      this.filter2Element = document.querySelector(filter2Selector);

      // Vérification des éléments requis
      if (!this.recipeContainer || !this.searchBarElement || !this.filter1Element || !this.filter2Element) {
        throw new Error("Un ou plusieurs éléments HTML requis sont introuvables.");
      }

      // Initialisation des propriétés
      this.currentKeyWord = "";
      this.currentFilter = "";
      this.currentLimit = 10; // Par défaut 10 éléments
      this.currentSkip = 0; // Pagination

      // Création d'un conteneur pour les boutons
      this.paginationContainer = document.createElement("div");
      this.paginationContainer.classList.add("pagination-container");

      // Boutons de pagination
      this.previousButton = document.createElement("button");
      this.previousButton.textContent = "Précédent";
      this.previousButton.classList.add("pagination-button");

      this.nextButton = document.createElement("button");
      this.nextButton.textContent = "Suivant";
      this.nextButton.classList.add("pagination-button");

      // Ajout des boutons au conteneur
      this.paginationContainer.appendChild(this.previousButton);
      this.paginationContainer.appendChild(this.nextButton);

      // Ajout du conteneur après le conteneur des recettes
      this.recipeContainer.insertAdjacentElement("afterend", this.paginationContainer);

      // Initialisation de l'application
      this.init();
    } catch (error) {
      console.error("Erreur dans le constructeur : ", error.message);
    }
  }

  async fetchData(keyWord = "", filterSortBy = "", limit = 10, skip = 0) {
    try {
      const queryKeyWord = keyWord ? `/search?q=${keyWord}` : "";
      const queryFilter = filterSortBy ? `${queryKeyWord ? "&" : "?"}${filterSortBy}` : "";
      const queryLimit = limit ? `${queryKeyWord || queryFilter ? "&" : "?"}limit=${limit}` : "";
      const querySkip = skip ? `${queryKeyWord || queryFilter || queryLimit ? "&" : "?"}skip=${skip}` : "";

      const url = `https://dummyjson.com/recipes${queryKeyWord}${queryFilter}${queryLimit}${querySkip}`;
      console.log("URL générée : ", url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Échec de la requête : ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!data || typeof data !== "object") {
        throw new Error("Les données reçues sont invalides.");
      }

      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération des données : ", error.message);
      this.recipeContainer.innerHTML = "<p>Erreur lors de la récupération des données. Veuillez réessayer plus tard.</p>";
      return { recipes: [] }; // Retourne un tableau vide pour éviter les erreurs dans `displayData`
    }
  }

  async displayData(keyWord = "", filterSortBy = "", limit = 10, skip = 0) {
    try {
      this.recipeContainer.innerHTML = "Chargement en cours...";

      const data = await this.fetchData(keyWord, filterSortBy, limit, skip);

      this.recipeContainer.innerHTML = "";

      if (!data.recipes || data.recipes.length === 0) {
        this.recipeContainer.innerHTML = "<p>Aucune recette trouvée.</p>";
        return;
      }

      data.recipes.forEach((recipe) => {
        const article = document.createElement("article");
        article.classList.add("recipe");
        article.innerHTML = `
          <div class="recipe__image-container">
            <img class="recipe__image" src="${recipe.image}" alt="${recipe.title}">
          </div>
          <h3 class="recipe__title">${recipe.name} - ${recipe.id}</h3>
          <p class="recipe__ingredients">${recipe.ingredients}</p>
          <p class="recipe__links">
            <a href="recette.html?id=${recipe.id}&name=${recipe.name}">Voir la recette →</a>
          </p>
        `;
        this.recipeContainer.appendChild(article);
      });
    } catch (error) {
      console.error("Erreur lors de l'affichage des données : ", error.message);
      this.recipeContainer.innerHTML = "<p>Erreur lors de l'affichage des données. Veuillez réessayer plus tard.</p>";
    }
  }

  handlePagination(direction) {
    // Mise à jour de la valeur de `skip` en fonction de la direction et de la limite actuelle
    if (direction === "next") {
      this.currentSkip += this.currentLimit;
    } else if (direction === "previous" && this.currentSkip >= this.currentLimit) {
      this.currentSkip -= this.currentLimit;
    }

    // Recharge les données avec la nouvelle valeur de `skip`
    this.displayData(this.currentKeyWord, this.currentFilter, this.currentLimit, this.currentSkip);
  }

  init() {
    try {
      if (!this.searchBarElement || !this.filter1Element || !this.filter2Element) {
        throw new Error("Les éléments requis pour l'initialisation ne sont pas disponibles.");
      }

      // Gestion des événements des filtres
      this.searchBarElement.addEventListener("input", (event) => {
        this.currentKeyWord = event.target.value.trim().toLowerCase();
        this.currentSkip = 0; // Réinitialise `skip` pour une nouvelle recherche
        this.displayData(this.currentKeyWord, this.currentFilter, this.currentLimit, this.currentSkip);
      });

      this.filter1Element.addEventListener("change", (event) => {
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
        this.currentSkip = 0; // Réinitialise `skip` pour un nouveau filtre
        this.displayData(this.currentKeyWord, this.currentFilter, this.currentLimit, this.currentSkip);
      });

      this.filter2Element.addEventListener("change", (event) => {
        const value = parseInt(event.target.value, 10) || this.currentLimit;
        this.currentLimit = value;
        this.currentSkip = 0; // Réinitialise `skip` pour le nouveau nombre de posts
        this.displayData(this.currentKeyWord, this.currentFilter, this.currentLimit, this.currentSkip);
      });

      // Gestion des événements des boutons de pagination
      this.nextButton.addEventListener("click", () => this.handlePagination("next"));
      this.previousButton.addEventListener("click", () => this.handlePagination("previous"));

      // Chargement initial des données
      this.displayData();
    } catch (error) {
      console.error("Erreur dans l'initialisation : ", error.message);
    }
  }
}
