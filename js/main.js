(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();

    // Initiate the wowjs
    new WOW().init();

    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
        }
    });

    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });

    // Header carousel
    $(".header-carousel").owlCarousel({
        autoplay: false,
        animateOut: 'fadeOutLeft',
        items: 1,
        dots: true,
        loop: true,
        nav: true,
        navText: [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    });

})(jQuery);


/************* *******************************************************************/
/** Helper Functions*/
/****************************************************************************** */

// Function that gets all recipes
function getAllRecipes() {
    // Gets and returns all recipes from the local storage
    return JSON.parse(localStorage.getItem('recipes')) || [];
}

// Checks that the image url has or starts with https
function has_https(fieldValue) {
    return fieldValue.startsWith('https:')
}

// Check that the list of ingredients are comma separated
function is_commaSeparated(fieldValue) {
    const pattern = /\b\w+,\s*/;
    return pattern.test(fieldValue);
}

// Function that is called to validate all input fileds in the form
function validateField(fieldSelector, errorMessage) {
    const fieldValue = $(fieldSelector).val();
    if (!fieldValue) {
        $(fieldSelector).addClass('is-invalid');
        $(fieldSelector).after(`<div class="invalid-feedback">${errorMessage}</div>`);
        return false; // Field is invalid
    }

    // checks if the image url starts with or includes https
    if (fieldSelector === '#image-url' && !has_https(fieldValue)) {
        $(fieldSelector).addClass('is-invalid');
        $(fieldSelector).after('<div class="invalid-feedback">Image Url must start with https</div>');
        return false; // Field is invalid
    }

    // checks if the list of ingredients are separated with commas
    if (fieldSelector === "#ingredients" ) {
        if (fieldValue.trim().includes(' ') && !is_commaSeparated(fieldValue)) {
            $(fieldSelector).addClass('is-invalid');
            $(fieldSelector).after('<div class="invalid-feedback">List of ingredients must separated by commas!</div>');
            return false; // Field is invalid     
        }     
    }
    
    return true; // All Fields are valid
}

// reset validation if validation exist
function resetValidation() {
    $('.form-control').removeClass('is-invalid');
    $('.invalid-feedback').remove();
}

// Function to clear existing content of carousel
function clearOwlCarousel() {

    let owlCarousel = $('#recipe-display-carousel');

    // Get the total number of items in the carousel
    let itemCount = owlCarousel.find('.owl-item').length;

    console.log(itemCount)

    // Loop through and remove each item without animation
    for (let i = 0; i < itemCount; i++) {
        owlCarousel.trigger('remove.owl.carousel', [i, false]);
    }

    // Refresh the carousel after removing all items
    owlCarousel.trigger('refresh.owl.carousel');
}

// Function displays recipes to user
function displayRecipe() {
    let recipes = getAllRecipes();

    // Clear existing content inside the 'recipe-display-grid' and 'recipe-display-carousel'
    $('#recipe-display-grid').empty();
    clearOwlCarousel();

    if (recipes) {
        recipes.forEach((recipe) => {
            addRecipeToCarousel(recipe);
            addRecipeToMainDisplay(recipe);
        });

    }    
}


// Function adds recipe to the carousel
function addRecipeToCarousel(recipe) {
    // add recipe to owl item
    var newItem = $(`<div class="owl-item team-item">
                        <div class="team-item position-relative rounded overflow-hidden">
                            <div class="overflow-hidden team-img">
                                <img class="img-fluid d-block" src="${recipe.url}" alt="">
                            </div>
                            
                            <div class="team-text bg-light text-center p-3">
                                <h5>${recipe.name}</h5>
                                <a class="text-primary mb-1" href="#${recipe.name.split(' ')[0]}">view details</a>
                                <div class="team-social text-center">
                                    <a class="btn btn-square" href="#${recipe.name.split(' ')[0]}"><i class="bi bi-arrow-down"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>`);
    
    // Get the Owl Carousel element by its ID
    var owlCarousel = $('#recipe-display-carousel');

    // Add the new owl-item to the Owl Carousel
    owlCarousel.trigger('add.owl.carousel', [newItem, 0]).trigger('refresh.owl.carousel')

}

// function adds recipe to the main recipe display
function addRecipeToMainDisplay(recipe) {
    // create HTML content as a jQuery object

    var htmlContent = $(
        `<div class=" col-12 mx-auto wow fadeInUp" data-wow-delay="0.1s" id="${recipe.name.split(' ')[0]}">
            <div class="grid-width position-relative mx-auto">
                <div class="btn-group action-button">
                    <button type="button" class="btn btn-sm btn-secondary dropdown-toggle" data-bs-toggle="dropdown" >
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item editRecipe" name="${recipe.name}" href="#add-recipe" id="edit-recipe">Edit</a></li>
                        <li><a class="dropdown-item deleteRecipe" name="${recipe.name}" href="#recipe-header" id="delete-recipe">Delete</a></li>
                    </ul>
                </div>
                <div class="service-item bg-light overflow-hiden rounded p-5">
                    <div class="d-inline-flex align-items-center justify-content-center bg-white mb-4">
                        <img class="img-fluid" src="${recipe.url}" alt="">
                    </div>
                    <h4 class="mb-3">${recipe.name}</h4>
                    <h5 class="mb-1" style="font-size: medium;">Ingredients</h5>
                    <p class="mb-3 justify-text">
                        ${recipe.ingredients}
                    </p>
                    <h5 class="mb-1 " style="font-size: medium;">Preparation steps</h5>
                    <p class="mb-4 justify-text">
                        ${recipe.steps}
                    </p>
                </div>
            <div>
    </div>`
    );

    // Prepend the HTML content to the div with class 'recipe-display-grid'
    $('#recipe-display-grid').prepend(htmlContent);
}



// Function to find recipe index by recipe name
function findRecipeIndexByName(name) {
    let recipes = getAllRecipes();
    for (let i = 0; i < recipes.length; i++) {
        if (recipes[i].name === name) {
            return i; // Return the index if found
        }
    }
    return null; // Return null if not found
}

// Function that handles form submission
function recipeFormSubmission() {
    // contains all the recipes fetched from the local storage
    let recipes = getAllRecipes();

    // handles users data when the form is submitted
    $("#recipe-form").submit(function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // reset form validation if already exists
        resetValidation();

        // Validate input fields
        const recipeName = validateField("#recipe-name", "Recipe Name is required!");
        const ingredients = validateField("#ingredients", "Ingredients are required");
        const preparationSteps = validateField("#preparation-steps", "Preparation Steps are required!");
        const imageUrl = validateField("#image-url", "Image Url is required!");

        if (recipeName && ingredients && preparationSteps && imageUrl) {
            // get user's input
            let enteredRecipeName = $("#recipe-name").val();
            let enteredIngredients = $("#ingredients").val();
            let enteredPreparationSteps = $("#preparation-steps").val();
            let enteredImageUrl = $("#image-url").val();

            let recipeIndex = findRecipeIndexByName(enteredRecipeName);

            if (!recipeIndex) {
                // create a new recipe
                let newRecipe = {
                    name: enteredRecipeName,
                    ingredients: enteredIngredients,
                    steps: enteredPreparationSteps,
                    url: enteredImageUrl
                };

                // add the new recipe to the recipes array
                recipes.push(newRecipe);

            } else {
                recipes[recipeIndex].name = enteredRecipeName;
                recipes[recipeIndex].ingredients = enteredIngredients;
                recipes[recipeIndex].steps = enteredPreparationSteps;
                recipes[recipeIndex].url = enteredImageUrl;
            }

            // add recipes to local storage
            localStorage.setItem('recipes', JSON.stringify(recipes));

            // clear the input fields
            $('#recipe-name').val('');
            $('#ingredients').val('');
            $('#preparation-steps').val('');
            $('#image-url').val('');
        }
        
        displayRecipe();
    });
}


function editRecipe() {
    // Event delegation for editRecipe buttons
    $(document).on('click', '.editRecipe', function () {
        let editButtonName = $(this).attr('name');
        let recipes = getAllRecipes();

        for (let recipe of recipes) {
            if (recipe.name === editButtonName) {
                // populate input fields with recipe data
                $('#recipe-name').val(recipe.name);
                $('#ingredients').val(recipe.ingredients);
                $('#preparation-steps').val(recipe.steps);
                $('#image-url').val(recipe.url);
                break;
            }
        }
    });
}

function deleteRecipe() {

    $(document).on('click', '.deleteRecipe', function () {
        let recipes = getAllRecipes();
        let deleteButtonName = $(this).attr('name');

        for (let recipe of recipes) {
            if (recipe.name === deleteButtonName) {
                let indexOfRecipe = recipes.indexOf(recipe);
                recipes.splice(indexOfRecipe, 1); // Remove one element at the specified index
                console.log(`${recipe.name} deleted successfully!`);
                break;
            }
        }

        // Update local storage after deletion
        localStorage.setItem('recipes', JSON.stringify(recipes));
        displayRecipe();
    });
}


/*************************************************************************************** */
/**Helper functions End */
/*************************************************************************************** */


$(document).ready(function () {

    "use strict";

    // Displays all recipes
    displayRecipe();

    // Handles recipe form submission
    recipeFormSubmission();

    // Handles edit recipe
    editRecipe();

    // Handles recipe deletion
    deleteRecipe();

    localStorage.clear()
   
});

