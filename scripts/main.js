let a = '';
let b = '';
let first = true;

function add() {
    a = +a + +b;
    console.log(a);
    return a;
}

function subtract() {
    return a - b;
}

function multiply() {
    return a * b;
}

function divide() {
    return a/b;
}

function operate(e) {
    op = e.toElement.textContent;
    const display = document.querySelector('#display');
    display.textContent = '';

    if (first) {
        first = false;
        return;
    }

    answer = 0;
    switch(op) {
        case '+':
            console.log('case');
            answer = add();
            break;
        case '-':
            answer = subtract();
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
    b = '';
    display.textContent = answer;
}

function saveNumber(e) {
    const display = document.querySelector('#display');
    if (first) {
        a += e.toElement.textContent;
        display.textContent = a;
    } else {
        b += e.toElement.textContent;
        display.textContent = b;
    }
    console.log(a, b);
}

const numbers = document.querySelectorAll('#numbers button');
numbers.forEach(number => number.addEventListener('click', saveNumber));

const operators = document.querySelectorAll('#operators button');
operators.forEach(operator => operator.addEventListener('click',operate));
