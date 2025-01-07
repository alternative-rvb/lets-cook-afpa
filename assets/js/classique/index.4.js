console.log("index.js loaded");

// Sélection des éléments HTML
const recipeContainer = document.querySelector(".recipes");
const searchBarElement = document.querySelector(".search-bar");
const filter1Element = document.querySelector("#filter1");
const filter2Element = document.querySelector("#filter2");

// Stocke les filtres actuels
let currentKeyWord = "";
console.log("currentKeyWord:", currentKeyWord);
let currentFilter = "";
let currentLimit = "";

// Fonction pour récupérer les données
const fetchData = async (keyWord = "", filterSortBy = "", limit = 12) => {
  const queryKeyWord = keyWord ? `/search?q=${keyWord}` : "";
  const queryFilter = filterSortBy ? `${queryKeyWord ? "&" : "?"}${filterSortBy}` : "";
  const queryLimit = limit ? `${queryKeyWord || queryFilter ? "&" : "?"}limit=${limit}` : "";

  const url = `https://dummyjson.com/recipes${queryKeyWord}${queryFilter}${queryLimit}`;
  console.log("url:", url);

  const response = await fetch(url);
  const data = await response.json();
  return data;
};

// Fonction pour afficher les données
const displayData = async (keyWord, filterSortBy, limit) => {
  recipeContainer.innerHTML = "Chargement en cours...";

  const data = await fetchData(keyWord, filterSortBy, limit);
  recipeContainer.innerHTML = "";

  if (!data.recipes || data.recipes.length === 0) {
    recipeContainer.innerHTML = "<p>Aucune recette trouvée.</p>";
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
    recipeContainer.appendChild(article);
  });
};

// Appel initial
displayData();

// Gestion des événements pour la barre de recherche
searchBarElement.addEventListener("input", (e) => {
  currentKeyWord = e.target.value.trim().toLowerCase();
  console.log("currentKeyWord:", currentKeyWord);
  displayData(currentKeyWord, currentFilter, currentLimit);
});

// Gestion des événements pour le premier filtre
filter1Element.addEventListener("change", (e) => {
  let value = "";
  switch (e.target.value) {
    case "name-asc":
      value = "sortBy=name&order=asc";
      break;
    case "name-desc":
      value = "sortBy=name&order=desc";
      break;
    case "id-asc":
      value = "sortBy=id&order=asc";
      break;
    case "id-desc":
      value = "sortBy=id&order=desc";
      break;
    default:
      value = "";
      break;
  }

  currentFilter = value;
  displayData(currentKeyWord, currentFilter, currentLimit);
});

// Gestion des événements pour le deuxième filtre
filter2Element.addEventListener("change", (e) => {
  let value = "";
  switch (e.target.value) {
    case "4":
      value = 4;
      break;
    case "8":
      value = 8;
      break;
    case "12":
      value = 12;
      break;
    case "24":
      value = 24;
      break;
    case "36":
      value = 36;
      break;
    default:
      value = "";
      break;
  }
  currentLimit = value;
  displayData(currentKeyWord, currentFilter, currentLimit);
});
