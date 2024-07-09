var ModelUtil = (function() {
    
    function ModelUtil() {}

    ModelUtil.prototype.interpolate = function(point1, point2, t) {
        return [
            point1[0] + t * (point2[0] - point1[0]),
            point1[1] + t * (point2[1] - point1[1]),
            point1[2] + t * (point2[2] - point1[2])
        ];
    };

    ModelUtil.prototype.generateCubePoints = function(numPointsPerEdge) {
        const vertices = [
            [-1.0, -1.0,  1.0], // Ecke 1
            [ 1.0, -1.0,  1.0], // Ecke 2
            [ 1.0,  1.0,  1.0], // Ecke 3
            [-1.0,  1.0,  1.0], // Ecke 4
            [-1.0, -1.0, -1.0], // Ecke 5
            [ 1.0, -1.0, -1.0], // Ecke 6
            [ 1.0,  1.0, -1.0], // Ecke 7
            [-1.0,  1.0, -1.0]  // Ecke 8
        ];

        const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0], // Vorderseite
            [4, 5], [5, 6], [6, 7], [7, 4], // Rückseite
            [0, 4], [1, 5], [2, 6], [3, 7]  // Verbindungen
        ];

        const positions = [];
        const colors = [];

        edges.forEach(([start, end]) => {
            const startPoint = vertices[start];
            const endPoint = vertices[end];
            for (let i = 0; i <= numPointsPerEdge; i++) {
                const t = i / numPointsPerEdge;
                const point = this.interpolate(startPoint, endPoint, t);
                positions.push(...point);
                colors.push(1.0, 1.0, 1.0, 1.0); // Weiße Farbe für alle Punkte
            }
        });

        return { positions, colors };
    };

    ModelUtil.prototype.generateCube = function(numPointsPerEdge) {
        const { positions, colors } = this.generateCubePoints(numPointsPerEdge);

        const cube = {
            "cube_points": {
                "type": "FLOAT",
                "primitives": "POINTS",
                "num_vertices": positions.length / 3,
                "num_dim": 3,
                "num_color": 4,
                "positions": positions,
                "colors": colors
            }
        };

        return cube;
    };

    ModelUtil.prototype.formatCube = function(cube) {
        function formatArray(arr, groupSize) {
            let formattedString = '';
            for (let i = 0; i < arr.length; i += groupSize) {
                const group = arr.slice(i, i + groupSize);
                formattedString += group.join(', ') + '\n';
            }
            return formattedString;
        }

        const positionsString = formatArray(cube.cube_points.positions, 12);
        const colorsString = formatArray(cube.cube_points.colors, 12);

        return `Cube Points:\n\nType: ${cube.cube_points.type}\nPrimitives: ${cube.cube_points.primitives}\nNumber of Vertices: ${cube.cube_points.num_vertices}\nNumber of Dimensions: ${cube.cube_points.num_dim}\nNumber of Colors: ${cube.cube_points.num_color}\n\nPositions:\n${positionsString}\nColors:\n${colorsString}`;
    };

    ModelUtil.prototype.formatCubeAsJson = function(cube) {
        return JSON.stringify(cube, null, 2);
    };

    ModelUtil.prototype.downloadJson = function(cube, filename) {
        const jsonString = JSON.stringify(cube, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log(`Cube data has been saved to ${filename}`);
    };

    ModelUtil.prototype.transform = function(model, transformMatrix) {
        const transformedModel = self.clone(model); // Tiefe Kopie des Modells
    
        const numVertices = model.positions.length / model.num_dim;
    
        for (let i = 0; i < numVertices; i++) {
            const vertex = [
                model.positions[i * model.num_dim],
                model.positions[i * model.num_dim + 1],
                model.positions[i * model.num_dim + 2],
                1.0 // Homogene Koordinate
            ];
    
            const transformedVertex = self.myUtil.multiplyMatrixAndPoint4d(transformMatrix, vertex);
    
            transformedModel.positions[i * model.num_dim] = transformedVertex[0];
            transformedModel.positions[i * model.num_dim + 1] = transformedVertex[1];
            transformedModel.positions[i * model.num_dim + 2] = transformedVertex[2];
        }
    
        return transformedModel;
    };
    

    var instance = null;
	
	return {
		getInstance: function(myUtil) {
			if(instance === null) {
				instance = new Util(myUtil);
                instance.prototype.myUtil = myUtil;
			}
			return instance;
		}
	}
})();

export { ModelUtil };