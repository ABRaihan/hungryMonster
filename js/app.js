'use strict';
const mealByNameURL = `https://www.themealdb.com/api/json/v1/1/search.php?s=`;
const mealByLetterURL = `https://www.themealdb.com/api/json/v1/1/search.php?f=`;
const mealDetailsByIdURL = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=`;
const form = document.querySelector('form');
const search = document.querySelector('.searchButton');
const foodRow = document.getElementById('foods');
const ingredientsDetails = document.querySelector('#ingredientsDetails');
const foodIngredients = document.querySelector('#foodIngredients');
const foodItems = document.querySelector('#foodItems');

/* -------------> All EventListener <------------- */
// Enter key press event
form.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        getFoodName();
    }
});

//Search Button click Event
search.addEventListener('click', function (e) {
    e.preventDefault();
    getFoodName();
});

// this event is for showing food ingredients
foodRow.addEventListener('click', function (e) {
    if (!(this === e.target)) {
        const mealID = e.target.parentElement.id;
        fetch(`${mealDetailsByIdURL}${mealID}`)
            .then((res) => res.json())
            .then((data) => {
                document.querySelector('.ingredientsImg').src =
                    data.meals[0].strMealThumb;
                document.querySelector('.ingredientsName').innerText =
                    data.meals[0].strMeal;
                for (let i = 1; i <= 20; i++) {
                    let ingredients = data.meals[0][`strIngredient${i}`];
                    console.log(ingredients);
                    if (ingredients !== '') {
                        ingredientsDetails.innerHTML += `<li><i class="fas fa-check-square"></i> ${
                            data.meals[0][`strIngredient${i}`]
                        }</li>`;
                    }
                }
                foodIngredients.style.display = 'block';
                foodIngredients.style.visibility = 'visible';
                foodItems.style.display = 'none';
            });
    }
});

// this event is close food ingredients section
document.querySelector('.cross').addEventListener('click', function (e) {
    foodIngredients.style.display = 'none';
    foodIngredients.style.visibility = 'hidden';
    foodItems.style.display = 'block';
    [...ingredientsDetails.children].forEach(child => child.remove());

});
/* -------------> All Functions <------------- */
// create HTML elements with attribute
function createElements(tagName, attr, value) {
    const tag = document.createElement(tagName);
    tag.setAttribute(attr, value);
    return tag;
}

// create card column
function itemColumn() {
    foodRow.innerHTML += `<div class="col-3">
        <div class="card items">
            <img class="card-img-top">
            <div class="card-body">
                <h4 class="card-title"></h4>
            </div>
        </div>
    </div>`;
}

// get foods using API
function getMeals(URL, foodName) {
    fetch(`${URL}${foodName}`)
        .then((res) => res.json())
        .then((data) => {
            if (JSON.stringify(data.meals) === 'null') {
                alert(`${foodName} is not found`);
            } else showMeals(data);
        });
}
function showMeals(data) {
    for (let i = 0; i < data.meals.length; i++) {
        itemColumn();
        document.querySelectorAll('img')[i].src = data.meals[i].strMealThumb;
        document.querySelectorAll('h4')[i].innerText = data.meals[i].strMeal;
        document.querySelectorAll('.card')[i].id = data.meals[i].idMeal;
    }
}
// getting food name form input box and call getMeals() function
function getFoodName() {
    const foodName = document.querySelector('.foodName');
    [...foodRow.children].forEach((child) => child.remove());
    if (foodName.value) {
        if (foodName.value.length > 1) getMeals(mealByNameURL, foodName.value);
        else getMeals(mealByLetterURL, foodName.value);
    }
    foodName.value = '';
}
