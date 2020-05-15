/***********************************************************************************************/
// Global values in use by all functions
let a = '';
let b = '';
let op = '';
let expr = '';

// flag e for checking presence in equals
let e;
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
    a = a.toString();
    b = b.toString();

    if(b == ''){
        if(op == '') {
            a = a.slice(0, -1);
            output.textContent = a;   
        }
        else {
            b = a.slice(0, -1);
            output.textContent = b;
        }
    } else {
        if(e) {
            a = a.slice(0, -1);
            output.textContent = a;
        } else {
            b = b.slice(0, -1);
            output.textContent = b;
        }
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
    val = Math.round((+val + Number.EPSILON) * (10 ** 6)) / (10 ** 6);
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
    if(a % 1 || a.toString().indexOf('e') !== -1) {
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
        expr = +a + op;
        exprDisplay.textContent = expr;
        return;
    }
    
    // update expr for subsequent operations
    expr += +b + op;
    exprDisplay.textContent = expr;

    operateBinary(lastOp);
    
    // reset b to take in next operand
    b = '';  
}

function handleUnaryOperator() {
    const selected = document.querySelector('.selected-operator');
    if(selected) selected.classList.remove('selected-operator');

    if(a == '' || a == 'Not a Number') return;
    operateUnary(this.value);
}

function equals() {
    if(!e) e = true;

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
    
    expr = +a + op + +b + '=';
    exprDisplay.textContent = expr;

    operateBinary(op);
}

function saveNumber() {
    if (a == 'Not a Number') {
        reset();
    }

    const char = this.value;
    const text = output.textContent;

    if(char == '.' && text.indexOf('.') !== -1 ) return;
    
    if (op == '') {
        if (char == '0' && a == '') return;
        a += char;
        output.textContent = +a;
    } else {
        if (char == '0' && b == '') return;
        b += char;
        output.textContent = +b;
    }

    const style = window.getComputedStyle(output);
    let fontSize = parseInt(style.getPropertyValue('font-size'));
    console.log(fontSize);
    console.log(output.offsetWidth, output.scrollWidth);

    for (let i = fontSize; i >= 0; i--) {
        let overflow = isOverflown(output);
        if (overflow) {
            fontSize--;
            output.style.fontSize = fontSize + "px";
        }
    }
}

function keyboardInput(e) {
    let button = document.querySelector(`button[value='${e.key}']`);
    if(e.key == 'Enter'){
        e.preventDefault();
        button = document.querySelector('button[value=\'=\']');
    }
    if(!button) return;
    button.click();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Main code starts from here
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Create divs with buttons for numbers and append them to button area
const buttonArea = document.querySelector('#button-area');
for (let i = 9; i >= 0; i --) {
    const tmpDiv = document.createElement('div');
    tmpDiv.setAttribute('id', i);
    const tmpButton = document.createElement('button');
    tmpButton.classList.add('numbers');
    tmpButton.value = i;
    tmpButton.textContent = i;
    tmpDiv.appendChild(tmpButton);
    tmpDiv.style.gridArea = `num-${i}`;
    buttonArea.appendChild(tmpDiv);
}

// Select relevant elements and add appropriate event listeners
const numbers = document.querySelectorAll('.numbers');
numbers.forEach(number => number.addEventListener('click', saveNumber));

const binaryOperators = document.querySelectorAll('.binary-operators');
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

const display = document.querySelector('#display');
const output = document.querySelector('#output');
const exprDisplay = document.querySelector('#expression');


// Since the output of operations can be very large, we need to handle the display
// such that the text doesn't overflow display, thereby breaking the layout. Note 
// that rounding will only limit the number of digits after the decimal point, not
// the total length of the number. Therefore, this is a necessary additional step
function isOverflown (element) {
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}


