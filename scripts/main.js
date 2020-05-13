/***********************************************************************************************/
// Global values in use by all functions
let a = '';
let b = '';
let op = '';
let expr = '';

// flag e for checking presence in equals
let e;
// flag s for checking presence in saveNumber
let s;
/***********************************************************************************************/
function reset() {
    a = '';
    b = '';
    op = '';
    expr = '';

    output.textContent = +a;
    exprDisplay.textContent = expr;

    const selected = document.querySelector('.selected-operator');
    if(selected) selected.classList.remove('selected-operator');
}

function deleteInput() {
    if (!s) return;

    if(op == '') {
        a = a.slice(0, -1);
        output.textContent = a;
    } else {
        b = b.slice(0, -1);
        output.textContent = b;
    }
    if (output.textContent == ''){
        output.textContent = +output.textContent;  
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
    if(b == ''){
        if(op == '') {
            a *= -1;
            output.textContent = a;   
        }
        else {
            b = -a;
            output.textContent = b;
        }
    } else {
        if(e) {
            a *= -1;
            output.textContent = a;
        } else {
            b *= -1;
            output.textContent = b;
        }
    }
}

function percentage() {
    if(b == ''){
        if(op == '') {
            a /= 100;
            output.textContent = a;   
        }
        else {
            b = a/100;
            output.textContent = b;
        }
    } else {
        if(e) {
            a /= 100;
            output.textContent = a;
        } else {
            b /= 100;
            output.textContent = b;
        }
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
        output.textContent = rounded(a);
    } else {
        output.textContent = a;
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
}

function handleBinaryOperator() {
    // If we just came from =, clear value in b and expr
    if(e) {
        b = '';
        expr = '';
        e = false;
    }
    if(s) s = false;

    lastOp = op;
    if(lastOp != ''){
        lastOpButton = document.querySelector(`button[value = '${lastOp}']`);
        lastOpButton.classList.remove('selected-operator');
    }
    
    op = this.value;
    opButton = document.querySelector(`button[value = '${op}']`);
    opButton.classList.add('selected-operator');
    
    if(a == 'Not a Number') return;  
    if(b == '') {
        // expr = expr.slice(0, -1) + op;
        expr = a + op;
        exprDisplay.textContent = expr;
        return;
    }
    
    // update expr for subsequent operations
    expr += b + op;
    exprDisplay.textContent = expr;

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

    if(op != '') {
        opButton = document.querySelector(`button[value = '${op}']`);
        opButton.classList.remove('selected-operator');
    }
    
    if(a == 'Not a Number') return;
    if (op == '') {
        expr = +a + '=';
        exprDisplay.textContent = expr;
        return;
    }

    if (b == '') {
        b = +a;
    }
    
    expr = +a + op + b + '=';
    exprDisplay.textContent = expr;

    operateBinary(op);
}

function saveNumber() {
    if(!s) s = true;
    if (a == 'Not a Number') {
        reset();
    }

    const char = this.value;
    const text = output.textContent;

    if(char == '.' && text.indexOf('.') !== -1) return;
    
    if (op == '') {
        a += char;
        output.textContent = +a;
    } else {
        b += char;
        output.textContent = +b;
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

const unaryOperators = document.querySelectorAll('.unary-operators');
unaryOperators.forEach(unaryOperator => unaryOperator.addEventListener('click', handleUnaryOperator));

const acButton = document.querySelector(`button[value = 'AC']`);
acButton.addEventListener('click', reset);

const delButton = document.querySelector(`button[value = 'Backspace']`);
delButton.addEventListener('click', deleteInput);

window.addEventListener('keydown', keyboardInput);

const output = document.querySelector('#output');
const exprDisplay = document.querySelector('#expression');
