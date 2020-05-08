/***********************************************************************************************/
// Global values in use by all functions
let a = '';
let b = '';

let op = '';
let lastOp = '';

let savedB;
let savedLastOp;
/***********************************************************************************************/

function reset() {
    a = '';
    b = '';
    op = '';
    savedB;
}

function add() {
    a = +a + +b;
    return a;
}

function subtract() {
    a -= b;
    return a;
}

function multiply() {
    a *= b;
    return a;
}

function divide() {
    a /= b;
    return a;

}

function operate() {
    lastOp = op;
    op = this.textContent;

    if(lastOp != ''){
        lastOpButton = document.querySelector(`button[value = '${lastOp}']`);
        lastOpButton.classList.remove('selected-operator');
    }
    // highlight the operator 
    opButton = document.querySelector(`button[value = '${op}']`);
    opButton.classList.add('selected-operator');
    
    if(b == '') return;
    
    switch(lastOp) {
        case '+':
            add();
            break;
        case '-':
            subtract();
            break;
        case '*':
            multiply();
            break;
        case '/':
            divide();
            break;
        default:
            console.log('Enter a valid expression');
    }    

    // reset b for next input
    b = '';    
    display.textContent = a;
}

function equals() {
    // case 1: follows a number

    // case 2: follows a operator
        // if b is empty, b = a

}

function saveNumber() {
    const opButton = document.querySelector(`#operators [value = '${op}']`);
    if (opButton){
        opButton.classList.remove('selected-operator');
    }
    
    if (op == '') {
        a += this.textContent;
        display.textContent = a;
    } else {
        b += this.textContent;
        display.textContent = b;
    }
}

const numbers = document.querySelectorAll('#numbers button');
numbers.forEach(number => number.addEventListener('click', saveNumber));

const operators = document.querySelectorAll('#operators button');
operators.forEach(operator => operator.addEventListener('click',operate));

const equalOperator = document.querySelector(`button[value = '=']`);
equalOperator.addEventListener('click', equals);

const acButton = document.querySelector(`button[value = 'AC']`);
acButton.addEventListener('click', reset);

const display = document.querySelector('#display');
