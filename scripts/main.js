/***********************************************************************************************/
// Global values in use by all functions
let a = '';
let b = '';
let op = '';
let expr = '';

// flag e for checking presence in equals
let equalsFlag;

// saveNumberFlag is used to check if we are in the process of saving a number. This is needed because we can
// delete input only when we are saving a number and not after an operation has been performed or any other stage
let saveNumberFlag;

/***********************************************************************************************/
function outputContent(val) {
  output.textContent = val;
  if (output.textContent === '') {
    output.textContent = +output.textContent;
  }
  // fitText(output);
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
    if (fontSize !== 40) output.style.fontSize = '2.5em';
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

function isOverflown(element) {
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
  // We can delete input only if we are in the process of saving a number
  if (!saveNumberFlag) return;

  a = a.toString();
  b = b.toString();

  if (op === '') {
    // negative index slices from the last, here it slices last 1 character
    a = a.slice(0, -1);
    outputContent(a);
  } else {
    b = b.slice(0, -1);
    outputContent(b);
  }
}

function rounded(val) {
  let exponent;
  if (val.toString().indexOf('e') !== -1) {
    exponent = val.toString().split('e')[1];
    val = val.toString().split('e')[0];
  }
  val = Math.round((+val + Number.EPSILON) * (10 ** 6)) / (10 ** 6);
  if (exponent)
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
  if (b === 0) {
    a = 'Not a Number';
    return;
  }
  a /= b;
}

function toggleSign() {
  if (b === '') {
    if (op === '') {
      a *= -1;
      outputContent(a);
    } else {
      b = -a;
      outputContent(b);
    }
  } else {
    if (e) {
      a *= -1;
      outputContent(a);
    } else {
      b *= -1;
      outputContent(b);
    }
  }
}

function percentage() {
  if (b === '') {
    if (op === '') {
      a /= 100;
      outputContent(a);
    } else {
      b = a / 100;
      outputContent(b);
    }
  } else {
    if (e) {
      a /= 100;
      outputContent(a);
    } else {
      b /= 100;
      outputContent(b);
    }
  }
}

function operateBinary(operator) {
  switch (operator) {
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
  // if (a % 1 || (a !== "Not a Number" && a.toString().indexOf('e') !== -1)) {
  //   return rounded(a);
  // } else {
    return a;
  // }
}

function operateUnary(operator) {
  switch (operator) {
    case '+-':
      toggleSign();
      break;
    case '%':
      percentage();
      break;
  }
}

function handleBinaryOperator(value) {
  // If we just came from =, We are trying to continue the calculation
  // with the previous result, clear value in b and expr to take new values
  if (equalsFlag) {
    b = '';
    expr = '';
    equalsFlag = false;
  }

  let lastOp = op;
  op = value;

  // Don't perform any operation/further operations on NaN
  if (a === 'Not a Number') return;
  if (b === '') {
    // expression starts only after a and the first operator are clicked
    // Since b is still empty, nothing to do other than update expression
    expr = +a + op;
    exprContent(expr);
    return;
  }

  // When b is entered and the next operator is clicked, expr would be of form
  // a op. Now, we have to update it to a op b curr_op for subsequent operations
  expr += +b + op;
  exprContent(expr);

  // operation is always done on the previous op, not the current op
  const result = operateBinary(lastOp);
  outputContent(result);
  // reset b to take in next operand as the result of the operation would be stored in a
  b = '';
}

function handleUnaryOperator(value) {
  // unary operator needs at least one value. No operation can be done on NaN
  if (a === '' || a === 'Not a Number') return;
  operateUnary(value);
}

function equals() {
  if (a === 'Not a Number') return;

  // if only one operand is entered, and no operator has been clicked
  // update the expression, nothing else to do
  if (op === '') {
    expr = +a + '=';
    exprContent(expr);
    return;
  }

  // if operator is entered but no second operand
  // perform the operator on the first value
  if (b === '') {
    b = +a;
  }

  expr = +a + op + +b + '=';
  exprContent(expr);

  const result = operateBinary(op);
  outputContent(result);
}

function saveNumber(value) {
  // If some previous operation resulted in NaN, we need to start everything afresh
  // If we just calculated the result of the expression using =, it needs to be followed
  // by an operator to continue the calculation. If instead, a number is entered, start calculation afresh
  if (a === 'Not a Number' || equalsFlag) {
    reset();
    equalsFlag = false;
  }

  const char = value;
  // If the operator has not been typed yet, then it is the first operand a
  if (op === '') {
    // The first condition is checking if this is a trailing 0, i.e a is empty yet
    // The second condition is checking if a second decimal point is being added
    if ((char === '0' && a === '') || (char === '.' && a.toString().indexOf('.') !== -1)) return;
    // If the number is starting with a decimal, then it has to be 0.something
    if (a === '' && char === '.') a = '0'
    // Add the characters typed to the operand a
    a += char;
    return a;
  } else {
    if ((char === '0' && b === '') || (char === '.' && b.toString().indexOf('.') !== -1)) return;
    if (b === '' && char === '.') b = '0'
    b += char;
    return b;
  }
}

function keyboardInput(e) {
  let button = document.querySelector(`button[value='${e.key}']`);

  if (e.key === 'Enter') {
    e.preventDefault();
    button = document.querySelector('button[value=\'=\']');
  }
  if (!button) return;
  button.click();
}

function playClickSound() {
  const audio = document.querySelector('.mouse-click');
  audio.play();
}

function selectFunction() {
  playClickSound();
  let btn = this.value;

  // Check if it is a number. To check if a string is a number,
  // we need to check if it is not NaN
  if (!isNaN(+btn) || btn === '.') {
    saveNumberFlag = true;
    const num = saveNumber(btn);
    outputContent(num);
  } else {
    // if something else other than number is clicked, it is an operator
    saveNumberFlag = false;
    switch (btn) {
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
        equalsFlag = true;
        equals();
        break;
      case 'AC':
        reset();
        break;
      case 'Backspace':
        deleteInput();
        break;
    }
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Main code starts from here
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Create divs with buttons for numbers and append them to numbers div
const numbersArea = document.querySelector('#numbers-area');
for (let i = 9; i >= 0; i--) {
  const tmpDiv = document.createElement('div');
  tmpDiv.setAttribute('id', i);
  const tmpButton = document.createElement('button');
  tmpButton.classList.add('numberButtons');
  tmpButton.value = i;
  tmpButton.textContent = i;
  tmpDiv.appendChild(tmpButton);
  tmpDiv.style.gridArea = `num-${i}`;
  numbersArea.appendChild(tmpDiv);
}

window.addEventListener('keydown', keyboardInput);

const output = document.querySelector('#output p');
const exprDisplay = document.querySelector('#expression p');

const buttons = document.querySelectorAll('button');
buttons.forEach(button => button.addEventListener('click', selectFunction));


