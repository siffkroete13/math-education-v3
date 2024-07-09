'user strict';

import { MyUtil } from './utils/my-util.js';
import { mat4 } from 'gl-matrix';
import { ShaderUtil } from './ShaderUtil.js';
import { Model_VOB } from './Model_VOB.js';
import WebGLDebugUtils from 'webgl-debug';



function createDebugContext(gl) {
    return WebGLDebugUtils.makeDebugContext(gl, (err, funcName, args) => {
        console.error(`WebGL error ${WebGLDebugUtils.glEnumToString(err)} in ${funcName}(${WebGLDebugUtils.glFunctionArgsToString(funcName, args)})`);
    });
}



var myUtil = MyUtil.getInstance();

function Scene(canvas_ct, gl, modelData, vShaderCode, fShaderCode) {
	// gl = createDebugContext(gl);

	this.canvas_ct = canvas_ct;
	this.gl = gl;

	this.modelData = modelData;
	
	this.programInfo = ShaderUtil.createProgram(gl, vShaderCode, fShaderCode);

	gl.useProgram(this.programInfo.program);

	this.models = [];
	this.modelNames = Object.keys(modelData);

	for(let i = 0; i < this.modelNames.length; ++i) {
		let m = this.modelData[this.modelNames[i]];
		// console.log('m: ', m);
		this.models.push(new Model_VOB(gl, this.programInfo, m));
	}

    this.angle_x = 0;
    this.angle_y = 0;
    this.angle_z = 0;


	this.render = function() {
        var gl = this.gl;

		const fieldOfView = 20 * (Math.PI / 180);
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.3;
        const zFar = 100.0;
        var projectionMatrix = mat4.create();

        // note: glmatrix.js always has the first argument as the destination to receive the result.
        // mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
        projectionMatrix = myUtil.getProjectionMat4(fieldOfView, aspect, zNear, zFar);

        // Set the drawing position to the "identity" point, which is the center of the scene.
        let modelViewMatrix = mat4.create();

        // Now move the drawing position a bit to where we want to start drawing the square.
        mat4.translate(modelViewMatrix,     // destination matrix
                    modelViewMatrix,     	// matrix to translate
                    [0.0, 0.0, -7]);  		// amount to translate
        
       
        mat4.rotate(modelViewMatrix, modelViewMatrix, myUtil.rad(this.angle_x), [1, 0, 0]);
        mat4.rotate(modelViewMatrix, modelViewMatrix, myUtil.rad(this.angle_y), [0, 1, 0]);
        // mat4.rotate(modelViewMatrix, modelViewMatrix, rad(this.angle_z), [0, 1, 1]);


        gl.clearColor(1.0, 1.0, 1.0, 1.0);  		// Clear to black, fully opaque
        gl.clearDepth(1.0);                 		// Clear everything
        // this.gl.enable(this.gl.DEPTH_TEST);      // Enable depth testing
        // this.gl.depthFunc(this.gl.LEQUAL);       // Near things obscure far things

        // Clear the entire canvas window background with the clear color
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        for(let i = 0; i < this.models.length; ++i) {
            this.models[i].render(projectionMatrix, modelViewMatrix);
        }

	}
	

	this.cleanUp = function() {
		// Clean up shader programs
		ShaderUtil.cleanUp(this.program);
	
		// Delete each model's VOB
		for(var i = 0; i < this.modelNames.length; ++i) {
			this.model_VOBs[this.modelNames[i]].cleanUp();
		}
	}

}



export { Scene };