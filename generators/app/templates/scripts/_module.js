'use strict';

TEL.myModule = (function () {

	var privates = {};

	function myModule(elem,arg1,arg2){
		console.log('module attached to ', elem,' with arguments ', arg1,' and ', arg2);
	}

	return myModule;

})();

	// Module Init

	var elems = document.querySelectorAll('div');

	[].forEach.call(elems, function(elem) {
	 	elem.myModule = new TEL.myModule(elem,'arg1', 'arg2');
	});
});
