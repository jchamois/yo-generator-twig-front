"use strict";

var TEL = TEL || {};

TEL.DOM = { /* MISE EN CACHE DES SELECTEUR - perf*/
	$header : $('#header'),
	$nav : $('#nav'),
	$win : $(window),
	$page : $('#page')
}

/*EVENTS SECTION */

// Attempt to externalize binding as much as possible,
// to clean up the code, and separate the logic.

$(window).load(function(){
	utils.isTouch()
	TEL.barker.bark('Ouahahaha')
});

$(document).ready(function(){
}).on('click', function(event){});


