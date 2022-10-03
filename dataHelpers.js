
function listIngredients(obj) {
  
  const recipeDiv = document.querySelector(".recipe-div")
  const ingredientsDiv = document.createElement("div")
  ingredientsDiv.className = "ingredients-div"
  recipeDiv.append(ingredientsDiv)

  const ingredientHeader = createIngredientHeader()
  ingredientsDiv.append(ingredientHeader)
  ingredientTable = document.createElement("table")
  ingredientsDiv.append(ingredientTable)
  
  let measurements = []
  let ingredients = []
  
  
  for (let measurement in obj) {
    if (measurement.includes("strMeasure") && (obj[measurement] != " " || obj[measurement] != "")) {
      measurements.push(obj[measurement])
    }
  }
  for (let ingredient in obj) {
    if (ingredient.includes("strIngredient") && (obj[ingredient] != "" || obj[ingredient] != " ")) {
      ingredients.push(obj[ingredient])
    }
  }
  
  for (let i = 0; i < measurements.length; i++) {
    let row = ingredientTable.insertRow(i)
    let cell1 = row.insertCell(0)
    let cell2 = row.insertCell(1)
    cell1.textContent = measurements[i]
    cell2.textContent = ingredients[i]
  }
}


function shuffle(recipes) { 
  let shuffledRecipes = recipes
  let currentIndex = recipes.length
  let temporaryValue
  let randomIndex
  while (currentIndex > 0) {
    randomIndex = Math.round(Math.random() * currentIndex)
    currentIndex--
    temporaryValue = shuffledRecipes[currentIndex]
    shuffledRecipes[currentIndex] = shuffledRecipes[randomIndex]
    shuffledRecipes[randomIndex] = temporaryValue
  }
  return shuffledRecipes;
}
