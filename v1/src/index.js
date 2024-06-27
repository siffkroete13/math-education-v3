import { MyUtil } from './utils/my-util';
import { mat4 } from 'gl-matrix';
import { Scene } from './Scene';
import { ShaderUtil } from './ShaderUtil';
import { Model_VOB } from './Model_VOB';
import { Events } from './Events';
import WebGLDebugUtils from 'webgl-debug';
import { LoadModel } from './LoadModel';
import { GenerateModels } from './utils/GenerateModels';

var myUtil = MyUtil.getInstance();

// App start
async function start() {

	// var cube_with_points = GenerateModels.generateCube(8);
	// GenerateModels.downloadJson(cube_with_points);

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

	
	const [vShaderCode, fShaderCode, modelData]  = await Promise.all([
		ShaderUtil.loadShaderSource('./shaders/vShaderCode.glsl'),
		ShaderUtil.loadShaderSource('./shaders/fShaderCode.glsl'),
		new LoadModel().loadFromUrl('./models/cube_with_axes.json')
	]);

    // console.log('Vertex Shader Code:', vShaderCode);
    

	var scene = new Scene(canvas, gl, modelData, vShaderCode, fShaderCode);

	var controls = ['my_start', 'my_pause'];

	var events = new Events(scene, controls);
	
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

	animationButton.click();

	
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
	    