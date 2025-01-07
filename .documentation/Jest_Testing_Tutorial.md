# Tutoriel : Ajouter des tests avec Jest pour **Let's Cook**

## 1. Installer les dépendances nécessaires

Dans ce projet, nous utilisons les packages suivants :

### Packages installés

1. **`jest`** :

   - Framework de tests JavaScript.
   - Exécute les tests et génère un rapport des résultats.
   - [Documentation Jest](https://jestjs.io/)

2. **`jest-environment-jsdom`** :

   - Simule un environnement DOM dans Node.js pour tester les interactions avec le DOM.
   - Utile pour tester des applications front-end sans navigateur.
   - [Documentation jsdom](https://jestjs.io/docs/configuration#testenvironment-string)

3. **`babel-jest`** :

   - Permet à Jest de comprendre le code moderne ES6+.
   - Nécessaire si vous utilisez des modules JavaScript (`import/export`).
   - [Documentation Babel Jest](https://jestjs.io/docs/getting-started#using-babel)

4. **`@babel/preset-env`** :
   - Permet de convertir du code JavaScript moderne (ES6+) en une version compatible avec Node.js.
   - [Documentation Babel Preset Env](https://babeljs.io/docs/en/babel-preset-env)

---

### Commandes pour installer ces dépendances

Exécutez les commandes suivantes :

```bash
npm install jest jest-environment-jsdom babel-jest @babel/preset-env --save-dev
```

---

## 2. Configurer Jest pour votre projet

1. Créez un fichier de configuration Jest à la racine du projet : `jest.config.js`.
2. Ajoutez la configuration suivante dans ce fichier :

   ```javascript
   module.exports = {
     testEnvironment: "jest-environment-jsdom", // Simule un DOM dans Node.js
     transform: {
       "^.+.jsx?$": "babel-jest", // Permet à Jest de comprendre le code ES6+
     },
   };
   ```

3. Ajoutez un fichier Babel `.babelrc` à la racine du projet pour configurer Babel :

   ```json
   {
     "presets": ["@babel/preset-env"]
   }
   ```

4. Assurez-vous que `package.json` contient le script pour exécuter les tests :
   ```json
   "scripts": {
     "test": "jest"
   }
   ```

---

## 3. Organisation du projet

Structure du projet mise à jour pour inclure les tests :

```
.
├── assets
│   ├── js
│   │   └── oop
│   │       └── Recipe.2.js
├── tests
│   └── Recipe.test.js
├── index.html
├── README.md
└── recette.html
```

---

## 4. Écrire des tests pour la classe `Recipe`

Créez un fichier `tests/Recipe.test.js` avec le contenu suivant :

```javascript
import Recipe from "../assets/js/oop/Recipe.2.js";

// Mock global.fetch pour simuler les appels API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        recipes: [
          { id: 1, name: "Pasta", ingredients: "Tomato, Pasta", image: "image1.jpg" },
        ],
      }),
  })
);

describe("Recipe Class", () => {
  let recipeInstance;

  beforeEach(() => {
    // Simule le DOM nécessaire pour les tests
    document.body.innerHTML = `
      <div class="recipes"></div>
      <input class="search-bar" />
      <select id="filter1"></select>
      <select id="filter2"></select>
    `;
    recipeInstance = new Recipe(".recipes", ".search-bar", "#filter1", "#filter2");
  });

  afterEach(() => {
    jest.clearAllMocks(); // Réinitialise les mocks entre les tests
  });

  test("fetchData should fetch data correctly", async () => {
    jest.clearAllMocks(); // Réinitialise les appels avant ce test
    const data = await recipeInstance.fetchData();
    expect(fetch).toHaveBeenCalledTimes(1); // Vérifie un seul appel
    expect(fetch).toHaveBeenCalledWith("https://dummyjson.com/recipes?limit=12"); // Vérifie l'URL
    expect(data.recipes[0].name).toBe("Pasta");
  });

  test("displayData should update the DOM", async () => {
    await recipeInstance.displayData();
    const articles = document.querySelectorAll(".recipe");
    expect(articles.length).toBe(1);
    expect(articles[0].querySelector("h3").textContent).toBe("Pasta - 1");
  });

  test("handleSearchInput should update currentKeyWord", () => {
    const input = document.querySelector(".search-bar");
    input.value = "Pizza";
    const event = new Event("input");
    input.dispatchEvent(event);

    expect(recipeInstance.currentKeyWord).toBe("pizza");
  });
});
```

---

## 5. Exécuter les tests

Pour lancer les tests, utilisez la commande suivante :

```bash
npm test
```

### Résultat attendu :

Si tout fonctionne correctement, vous devriez voir un rapport comme ceci :

```bash
PASS  tests/Recipe.test.js
  Recipe Class
    ✓ fetchData should fetch data correctly (10 ms)
    ✓ displayData should update the DOM (5 ms)
    ✓ handleSearchInput should update currentKeyWord (3 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        1.123 s
```

---

## 6. Résumé du rôle de chaque package

1. **`jest`** : Exécute les tests et génère un rapport.
2. **`jest-environment-jsdom`** : Simule un environnement DOM pour les tests d'interactions avec le DOM.
3. **`babel-jest`** : Permet à Jest de comprendre le code ES6 (modules, `async/await`, etc.).
4. **`@babel/preset-env`** : Transpile le code moderne ES6+ pour le rendre compatible avec Node.js.

---

## 7. Améliorations possibles

1. Ajouter des **tests unitaires** pour chaque méthode.
2. Tester les comportements spécifiques liés à l'API REST (erreurs, réponses vides).
3. Ajouter des **tests d’intégration** pour vérifier les interactions entre différentes parties du projet.
