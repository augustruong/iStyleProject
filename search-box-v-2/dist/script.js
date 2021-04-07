'use strict';

var searchBox = document.querySelectorAll('.search-box input[type="text"] + span');

console.dir(searchBox)

searchBox.forEach(elm => {
  elm.addEventListener('click', () => {
    console.log("click")
    elm.previousElementSibling.value = '';
  });
});