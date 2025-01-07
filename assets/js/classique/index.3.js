console.log("index.js loaded");

const recipes = document.querySelector(".recipes");

const fetchData = async () => {
  try {
    const response = await fetch(`https://dummyjson.com/recipes`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const displayData = async () => {
  recipes.innerHTML = "Chargement en cours...";
  try {
    const data = await fetchData();
  } catch (error) {
    console.log('Impossible de fetch les recettes', error);
  }
  // console.log(data);
  recipes.innerHTML = "";

  data.recipes.map((element) => {
    // console.log(element);
    // Utilisez createElement article
    const article = document.createElement("article");
    // Ajouter une classe à l'article
    article.classList.add("recipe");
    // Ajouter du contenu dans l'article
    article.innerHTML = `
          <img class="recipe__image" src="${element.image}" alt="${element.title}">
          <h2 class="recipe__title">${element.name}</h2>
          <p class="recipe__ingredients">${element.ingredients}</p>
      `;
    // Ajouter l'article au DOM dans le conteneur
    recipes.appendChild(article);
  });
};

displayData();
