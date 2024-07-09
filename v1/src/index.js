import { MyUtil } from './utils/my-util';
import { mat4, mat2, vec2 } from 'gl-matrix';
import { Scene } from './Scene';
import { ShaderUtil } from './ShaderUtil';
import { Model_VOB } from './Model_VOB';
import { Events } from './Events';
import WebGLDebugUtils from 'webgl-debug';
import { LoadModel } from './LoadModel';
import { ModelUtil } from './utils/ModelUtil';




let myUtil = MyUtil.getInstance();
let modelUtil = ModelUtil.getInstance(myUtil);

// App start
async function start() {
  
	const canvas = document.querySelector('#meineWebGLCanvas');
	const gl = canvas.getContext('webgl');


	const monitor = {};
	monitor.mouse_x = document.getElementsByClassName('mouse_x')[0];
	monitor.mouse_y = document.getElementsByClassName('mouse_y')[0];
	monitor.angle_x = document.getElementsByClassName('angle_x')[0];
	monitor.angle_y = document.getElementsByClassName('angle_y')[0];
	
	if (!gl) {
		alert('Unable to initialize WebGL. Your browser or machine may not support it.');
		return;
	}

	
	let [vShaderCode, fShaderCode, modelData]  = await Promise.all([
    ShaderUtil.loadShaderSource('./shaders/vShaderCode.glsl'),
    ShaderUtil.loadShaderSource('./shaders/fShaderCode.glsl'),
    new LoadModel().loadFromUrl('./models/koord_sys.json')
    // new LoadModel().loadFromUrl('./models/pyramid.json')
	]);

    // console.log('Vertex Shader Code:', vShaderCode);
    
  let mdelData2 = myUtil.clone(modelData);
  let rotationMatrix = mat4.create();
  
  mat4.rotate(rotationMatrix, rotationMatrix, myUtil.rad(45), [0, 0, 1]);

  // Ein zweites Koordinatensystem erstellen. Zuerst vom ersten kopieren, dann transformieren und beide schlussendlich zeichnen.
  let axes_2 = modelData.axes;
  let ticks_2 = modelData.ticks;

  // Achsen etwas transformieren
  axes_2 = modelUtil.transform(modelData.axes, rotationMatrix);
  ticks_2 = modelUtil.transform(modelData.ticks, rotationMatrix);

  
  modelData['axes_2'] = axes_2;
  modelData['ticks_2'] = ticks_2;


	let scene = new Scene(canvas, gl, modelData, vShaderCode, fShaderCode);

	let controls = ['my_start', 'my_pause'];

	let events = new Events(scene, controls);
	
	canvas.addEventListener('mousedown', events.mouse_drag_started.bind(events));
	canvas.addEventListener('mouseup', events.mouse_drag_ended.bind(events));
	canvas.addEventListener('mousemove', events.mouse_dragged.bind(events));

	
	events.subscribe(function(ev) {
		monitor.mouse_x.textContent = ev.mouse_x;
		monitor.mouse_y.textContent = ev.mouse_y;
		monitor.angle_x.textContent = ev.angle_x;
		monitor.angle_y.textContent = ev.angle_y;
	});

	const animationButton = document.querySelector('.start_stop_animation');

	function start_stop_animation() {
		if (events.animationRunning) {
			events.stopAnimation();
			animationButton.textContent = 'Start Animation';
		} else {
			events.startAnimation();
			animationButton.textContent = 'Stop Animation';
		}
	}

	
	animationButton.addEventListener('click', function() {
		start_stop_animation();
	});


  scene.render();

	// animationButton.click();

	
	/*
	// Remove all event handlers
	canvas.removeEventListner( "mousedown", this.events.mouse_drag_started);
	canvas.removeEventListner( "mouseup", this.events.mouse_drag_ended );
	canvas.removeEventListner( "mousemove", this.events.mouse_dragged );
	canvas.removeAllEventHandlers();
	*/
	
	
}





// Ein kleiner Hack damit die Start-Funktion erst aufgerufen wird, nachdem DOM geladen ist.
(function r(f) {
    /in/.test(document.readyState) ? setTimeout(function() { r(f);}, 9) : f()
})(start);
	    