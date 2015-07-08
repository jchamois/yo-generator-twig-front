"use strict";

var TEL = {

	selector : { /* MISE EN CACHE DES SELECTEUR - perf*/
		$header : $( '#header'),
		$nav : $('#nav'),
		$win : $(window),
		$page : $('#page')
	},

	hereIam : function(el){
		console.log('I am ', el);
	},

	// INIT

	initDomReady: function(){
		TEL.hereIam('dom ready');
	},

	initWinLoad: function(){
		TEL.hereIam('window load');
	}
};


/*EVENTS SECTION */

// Attempt to externalize binding as much as possible, to clean up the code, and separate the logic

$(window).load(function(){
	TEL.initWinLoad();
});

$(document).ready(function(){
	TEL.initDomReady();
}).on('click', '#aside', function(event){
	TEL.hereIam(event.target);
});





