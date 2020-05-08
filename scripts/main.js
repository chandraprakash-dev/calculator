/***********************************************************************************************/
// Global values in use by all functions
let a = '';
let b = '';
let op = '';
let e;
/***********************************************************************************************/

function reset() {
    a = '';
    b = '';
    op = '';
}

function add() {
    a = +a + +b;
}

function subtract() {
    a -= b;
}

function multiply() {
    a *= b;
}

function divide() {
    a /= b;
}

function operate(operator) {
    switch(operator) {
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
    }
}

function handleOperator() {
    lastOp = op;
    if(e) {
        b = '';
        e = false;
    }

    op = this.textContent;
    opButton = document.querySelector(`button[value = '${op}']`);
    opButton.classList.add('selected-operator');
    
    if (lastOp == '') return;
    
    lastOpButton = document.querySelector(`button[value = '${lastOp}']`);
    lastOpButton.classList.remove('selected-operator');
    
    if(b == '') return;
    
    operate(lastOp);
    b = '';  

    display.textContent = a;
}

function equals() {
    if(op == '') return;
    opButton = document.querySelector(`button[value = '${op}']`);
    opButton.classList.remove('selected-operator');

    if (b == '') {
        b = a;
    }
    e = true;
    operate(op);
    display.textContent = a;
}

function saveNumber() {
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
operators.forEach(operator => operator.addEventListener('click',handleOperator));

const equalOperator = document.querySelector(`button[value = '=']`);
equalOperator.addEventListener('click', equals);

const acButton = document.querySelector(`button[value = 'AC']`);
acButton.addEventListener('click', reset);

const display = document.querySelector('#display');
