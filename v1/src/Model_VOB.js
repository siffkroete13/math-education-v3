function Model_VOB(gl, programInfo, model_data) {
	this.gl = gl;
	this.programInfo = programInfo;
	this.model_data = model_data;

	this.vertex_buffer_id = null;
	this.color_buffer_id = null;
	
	this.aVertexPosition = programInfo['attribLocations']['aVertexPosition'];
	this.aVertexColor = programInfo['attribLocations']['aVertexColor'];
   
    this.uProjectionMatrix = programInfo.uniformLocations.projectionMatrix;
    this.uModelViewMatrix = programInfo.uniformLocations.modelViewMatrix

	this.num_points = this.model_data.num_vertices; // 3 Werte pro Punkt (x, y, z) oder vielleicht 2 pro Punkt(x, y)

	this.normalize = false;

	this.stride = 0;
	this.offset = 0;

	this.type = this.gl.FLOAT;

	switch (model_data.primitives.toUpperCase()) {
		case 'POINTS':
			this.primitiveType = this.gl.POINTS;
			break;
		case 'LINES':
			this.primitiveType = this.gl.LINES;
			break;
		case 'LINE_STRIP':
			this.primitiveType = this.gl.LINE_STRIP;
			break;
		case 'LINE_LOOP':
			this.primitiveType = this.gl.LINE_LOOP;
			break;
		case 'TRIANGLES':
			this.primitiveType = this.gl.TRIANGLES;
			break;
		case 'TRIANGLE_STRIP':
			this.primitiveType = this.gl.TRIANGLE_STRIP;
			break;
		case 'TRIANGLE_FAN':
			this.primitiveType = this.gl.TRIANGLE_FAN;
			break;
		default:
			console.warn(`Unbekanntes Primitiv: ${model_data.primitives}. Standardmässig wird TRIANGLES verwendet.`);
			this.primitiveType = this.gl.TRIANGLES;
	}

	
	this.createVertextPositionBuffer = function () {
		// Wir haben hauptsächlich folgende Schritte hier auszuführen:
		// 1.) Vertex Buffer erstellen
		// 2.) Bind Buffer: Buffer an “target” binden. The target tells WebGL what type of data the buffer object contains, 
				// allowing it to deal with the contents correctly.
				// Das Ziel ist gl.ARRAY_BUFFER Specifies that the buffer object contains vertex data
				// oder gl.ELEMENT_ARRAY_BUFFER Specifies that the buffer object contains index values pointing to vertex data.
				// Hier haben wir gl.ARRAY_BUFFER genommen: gl.ARRAY_BUFFER is specified as the target to store vertex data (positions) in the buffer object.
		// 3.) Buffer Data: Allocates storage and writes data to the buffer. You use gl.bufferData() to do this.

		// 1.) 
		this.vertex_buffer_id = this.gl.createBuffer(); 
		
		if(!this.vertex_buffer_id) {
			alert('Failed to create the buffer object');
			return null;
		}
		
		// 2.) 
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertex_buffer_id);
		
      
		// 3.) Upload the data for this buffer object to the GPU.
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.model_data.positions), this.gl.STATIC_DRAW);
		
		return this.vertex_buffer_id;
	}

	this.createVertextColorBuffer = function () {
		// Falls es nicht gleich wiele Farben gibt wie vertices dann ist im Model nur eine Farbe hinterlegt.
		// Bin langsam zu faul für jeden vertex ein color zu setzen, machmal nehmen wir einfach eine Farbe und sparen Platz.
		if (this.model_data.colors.length === this.num_points * this.model_data.num_color) {
            this.color_buffer_id = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.color_buffer_id);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.model_data.colors), this.gl.STATIC_DRAW);
        } else {
            this.color_buffer_id = null;
        }
        return this.color_buffer_id;
	}

	this.createVertextPositionBuffer();
	this.createVertextColorBuffer();

	this.render = function(projectionMatrix, modelViewMatrix) {
		
		// myUtil.printMatrix4(projectionMatrix);
		// myUtil.printMatrix4(modelViewMatrix);

		
		// 1.) Vertex Buffer erstellen (wenn schon erstellt, dann kann man den ersten Punkt auslassen)
		// 2.) Bind Buffer: Buffer an “target” binden. The target tells WebGL what type of data the buffer object contains, 
				// allowing it to deal with the contents correctly.
				// Das Ziel ist gl.ARRAY_BUFFER Specifies that the buffer object contains vertex data
				// oder gl.ELEMENT_ARRAY_BUFFER Specifies that the buffer object contains index values pointing to vertex data.
				// Hier haben wir gl.ARRAY_BUFFER genommen: gl.ARRAY_BUFFER is specified as the target to store vertex data (positions) in the buffer object.
		// 4.) Buffer Data: Allocates storage and writes data to the buffer. You use gl.bufferData() to do this.
		// 5.) Excecute shader
		// 1.) uniform variables ==>  shader kopieren. (uniform sind Variablen die sich während dem Rendering nicht ändern).

		this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
		this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);

		
		
		// Vertex Position Buffer
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertex_buffer_id);

		// Assign the buffer object bound to gl.ARRAY_BUFFER to the attribute variable specified by location 
		this.gl.vertexAttribPointer(this.programInfo.attribLocations.vertexPosition, this.model_data.num_dim, this.type, this.normalize, this.stride, this.offset);
		this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexPosition);
		
	
		if (this.color_buffer_id) {
			// Vetex Color Buffer
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.color_buffer_id);
			// Assign the buffer object bound to gl.ARRAY_BUFFER to the attribute variable specified by location 
            this.gl.vertexAttribPointer(this.programInfo.attribLocations.vertexColor, this.model_data.num_color, this.type, this.normalize, this.stride, this.offset);
            this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexColor);
        } else {
            const defaultColor = this.model_data.colors; // Hier haben wir für alle vertices einfach eine Farbe genommen. (Spart Platz)
            this.gl.disableVertexAttribArray(this.programInfo.attribLocations.vertexColor);
            this.gl.vertexAttrib4fv(this.programInfo.attribLocations.vertexColor, defaultColor);
        }

		// console.log('this.primitiveType: ', this.primitiveType);
		// const gl_primitives = gl.TRIANGLE_STRIP
		this.gl.drawArrays(this.primitiveType, this.offset, this.num_points);

		const error = gl.getError();
		if (error !== gl.NO_ERROR) {
			console.error('WebGL Error: ', error);
		}
		
	}

} // End Konstruktor


export {Model_VOB}