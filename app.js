
const main = document.querySelector("main")
const favoriteRecipes = []
const searchIngredients = []


const home = document.querySelector("#nav-home")
home.addEventListener("click", loadHome)
const saved = document.querySelector("#nav-save")
saved.addEventListener("click", function () {
  viewRecipeBox(favoriteRecipes, searchIngredients)
})


const mainHeader = document.querySelector(".header-h1")
mainHeader.addEventListener("click", loadHome)


const form = document.querySelector("form")
form.addEventListener("submit", (e) => {
  e.preventDefault()
  const searchValue = document.querySelector("#search-value").value
  showResults(searchValue)
  document.querySelector("#search-value").value = ""
})



loadHome()

async function loadHome() {
  removeMain()
  main.removeAttribute("id")
  const randomURL = "https://www.themealdb.com/api/json/v1/1/random.php"
  try {
    const response = await axios.get(randomURL)
    const randomRecipe = response.data.meals[0]
    const mainImage = createMainImage(randomRecipe)
    mainImage.addEventListener("click", (e) => {
      renderRecipe(e.target.id, randomRecipe.strIngredient1)
      window.localStorage.setItem("randomRecipe", e.target.id)
    })
    main.append(mainImage)
    appendFooter()
    return response
  } catch (err) {
    console.error(err)
  }
}

async function showResults(ingredient) {
  const ingredientURL = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
  try {
    main.removeAttribute("id");
    removeMain()
    const response = await axios.get(ingredientURL)
    const recipes = response.data.meals
    if (recipes === null) {
      const noRecipes = showNoRecipes(ingredient)
      main.append(noRecipes)
      return
    }
    
    if (recipes.length > 0) {
      const recipeCount = countRecipes(recipes, ingredient)
      main.append(recipeCount)
    }
    recipes.forEach(recipe => {
      
      const listRecipeDiv = document.createElement("div")
      listRecipeDiv.className = "list-recipe-div"
      main.append(listRecipeDiv)
      
      
      const image = createListImage(recipe)
      const dish = createListDish(recipe)
      listRecipeDiv.addEventListener("click", (e) => {
        renderRecipe(e.target.id, ingredient)
      })
      
     
      listRecipeDiv.append(image)
      listRecipeDiv.append(dish)
    })
    appendFooter()
    return response
  } catch (err) {
    console.error(err)
  }
}


async function renderRecipe(id, ingredient) {
  removeMain()
  const recipeURL = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  try {
    const response = await axios.get(recipeURL)
    const recipe = response.data.meals[0]
    main.id = "recipe-view"

    const name = createRecipeHeader(recipe)
    main.append(name)
    const recipeDiv = document.createElement("div")
    recipeDiv.className = "recipe-div"
    const image = createRecipeImage(recipe)
    main.append(recipeDiv)
    recipeDiv.append(image)

    
    listIngredients(recipe)

    
    const instructionsDiv = document.createElement("div")
    instructionsDiv.className = "instructions-div"
    main.append(instructionsDiv)
    const instructionsHeader = createInstructionsHeader()
    const instructions = createInstructions(recipe)
    instructionsDiv.append(instructionsHeader)
    instructionsDiv.append(instructions)
    
    
    const recipeButtonDiv = document.createElement("div")
    recipeButtonDiv.className = "recipe-button-div"
    main.prepend(recipeButtonDiv)

    
    const backExplore = createBackExplore()
    let randomFlag = window.localStorage.getItem("randomRecipe")
    let exploreFlag = window.localStorage.getItem("exploreRecipe")
    if (favoriteRecipes.includes(id) || randomFlag === id || exploreFlag === id) {  
      backExplore.textContent = "Explore more"
      backExplore.addEventListener("click", function () {
        exploreMore(recipe.strCategory)
      })
    } else {
      backExplore.textContent = "Back to results"
      backExplore.addEventListener("click", function () {
        showResults(ingredient)
      })
    }
    recipeButtonDiv.append(backExplore)

    const save = createSaveButton(favoriteRecipes, id)
    recipeButtonDiv.append(save)
    save.addEventListener("click", (e) => {
      e.target.id = id
      saveRecipe(e.target.id, ingredient)
    })

    return response
  } catch (err) {
    console.error(err)
  }
}


function saveRecipe(id, searchIngredient) {
  
  if (favoriteRecipes.includes(id)) {
    viewRecipeBox(favoriteRecipes, searchIngredients)
  } else {
    window.localStorage.setItem(id, id)
    favoriteRecipes.push(window.localStorage.getItem(id))
    searchIngredients.push(searchIngredient)
    viewRecipeBox(favoriteRecipes, searchIngredients)
  }
}


async function exploreMore(category) {
  removeMain()
  main.removeAttribute("id")
  const recipeCategory = displayRecipeCategory(category)
  main.append(recipeCategory)

  const exploreURL = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`

  try {
    let response = await axios.get(exploreURL)
    let recipeList = response.data.meals
    shuffle(recipeList)
    let recipes = recipeList.slice(0, 12)
    recipes.forEach((recipe) => {
      const listRecipeDiv = document.createElement("div")
      listRecipeDiv.className = "list-recipe-div"
      main.append(listRecipeDiv)
    
    
      const image = createListImage(recipe)
      const dish = createListDish(recipe)
      ingredient = recipe.strIngredient1
      listRecipeDiv.addEventListener("click", (e) => {
        renderRecipe(e.target.id, ingredient)
        window.localStorage.setItem("exploreRecipe", e.target.id)
      })
    
    
    listRecipeDiv.append(image)
    listRecipeDiv.append(dish)
  })
  appendFooter()
    return response
  } catch (err) {
    console.error(err)
  }
}


async function viewRecipeBox(recipes, ingredients) {
  removeMain()
  main.removeAttribute("id");

 
  let recipeURLs = []
  for (let i = 0; i < recipes.length; i++) {
    recipeURLs.push(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipes[i]}`)
  }
  try {
    let recipeIDs = []
    for (let i = 0; i < recipeURLs.length; i++) {
      let response = await axios.get(recipeURLs[i])
      let recipe = response.data.meals[0]
      
     
      const listRecipeDiv = document.createElement("div")
      listRecipeDiv.className = "list-recipe-div"
      main.append(listRecipeDiv)

      const image = createListImage(recipe)
      listRecipeDiv.append(image)

      const dish = createListDish(recipe)
      listRecipeDiv.append(dish)
      image.addEventListener("click", (e) => {
        renderRecipe(e.target.id, ingredients[i])
      })
      dish.addEventListener("click", (e) => {
        renderRecipe(e.target.id, ingredients[i])
      })
      
      const remove = createRemoveButton(recipe.idMeal)
      listRecipeDiv.append(remove)
      remove.addEventListener("click", (e) => {
        const index = favoriteRecipes.indexOf(e.target.id)
        favoriteRecipes.splice(index, 1)
        removeMain()
        main.removeAttribute("id");
        loadHome()
      })

      recipeIDs.push(image.id)
    }
    
    
    const savedRecipesHeader = createSavedHeader(recipes)
    main.prepend(savedRecipesHeader)
    
    return recipeURLs
  } catch (err) {
    console.error(err)
  }
  
}
