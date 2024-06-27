var ShaderUtil = (function() {
	function ShaderUtil() {}
	
	ShaderUtil.prototype.createAndCompile = function(gl, type, source) {
		// Create shader object
		var shader = gl.createShader(type);
		if (!shader) {
			alert("Fatal error: gl could not create a shader object.");
		}
		
		// Send the source code to the gl shader object
		gl.shaderSource(shader, source);
	
		// Compile the shader code
		gl.compileShader(shader);
	
		// Check for any compiler errors
		var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
		if (!compiled) {
			// There are errors, so display them
			var errors = gl.getShaderInfoLog(shader);
			alert('Failed to compile ' + type + ' with these errors:' + errors);
			gl.deleteShader(shader);
			shader = null;
		}
		// See if it compiled successfully
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
			shader = null;
		}
		
		return shader;
	}
	
	ShaderUtil.prototype.createProgram = function(gl, vShaderCode, fShaderCode) {
		// Create the 2 required shaders
		var vertexShader = this.createAndCompile(gl, gl.VERTEX_SHADER, vShaderCode);
		var fragmentShader = this.createAndCompile(gl, gl.FRAGMENT_SHADER, fShaderCode);
		if (!vertexShader || !fragmentShader) {
			alert('vertex oder fragment shader ist null');
			return null;
		}
		
		// Create a gl program object
		var program = gl.createProgram();
		if (!program) {
			alert('Fatal error: Failed to create a program object');
		  	return null;
		}
		
		// Attach the shader objects
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		
		// Link the program object
		gl.linkProgram(program);
		
		// Check for success
		var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
		if (!linked) {
			// There were errors, so get the errors and display them.
			var error = gl.getProgramInfoLog(program);
			alert('Fatal error: Failed to link program: ' + error);
			gl.deleteProgram(program);
			gl.deleteShader(fragmentShader);
			gl.deleteShader(vertexShader);
			return null;
		}
		
		
		var program_data = {};
		
		program_data['program'] = program; // Dieses Programm übergeben wir später an gl (WebGl-Context)
		
		// Remember the shaders so they can be used later
		program_data['vShader'] = vertexShader;
		program_data['fShader'] = fragmentShader;
		
		// Collect all the info needed to use the shader program. Look up which attributes our shader program is using
		// for aVertexPosition, aVertexColor and also look up uniform locations.
		program_data['uniformLocations'] = {
			projectionMatrix: gl.getUniformLocation(program, 'uProjectionMatrix'),
			modelViewMatrix: gl.getUniformLocation(program, 'uModelViewMatrix'),
		};
		
		program_data['attribLocations'] = {
			vertexPosition: gl.getAttribLocation(program, 'aVertexPosition'),
			vertexColor: gl.getAttribLocation(program, 'aVertexColor'),
		};

		return program_data;
  	}
	
	ShaderUtil.prototype.cleanUp = function(program) {
		this.gl.deleteShader(program.vShader);
		this.gl.deleteShader(program.fShader);
		this.gl.deleteProgram(program);
	}

	ShaderUtil.prototype.loadShaderSource = async function(url) {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Failed to load shader from ${url}: ${response.statusText}`);
		}
		return await response.text();
	}

	
	return new ShaderUtil();
	
})();

export {ShaderUtil}