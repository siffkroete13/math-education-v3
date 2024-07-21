
class CoordinateSystem {
    constructor(model, util) {
        this.model = model;
        this.originalModel = JSON.parse(JSON.stringify(model)); // Eine Kopie des Originalmodells speichern
        this.util = util;
    }

    static merge(model1, model2) {
        return new CoordinateSystem(Object.assign({}, model1.getData(), model2.getData()));
    }

    clone() {
        return new CoordinateSystem(this.util.clone(this.model));
    }

    getData() {
        return this.model;
    }

    // Methode zur Anwendung einer Transformationsmatrix auf das Modell
    transform(matrix) {
        const { positions } = this.model.axes;

        // Transformiere die Positionen
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            const z = positions[i + 2];

            // Neue Positionen berechnen
            positions[i] = matrix[0][0] * x + matrix[0][1] * y + matrix[0][2] * z;
            positions[i + 1] = matrix[1][0] * x + matrix[1][1] * y + matrix[1][2] * z;
            positions[i + 2] = matrix[2][0] * x + matrix[2][1] * y + matrix[2][2] * z;
        }

        const { tickPositions } = this.model.ticks;

        // Transformiere die Ticks-Positionen
        for (let i = 0; i < tickPositions.length; i += 3) {
            const x = tickPositions[i];
            const y = tickPositions[i + 1];
            const z = tickPositions[i + 2];

            // Neue Positionen berechnen
            tickPositions[i] = matrix[0][0] * x + matrix[0][1] * y + matrix[0][2] * z;
            tickPositions[i + 1] = matrix[1][0] * x + matrix[1][1] * y + matrix[1][2] * z;
            tickPositions[i + 2] = matrix[2][0] * x + matrix[2][1] * y + matrix[2][2] * z;
        }
        return this;
    }

    // Methode zur Transformation in die orthonormale Basis
    toOrthoNormalBasis() {
        // Setze das Modell auf die ursprünglichen Werte zurück
        this.model = JSON.parse(JSON.stringify(this.originalModel));
        return this;
    }

    // Methode zur Transformation in eine andere Basis
    transformToBasis(destBasis, sourceBasis = null) {
        let transformationMatrix = null;
        if(sourceBasis) {
            let inverseMatrix = this.util.inverse3d(sourceBasis); // Zurück zur Ortho-Normal-Basis
            transformationMatrix = this.util.multiply3d(destBasis, inverseMatrix);
        } else {
            // Wenn keine source basis dann ist source basis die Einheitsmatrix, d.h. das Koordinatensystem befindet sich
            // in der Ortho-Normal-Basis und kann einfach mit destBasis multipliziert werden.
            transformationMatrix = destBasis;
        }

        this.transform(transformationMatrix);
        return this;
    }



}

export { CoordinateSystem };
