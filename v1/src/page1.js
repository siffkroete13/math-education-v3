import { MyUtil } from './utils/my-util';


var myUtil = MyUtil.getInstance();

// App start
async function start() {

    const multiply_button = document.getElementById('multiply');

    if(!multiply_button) return;

    const matrixSize = 3; // Define size of the matrices (3x3 in this case)
        
    function createMatrix(tableId) {
        const table = document.getElementById(tableId);
        for (let i = 0; i < matrixSize; i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < matrixSize; j++) {
                const cell = document.createElement('td');
                const input = document.createElement('input');
                input.type = 'number';
                input.value = Math.floor(Math.random() * 10); // Random values for demo
                cell.appendChild(input);
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
    }

    function getMatrixValues(tableId) {
        const table = document.getElementById(tableId);
        const matrix = [];
        for (let row of table.rows) {
            const rowData = [];
            for (let cell of row.cells) {
                rowData.push(Number(cell.firstChild.value));
            }
            matrix.push(rowData);
        }
        return matrix;
    }

    function displayResult(matrix) {
        const table = document.getElementById('resultMatrix');
        table.innerHTML = ''; // Clear previous results
        for (let row of matrix) {
            const tableRow = document.createElement('tr');
            for (let value of row) {
                const cell = document.createElement('td');
                cell.textContent = value;
                tableRow.appendChild(cell);
            }
            table.appendChild(tableRow);
        }
    }

    function multiplyMatrices(ev) {
        const A = getMatrixValues('matrixA');
        const B = getMatrixValues('matrixB');
        const result = [];
        for (let i = 0; i < matrixSize; i++) {
            result[i] = [];
            for (let j = 0; j < matrixSize; j++) {
                let sum = 0;
                for (let k = 0; k < matrixSize; k++) {
                    sum += A[i][k] * B[k][j];
                }
                result[i][j] = sum;
            }
        }
        displayResult(result);
    }

    // Initialize matrices with inputs
    createMatrix('matrixA');
    createMatrix('matrixB');

    multiply_button.addEventListener('click', multiplyMatrices);
	
}





// Ein kleiner Hack damit die Start-Funktion erst aufgerufen wird, nachdem DOM geladen ist.
(function r(f) {
    /in/.test(document.readyState) ? setTimeout(function() { r(f);}, 9) : f()
})(start);
	    