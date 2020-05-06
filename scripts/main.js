let answer;
let a = '';
let b = '';
let first = true;
let op = ''

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
    if (op == '=') {
        const opButton = document.querySelector(`#operators [value = '${op}']`);
        opButton.classList.remove('selected-operator');
    }
    
    lastOp = op;
    op = this.textContent;
    this.classList.add('selected-operator');

    if (first){
        first = false;
        return;
    }
    
    const display = document.querySelector('#display');
    display.textContent = '';

    switch(lastOp) {
        case '+':
            answer = add();
            break;
        case '-':
            answer = subtract();
            break;
        case '*':
            answer = multiply();
            break;
        case '/':
            answer = divide();
            break;
        case '=':
            // answer = ;
            break;
        default:
            console.log('Enter a valid expression');
    }
    b = '';
    display.textContent = answer;
}

function saveNumber(e) {
    const display = document.querySelector('#display');

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
    console.log(a, b);
}

const numbers = document.querySelectorAll('#numbers button');
numbers.forEach(number => number.addEventListener('click', saveNumber));

const operators = document.querySelectorAll('#operators button');
operators.forEach(operator => operator.addEventListener('click',operate));

