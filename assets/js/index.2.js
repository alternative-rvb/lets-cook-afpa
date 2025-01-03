console.log("index.js loaded");

const recipes = document.querySelector(".recipes");

// NEW - Selectionner les éléments HTML filtres
const searcBar = document.querySelector(".search-bar");
const filter1 = document.querySelector("#filter1");
const filter2 = document.querySelector("#filter2");

// NEW - Stocke les filtres actuels
let keyWord = "";
let filter = "";
let limit = "";

const fetchData = async (keyWord = "", filterSortBy = "", limit = 12) => {
  // NEW - On prépare les requêtes
  const query1 = keyWord ? `/search?q=${keyWord}` : "";
  const query2 = filterSortBy ? `${query1 ? "&" : "?"}${filterSortBy}` : "";
  const query3 = limit ? `${query1 || query2 ? "&" : "?"}limit=${limit}` : "";

  // NEW - On construit l'url
  const url = `https://dummyjson.com/recipes${query1}${query2}${query3}`;
  console.log("url:", url);

  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const displayData = async (keyWord, filterSortBy, limit) => {
  recipes.innerHTML = "Chargement en cours...";

  const data = await fetchData(keyWord, filterSortBy, limit);
  recipes.innerHTML = "";

  if (!data.recipes || data.recipes.length === 0) {
    recipes.innerHTML = "<p>Aucune recette trouvée.</p>";
    return;
  }

  data.recipes.forEach((element) => {
    const article = document.createElement("article");
    article.classList.add("recipe");
    article.innerHTML = `
        <img class="recipe__image" src="${element.image}" alt="${element.title}">
        <h2 class="recipe__title">${element.name} - ${element.id}</h2>
        <p class="recipe__ingredients">${element.ingredients}</p>
      `;
    recipes.appendChild(article);
  });
};

displayData();

searcBar.addEventListener("input", (e) => {
  keyWord = e.target.value;
  displayData(keyWord, filter, limit);
});

filter1.addEventListener("change", (e) => {
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

  filter = value;
  displayData(keyWord, filter, limit);
});

filter2.addEventListener("change", (e) => {
  let value = "";
  switch (e.target.value) {
    case "3":
      value = 3;
      break;
    case "6":
      value = 6;
      break;
    case "12":
      value = 12;
      break;
    case "24":
      value = 24;
      break;
    case "36":
      value = 30;
      break;

    default:
      value = "";
      break;
  }
  limit = value;
  displayData(keyWord, filter, limit);
});
