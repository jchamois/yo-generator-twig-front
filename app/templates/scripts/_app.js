"use strict";

var APP = APP || {};

/*EVENTS SECTION */

// Attempt to externalize binding as much as possible,
// to clean up the code, and separate the logic.

window.addEventListener('load',function(){
	console.log('load event')
});
