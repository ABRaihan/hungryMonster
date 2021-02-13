'use strict';
/* -------------> All API URL <------------- */
const mealByNameURL = `https://www.themealdb.com/api/json/v1/1/search.php?s=`;
const mealByLetterURL = `https://www.themealdb.com/api/json/v1/1/search.php?f=`;
const mealDetailsByIdURL = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=`;

const form = document.querySelector('form');
const search = document.querySelector('.searchButton');
const foodRow = document.getElementById('foods');
const ingredientsDetails = document.querySelector('#ingredientsDetails');
const foodIngredients = document.querySelector('#foodIngredients');
const foodItems = document.querySelector('#foodItems');
const ingredientsClose = document.querySelector('.ingredientsClose');
const notFoundCloseButton = document.querySelector('.notFoundClose');

/* -------------> All EventListener <------------- */
// Enter key press event
form.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        showFoods();
    }
});

//Search Button click Event
search.addEventListener('click', function (event) {
    event.preventDefault();
    showFoods();
});

// this event is for showing food ingredients
foodRow.addEventListener('click', async function (event) {
    loader(true);
    const col = document.querySelectorAll('#foods .col-12');
    if (!(this === event.target || [...col].find(element => event.target === element))) {
        const mealID = event.target.parentElement.id;
        const foodDetails = await getData(mealDetailsByIdURL, mealID);
        showIngredients(foodDetails);
        loader(false);
    }
});

// this event is close food ingredients section
ingredientsClose.addEventListener('click', function () {
        foodIngredients.style.display = 'none';
        foodIngredients.style.visibility = 'hidden';
        foodItems.style.display = 'block';
        [...ingredientsDetails.children].forEach((child) => child.remove());
    });

// this event close not found alert
notFoundCloseButton.addEventListener('click', function () {
        document.querySelector('#notFoundAlert').style.transform =
            'translate(-50%, -100%)';
    });
/* -------------> All Functions <------------- */

// create card column
function itemColumn() {
    foodRow.innerHTML += `<div class="col-12 col-md-6 col-lg-3">
        <div class="card items">
            <img class="card-img-top">
            <div class="card-body">
                <h4 class="card-title mt-3"></h4>
            </div>
        </div>
    </div>`;
}

// get foods data using API
async function getData(URL, target) {
    const response = await fetch(`${URL}${target}`);
    const data = await response.json();
    return data;
}

// this function will add food in food column
function addMeals(data) {
    data.meals.forEach((food, index)=> {
        itemColumn();
        document.querySelectorAll('#foods img')[index].src = food.strMealThumb;
        document.querySelectorAll('h4')[index].innerText = food.strMeal;
        document.querySelectorAll('.card')[index].id = food.idMeal;
    })
}

// this function will show food not found alert
function notFoundAlert(foodName) {
    document.querySelector(
        '.alertMessage'
    ).innerText = `${foodName.value} Item Not Found`;
    document.querySelector('#notFoundAlert').style.transform =
        'translate(-50%, 0%)';
}
// Loader
function loader(isShow) {
    if (isShow) {
        document.querySelector('#loader').style.display = 'block';
    } else {
        document.querySelector('#loader').style.display = 'none';
    }
}
// getting food name form input box and call getData() function
async function showFoods() {
    loader(true);
    const foodName = document.querySelector('.foodName');
    [...foodRow.children].forEach((child) => child.remove());
    if (foodName.value) {
        if (foodName.value.length > 1) {
            const mealsData = await getData(mealByNameURL, foodName.value);
            if (JSON.stringify(mealsData.meals) === 'null')
                notFoundAlert(foodName);
            else addMeals(mealsData);
        } else {
            const mealsData = await getData(mealByLetterURL, foodName.value);
            if (JSON.stringify(mealsData.meals) === 'null')
                notFoundAlert(foodName);
            else addMeals(mealsData);
        }
    }
    foodName.value = '';
    loader(false);
}

// this function will show food ingredients
function showIngredients(data) {
    document.querySelector('.ingredientsImg').src = data.meals[0].strMealThumb;
    document.querySelector('.ingredientsName').innerText = data.meals[0].strMeal;
    for (let i = 1; i <= 20; i++) {
        let ingredients = data.meals[0][`strIngredient${i}`];
        if (ingredients !== '' && JSON.stringify(ingredients) !== 'null') {
            ingredientsDetails.innerHTML += `<li class="list-group-item"><i class="fas fa-check-square text-primary me-2"></i> ${
                data.meals[0][`strIngredient${i}`]
            }</li>`;
        }
    }
    foodIngredients.style.display = 'block';
    foodIngredients.style.visibility = 'visible';
    foodItems.style.display = 'none';
}