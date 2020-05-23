/***********************************************************************************************/
// Global values in use by all functions
let a = '';
let b = '';
let op = '';
let expr = '';

// flag e for checking presence in equals
let e;

//flag s for checking presence in saveNumber
let s;
/***********************************************************************************************/
function removeStyle(e) {

    console.log(e);
    if(e.propertyName !== 'transform') return;
    this.classList.remove('playing');
}

function outputContent(val) {
    output.textContent = val;
    if (output.textContent === ''){
        output.textContent = +output.textContent;  
    }
    fitText(output);
}

function exprContent(val) {
    exprDisplay.textContent = val;
    // fitText(exprDisplay);
}

function fitText(element) {
    // Since the output of operations can be very large, we need to handle the display
    // such that the text doesn't overflow display, thereby breaking the layout. Note 
    // that rounding will only limit the number of digits after the decimal point, not
    // the total length of the number. Therefore, this is a necessary additional step
    const style = window.getComputedStyle(element);
    let fontSize = parseInt(style.getPropertyValue('font-size'));
    if (!isOverflown(output)) {
        // reset the font size if it is not overflowing anymore
        if(fontSize !== 40) output.style.fontSize = '2.5em';
        return;
    }

    for (let i = fontSize; i >= 0; i--) {
        let overflow = isOverflown(output);
        if (overflow) {
            fontSize--;
            output.style.fontSize = fontSize + "px";
        }
    }

    
}

function isOverflown (element) {
    return element.scrollWidth > element.clientWidth;
}

function reset() {
    a = '';
    b = '';
    op = '';
    expr = '';

    outputContent(+a);
    exprContent(expr);
}

function deleteInput() {
    if (!s) return;
    a = a.toString();
    b = b.toString();

    if(op == '') {
        a = a.slice(0, -1);
        outputContent(a);   
    }
    else {
        b = b.slice(0, -1);
        outputContent(b);
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
            outputContent(a);   
        }
        else {
            b = -a;
            outputContent(b);
        }
    } else {
        if(e) {
            a *= -1;
            outputContent(a);
        } else {
            b *= -1;
            outputContent(b);
        }
    }
}

function percentage() {
    if(b == ''){
        if(op == '') {
            a /= 100;
            outputContent(a);   
        }
        else {
            b = a/100;
            outputContent(b);
        }
    } else {
        if(e) {
            a /= 100;
            outputContent(a);
        } else {
            b /= 100;
            outputContent(b);
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
    if(a % 1 || (a != "Not a Number" && a.toString().indexOf('e') !== -1) ) {
        outputContent(rounded(a));
    } else {
        outputContent(a);
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

function handleBinaryOperator(value) {
    // If we just came from =, clear value in b and expr
    if(e) {
        b = '';
        expr = '';
        e = false;
    }
    if(s) s = false;

    lastOp = op;
    op = value;
    
    if(a == 'Not a Number') return;  
    if(b == '') {
        expr = +a + op;
        exprContent(expr);
        return;
    }
    
    // update expr for subsequent operations
    expr += +b + op;
    exprContent(expr);

    operateBinary(lastOp);
    
    // reset b to take in next operand
    b = '';  
}

function handleUnaryOperator(value) {
    if(s) s = false;

    if(a == '' || a == 'Not a Number') return;
    operateUnary(value);
}

function equals() {
    if(!e) e = true;
    if(s) s = false;
    
    if(a == 'Not a Number') return;
    if (op == '') {
        expr = +a + '=';
        exprContent(expr);
        return;
    }

    if (b == '') {
        b = +a;
    }
    
    expr = +a + op + +b + '=';
    exprContent(expr);

    operateBinary(op);
}

function saveNumber(value) {
    if(!s) s = true;
    if (a == 'Not a Number' || e) {
        reset();
        if(e) e = false;
    }

    const char = value;
    if (op == '') {
        if ( (char == '0' && a == '') || (char == '.' && a.toString().indexOf('.') != -1) ) return;
        if(a == '' && char == '.') a = '0'
        a += char;
        outputContent(a);
    } else {
        if ( (char == '0' && b == '') || (char == '.' && b.toString().indexOf('.') != -1) )return;
        if(b == '' && char == '.') b = '0'
        b += char;
        outputContent(b);
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

function selectFunction() {
    this.classList.add('selected');  

    let btn = this.value; 
    if(!isNaN(+btn) || btn == '.') {
        saveNumber(btn);
    } else {
        switch(btn) {
            case '+':
            case '-':
            case '*':
            case '/':
                handleBinaryOperator(btn);
                break;
            case '+-':
            case '%':
                handleUnaryOperator(btn);
                break;
            case '=':
                equals();
                break;
            case 'AC':
                reset();
                break;
            case 'del':
                deleteInput();
                break;
        }
    }
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

window.addEventListener('keydown', keyboardInput);

const output = document.querySelector('#output p');
const exprDisplay = document.querySelector('#expression p');

const buttons = document.querySelectorAll('button');
buttons.forEach(button => button.addEventListener('click', selectFunction));
buttons.forEach(button => button.addEventListener('transitionend', removeStyle));


