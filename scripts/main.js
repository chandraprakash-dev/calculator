/***********************************************************************************************/
// Global values in use by all functions
let a = '';
let b = '';
let first = true;
let op = ''
let savedB;
let savedLastOp;
/***********************************************************************************************/

function add() {
    a = +a + +b;
    console.log(a);
    return a;
}

function subtract() {
    a -= b;
    return a;
}

function multiply() {
    a *= b;
    console.log(a);
    return a;
}

function divide() {
    a /= b;
    return a;
}


function operate(e) {
    lastOp = op;
    console.log('last op is' +lastOp);
    
    // if (this) {
        // console.log(this);
        op = this.textContent;
        this.classList.add('selected-operator');
    // }

    if (first){
        first = false;
        return;
    }
    
    display.textContent = '';

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
        case '=':
            // answer = ;
            break;
        default:
            console.log('Enter a valid expression');
    }

    console.log('op is' + op);
    if (op == '=') {
        const opButton = document.querySelector(`#operators [value = '${op}']`);
        opButton.classList.remove('selected-operator');
    //     // save b, lastop
    //     if(lastOp != '=') {
    //         savedB = b;
    //         savedLastOp = lastOp;
    //     } else {
    //         b = savedB;
    //         op = savedLastOp;
    //         console.log('b is' + b + 'op is' + op);
    //         operate();
    //     }
    }

    // reset b to take new value
    b = '';
    display.textContent = a;
}

function saveNumber(e) {
    const opButton = document.querySelector(`#operators [value = '${op}']`);
    if (opButton){
        opButton.classList.remove('selected-operator');
    }
    if (op == '=') {
        a = '';
        b = '';
        op = '';
        first = true;
    }

    if (first) {
        a += this.textContent;
        display.textContent = a;
    } else {
        b += this.textContent;
        display.textContent = b;
    }
    console.log(a, b);
}

const numbers = document.querySelectorAll('#numbers button');
numbers.forEach(number => number.addEventListener('click', saveNumber));

const operators = document.querySelectorAll('#operators button');
operators.forEach(operator => operator.addEventListener('click',operate));

const display = document.querySelector('#display');
