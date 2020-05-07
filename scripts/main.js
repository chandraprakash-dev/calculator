/***********************************************************************************************/
// Global values in use by all functions
let a = '';
let b = '';
let first = true;

let op = '';
let lastOp = '';

let savedB;
let savedLastOp;
/***********************************************************************************************/

function reset() {
    a = '';
    b = '';
    op = '';
    first = true;
    savedB
}

function add() {
    a = +a + +b;
    console.log('in add' + a);
    b = 0;
    return a;
}

function subtract() {
    a -= b;
    console.log('in sub' + a);
    b = 0;
    return a;

}

function multiply() {
    a *= b;
    console.log('in mul' + a);
    b = 1;
    return a;

}

function divide() {
    a /= b;
    console.log('in div' + a);
    b = 1;
    return a;

}

function operate() {
    lastOp = op;
    op = this.textContent;
    this.classList.add('selected-operator');

    if (first){
        first = false;
        return;
    }
    
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
    
    if (first) {
        a += this.textContent;
        display.textContent = a;
    } else {
        b += this.textContent;
        display.textContent = b;
    }
    console.log('in save number' + a, b);
}

const numbers = document.querySelectorAll('#numbers button');
numbers.forEach(number => number.addEventListener('click', saveNumber));

const operators = document.querySelectorAll('#operators button');
operators.forEach(operator => operator.addEventListener('click',operate));

const equalOperator = document.querySelector(`button[value = '=']`);
equalOperator.addEventListener('click', equals);

const display = document.querySelector('#display');
