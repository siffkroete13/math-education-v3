import { MyUtil } from './utils/my-util';


var myUtil = MyUtil.getInstance();

// App start
async function start() {

	
	
}





// Ein kleiner Hack damit die Start-Funktion erst aufgerufen wird, nachdem DOM geladen ist.
(function r(f) {
    /in/.test(document.readyState) ? setTimeout(function() { r(f);}, 9) : f()
})(start);
	    