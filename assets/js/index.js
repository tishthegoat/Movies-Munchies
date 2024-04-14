const searchBtnEl = $('#search-button')
//* for search modal

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
	modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
	modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
}

// todo tie to searchmodal
$('#search-form').on('submit', function(event){
	event.preventDefault()
	const searchInputEl = $('#search-input').val()
	fetchMovieTitleApi(searchInputEl)
})

// *function for movie title search
function fetchMovieTitleApi(search){
	const apiKey = "05ee849ca5bf0c7ca64d3561ba1aa9b8"
	const searchMovieTitleApi = `https://api.themoviedb.org/3/search/movie?query=${search}&api_key=${apiKey}`
	
	// todo cleanup
	fetch(searchMovieTitleApi)
	.then(response => {
		if (!response.ok) {
			throw new Error('Network response was not ok')
		}
		return response.json()
		console.log(response)
	})
	.then(data => {
		console.log(data)
	})
	.catch(error => {
		console.error('Fetch error:', error)
	})
	
}


// *function for random movie
function fetchRandomMovie(){
	const apiKey = "05ee849ca5bf0c7ca64d3561ba1aa9b8"
	const randomPage = Math.floor(Math.random() * 500) + 1//might need to change number-only goes to 500 
	const randomMovieApi = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=true&language=en-US&region=United%20States&api_key=${apiKey}&page=${randomPage}`

	fetch(randomMovieApi)
	.then(response => {
		if (!response.ok) {
			throw response.json()
		}
		return response.json()
		console.log(response)
	})
	.then(page => {
		console.log(page)
		displayMovieResults(page)
	})
	.catch(error => {
		console.error('Fetch error:', error)
	});

}

// *function for random button fetch
$('#random-button').on('click', function(event){
	event.preventDefault()
	fetchRandomMovie()
})

// *function for populating movie results area
// todo add poster to button, title on top or below poster?
// todo create area when (random)btn is clicked
function displayMovieResults(page){
	const movieResultsArea= $('#movieResults')
	
	for(let i = 0; i<9; i++){
		const movieDetails = page.results[i]
		const movieCard = $('<div>')
		// console.log(movieDetails)

		const titleBtn = $('<button>')
		titleBtn.addClass('rounded-full')
		titleBtn.attr({
			'data-movie-id': movieDetails.id,
			'id': 'selectMovieBtn',
			'type': 'button'})
		titleBtn.text(movieDetails.original_title)
		console.log(movieDetails.id)


		movieCard.append(titleBtn)
		movieResultsArea.append(movieCard)
	}
}

// *function to search by id to get selectedMovieModal details
$(document).on('click','#selectMovieBtn', function() {
	const movieId = $(this).attr('data-movie-id')
	console.log(movieId)
	function fetchMovieId(){
		const apiKey = "05ee849ca5bf0c7ca64d3561ba1aa9b8"
		const movieIdApi = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US&api_key=${apiKey}`
	
		fetch(movieIdApi)
		.then(response => {
			if (!response.ok) {
				throw response.json()
			}
			return response.json()
			console.log(response)
		})
		.then(movie => {
			console.log(movie)
			displaySelectedMovie(movie)
		})
		.catch(error => {
			console.error('Fetch error:', error)
		});
	}
	fetchMovieId()
})

// *function to display movie details in selectedMovieModal
// todo clear appropriate info before repopulating.
// todo figure out poster/backdrop
function displaySelectedMovie(movie){
	const movieModal = $('#movieModal')
	const dynamicElements = $('<div>')
	dynamicElements.addClass('p-3')
	dynamicElements.empty()

	const movieModalHeader = $('<header>')

	const movieTitle = $('<h2>')
	movieTitle.addClass('text-pink')
	movieTitle.text(movie.title) 

	const close = $('<span>')//might add back to html
	close.addClass('close absolute text-white top-0 right-0 p-4 cursor-pointer')
	close.html('&times;')

	// const poster = $('<img>')
	// poster.addClass('w-10 h-auto')
	// poster.attr('src', movie.poster_path)

	console.log(movie.poster_path)//poster--how to get to show? maybe backdrop_path?
	
	const movieModalDetails = $('<div>')

	if(movie.tagline){
		const tagline = $('<p>')
		tagline.addClass('text-green')
		tagline.text(movie.tagline)
		movieModalDetails.append(tagline)
	}

	
	const date = movie.release_date
	const justYear = date.split('-')[0]
	const year = $('<p>')
	year.addClass('text-purple')
	year.text(`${justYear}`)

	const overview = $('<p>')
	overview.addClass('tracking-tight')
	overview.text(movie.overview)

	const rating = $('<p>')
	rating.addClass('text-orange')
	rating.text(movie.vote_average)//could find star rating image that goes with this, but that's a whole other function for a whole other day.

	const genre = $('<p>')
	genre.addClass('font-bold')
	genre.text(movie.genres[0].name)//could add more IF they have more...later

	const runtime = $('<p>')
	runtime.addClass('text-sm')
	runtime.text(`${movie.runtime} min`)

	const homepage = $('<a>')
	homepage.addClass('text-center')
	homepage.attr('href', movie.homepage)
	homepage.text(movie.homepage)//could make the image the anchor...maybe
	
	movieModalDetails.append(year, overview, rating, genre, runtime, homepage)
	movieModalHeader.append(movieTitle, close)
	dynamicElements.append(movieModalHeader, movieModalDetails)
	movieModal.prepend(dynamicElements)
	
	selectedMovieModal.show()
	
}

//* Selected Movie Modal Button Functions
// todo make these one liners
const selectedMovieModal = $('#movieModal')
const goBackBtn = $('#go-back')
const closeBtn = $('.close')
const saveForLaterBtn = $('#save-for-later')
goBackBtn.on('click', () =>{
	selectedMovieModal.hide()
})

closeBtn.on('click', () =>{
	selectedMovieModal.hide()
})

saveForLaterBtn.on('click', () =>{
	// setLocalStorage() not done
	selectedMovieModal.hide()
	
})

$(document).click(function(event){
	if(!selectedMovieModal.is(event.target) && selectedMovieModal.has(event.target).length === 0){
		selectedMovieModal.hide()
	}
})



// todo getLocalStorage()



// todo setLocalStorage()



// todo displaySavedCards()



// todo openSearchModal()



// todo searchMovie()



// todo searchRecipe()



// todo fetchRecipeApi()



// todo displayRecipeResults()



// todo makeLater()



// todo displaySelectedRecipe()



// todo nowPickMunchies()



// todo nowPickMovies()



// todo fetchRecipesFromMovie()



// todo fetchMoviesFromRecipes()



// todo displayMovieFilmCombination




// OPTIONAL FOR NOW
// todo displayPickedMovie()

// OPTIONAL
// todo displayPickedMovie()

// OPTIONAL
// todo startOver()

// OPTIONAL
// todo deleteSavedBtn()

// OPTIONAL
// todo doneBtns()

// OPTIONAL
// todo slidingResults()

// more functions for searching random....


// more functions to search by sliders/checkboxes