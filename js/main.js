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

function getRequestUrl(requestType, recipeId) {

    switch (requestType) {
        case "POST":
            return 'http://127.0.0.1:8000/recipes';
        
        case "DELETE":
        case "PUT":
            return `http://127.0.0.1:8000/recipes/${recipeId}`;
        
        default:
            return 'http://127.0.0.1:8000/recipes';      
    }
    
}

async function sendRecipe(recipeData, requestType, recipeId) {

    let url = getRequestUrl(requestType, recipeId);
    let request = {
        headers: { "Content-Type": "application/json" },
        method: requestType,
        body: JSON.stringify(recipeData)
    };

    try {
        let response = await fetch(url, request);

        if (!response.ok) {
            throw new Error(`Error: respose status not ok. ${response.status}`)
        }

        let data = await response.json();

        console.log(data);
        displayRecipe();
        console.log(`${requestType} was successful!`);

    } catch (error) {
        console.error(error)
    }
    
}



// Function that gets all recipes
async function getAllRecipes() {
    url = getRequestUrl();
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error: respose status not ok. ${response.status}`)
        }

        const data = await response.json();

        console.log(`Recipe fetched successfully!`);
        return data;

    } catch (error) {
        console.error(error);
    }

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

    // Loop through and remove each item without animation
    for (let i = 0; i < itemCount; i++) {
        owlCarousel.trigger('remove.owl.carousel', [i, false]);
    }

    // Refresh the carousel after removing all items
    owlCarousel.trigger('refresh.owl.carousel');
}

// Function displays recipes to user
function displayRecipe() {
    getAllRecipes()
        .then(recipes => {
            // Clear existing content inside the 'recipe-display-grid' and 'recipe-display-carousel'
            $('#recipe-display-grid').empty();
            clearOwlCarousel();

            if (recipes) {
                recipes.forEach((recipe) => {
                    addRecipeToCarousel(recipe);
                    addRecipeToMainDisplay(recipe);
                });
            } 
        })
        .catch(error => {
            console.error('Error:', error.message);
        });   
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
                        ${recipe.steps.replace(/\n/g, '<br>')}
                    </p>
                </div>
            <div>
    </div>`
    );

    // Prepend the HTML content to the div with class 'recipe-display-grid'
    $('#recipe-display-grid').prepend(htmlContent);
}



// Function to find recipe index by recipe name
async function findRecipeIdByName(name) {
    try {
        let recipes = await getAllRecipes();
        let recipe = recipes.find(recipe => recipe.name === name);

        if (!recipe) {
            return null;
        }

        return recipe.id;

    } catch (error) {
        console.error("Error:", error);
    }
}

// Function that handles form submission
function recipeFormSubmission() {

    // handles users data when the form is submitted
    $("#recipe-form").submit(async function (event) {
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

            // new or updated recipe
            let recipeData = {
                name: enteredRecipeName,
                ingredients: enteredIngredients,
                steps: enteredPreparationSteps,
                url: enteredImageUrl
            };


            const recipeId = await findRecipeIdByName(enteredRecipeName);
            if (recipeId) {
                // send recipeData to update existing data
                sendRecipe(recipeData, "PUT", recipeId);
            }
            else {
                // send recipeData to be posted
                sendRecipe(recipeData, "POST");
            }

            // clear the input fields
            $('#recipe-name').val('');
            $('#ingredients').val('');
            $('#preparation-steps').val('');
            $('#image-url').val('');

            displayRecipe();
        }
    });
}


function editRecipe() {
    // Event delegation for editRecipe buttons
    $(document).on('click', '.editRecipe', async function () {
        let editButtonName = $(this).attr('name');
        try {
            let recipes = await getAllRecipes();
            let recipeToEdit = recipes.find(recipe => recipe.name === editButtonName);
            if (recipeToEdit) {
                // populate input fields with recipe data
                $('#recipe-name').val(recipeToEdit.name);
                $('#ingredients').val(recipeToEdit.ingredients);
                $('#preparation-steps').val(recipeToEdit.steps);
                $('#image-url').val(recipeToEdit.url);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });
}

function deleteRecipe() {

    $(document).on('click', '.deleteRecipe', async function () {
        let deleteButtonName = $(this).attr('name');
        try {
            let recipes = await getAllRecipes();
            recipeToDelete = recipes.find(recipe => recipe.name === deleteButtonName);

            if (recipeToDelete) {
                // send recipe for delete
                sendRecipe(recipes, "DELETE", recipeToDelete.id);
            }

            displayRecipe();

        } catch (error) {
            console.error("Error:", error);
        }
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

   
});

