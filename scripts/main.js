a = b = '';
first = true;

function add(a, b) {
    a = parseInt(a) + parseInt(b);
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a/b;
}

function operate(op, a, b) {
    if (first) [
        first = false;
    ]
    switch(op) {
        case '+':
            add(a, b);
            break;
        case '-':
            subtract(a, b);
            break;
        case '*':
            multiply(a, b);
            break;
        case '/':
            divide(a, b);
            break;
        default:
            console.log('Enter a valid expression');
    }
}

function saveA(e) {
    const display = document.querySelector('#display');
    if (first) {
        a += e.toElement.textContent;
        display.textContent = a;
    } else {
        b += e.toElement.textContent;
        display.textContent = b;
    }

}

function (e) {
    const display = document.querySelector('#display');

    b += e.toElement.textContent;

}

const numbers = document.querySelectorAll('#numbers button');
numbers.forEach(number => number.addEventListener('click', saveNumber));

const operators = document.querySelectorAll('#operators button');
operators.forEach(operator => operator.addEventListener('click',operate));
