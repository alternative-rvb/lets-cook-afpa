console.log("index.js loaded");

const searchBar = document.querySelector(".search-bar");

let data = fetch(`https://dummyjson.com/recipes`);

  // console.log("data:", data);
  
  // Selectionner le conteneur des recettes
  
  data
    .then((raw) => raw.json())
    .then((data) => {
      console.log(data.recipes);
      // Utiliser map
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
        document.querySelector(".recipes").appendChild(article);
      });
    });



