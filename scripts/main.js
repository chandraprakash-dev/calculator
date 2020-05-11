/***********************************************************************************************/
// Global values in use by all functions
let a = '';
let b = '';
let op = '';

// flag e for checking presence in equals
let e;
// flag s for checking presence in saveNumber
let s;
/***********************************************************************************************/
function reset() {
    a = '';
    b = '';
    op = '';
    e = false;

    display.textContent = +a;
    const selected = document.querySelector('.selected-operator');
    if(selected) selected.classList.remove('selected-operator');
}

function deleteInput() {
    if (!s) return;

    if(op == '') {
        a = a.slice(0, -1);
        display.textContent = a;
    } else {
        b = b.slice(0, -1);
        display.textContent = b;
    }
    if (display.textContent == ''){
        display.textContent = +display.textContent;  
    }
}

function rounded(val) {
    let exponent;
    if(val.toString().indexOf('e') !== -1) {
        exponent = val.toString().split('e')[1];
        val = val.toString().split('e')[0];
    }  
    val = Math.round((+val + Number.EPSILON) * (10 ** 10)) / (10 ** 10);
    if(exponent) 
        return val + 'e' + exponent;

    return val;    
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
    if(b == 0) {
        a = 'Not a Number';
        return;
    }
    a /= b;
}

function toggleSign() {
    if(op == ''){
        a *= -1;
    } else {
        b *= -1;
    }
}

function percentage() {
    if(op == '') {
        a /= 100;
    } else {
        b /= 100;
    }
}

function operateBinary(operator) {
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
    if(a % 1) {
        display.textContent = rounded(a);
    } else {
        display.textContent = a;
    }
}

function operateUnary(operator) {
    switch(operator) {
        case '+-':
            toggleSign();
            break;
        case '%':
            percentage();
            break;
    }
    if(op == ''){
        display.textContent = a;
    } else {
        display.textContent = b;
    }
}

function handleBinaryOperator() {
    // If we just came from =, clear value in b
    if(e) {
        b = '';
        e = false;
    }
    if(s) s = false;

    lastOp = op;
    if(lastOp != ''){
        lastOpButton = document.querySelector(`button[value = '${lastOp}']`);
        lastOpButton.classList.remove('selected-operator');
    }
    
    op = this.textContent;
    opButton = document.querySelector(`button[value = '${op}']`);
    opButton.classList.add('selected-operator');
    
    if (lastOp == '' || a == 'Not a Number' || b == '') return;   
    operateBinary(lastOp);
    // reset b to take in next operand
    b = '';  
}

function handleUnaryOperator() {
    if(s) s = false;

    const selected = document.querySelector('.selected-operator');
    if(selected) selected.classList.remove('selected-operator');

    if(a == '' || a == 'Not a Number') return;
    operateUnary(this.value);
}

function equals() {
    if(!e) e = true;
    if(s) s = false;

    opButton = document.querySelector(`button[value = '${op}']`);
    opButton.classList.remove('selected-operator');

    if(op == '' || a == 'Not a Number') return;
    if (b == '') {
        b = a;
    }
    operateBinary(op);
}

function saveNumber() {
    if(!s) s = true;
    if (a == 'Not a Number') return
    if (op == '') {
        a += this.textContent;
        display.textContent = a;
    } else {
        b += this.textContent;
        display.textContent = b;
    }
}

function keyboardInput(e) {
    const button = document.querySelector(`button[value='${e.key}']`);
    if(!button) return;
    button.click();
}

const numbers = document.querySelectorAll('#numbers button');
numbers.forEach(number => number.addEventListener('click', saveNumber));

const binaryOperators = document.querySelectorAll('#binary-operators button');
binaryOperators.forEach(operator => operator.addEventListener('click',handleBinaryOperator));

const equalOperator = document.querySelector(`button[value = '=']`);
equalOperator.addEventListener('click', equals);

const unaryOperators = document.querySelectorAll('#unary-operators button');
unaryOperators.forEach(unaryOperator => unaryOperator.addEventListener('click', handleUnaryOperator));

const acButton = document.querySelector(`button[value = 'AC']`);
acButton.addEventListener('click', reset);

const delButton = document.querySelector(`button[value = 'Backspace']`);
delButton.addEventListener('click', deleteInput);

window.addEventListener('keydown', keyboardInput);

const display = document.querySelector('#display');
