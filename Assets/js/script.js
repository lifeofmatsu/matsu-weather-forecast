const apiKey = 'dc4841c2628866e900a9555b5927693d';

var searchEl = document.querySelector('#search'); //search button
var searchInputEl = document.querySelector('#search-input');
var searchSuggestEl = document.querySelector('#search-suggest');

function handleSearchSubmit(event) {
    event.preventDefault();

    var searchInputVal = searchInputEl.value;

    if (searchInputVal) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}`)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(function(data) {
             
        })
    }
}

searchInputEl.addEventListener('keyup', (event) => { 
    if (event.key === 'Enter') {
        event.preventDefault();
        searchEl.click();
    }
}); 

searchEl.addEventListener('click', () => {
    handleSearchSubmit();
})