
const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

let currentInput = "0";
let firstNumber = null;
let operator = null;
let waitingForNumber = false;


function updateDisplay() {
    if (operator !== null && firstNumber !== null) {
        if (waitingForNumber) {
            display.textContent =
                firstNumber + " " + getOperatorSymbol(operator);
        } else {
            display.textContent =
                firstNumber + " " + getOperatorSymbol(operator) +
                " " + currentInput;
        }
    } else {
        display.textContent = currentInput;
    }
}

function chooseOperator(nextOperator) {
    if (currentInput === "Cannot divide by zero") return;

    const inputNumber = parseFloat(currentInput);

    if (operator !== null && !waitingForNumber) {
        const result = calculate(firstNumber, inputNumber, operator);

        if (typeof result === "string") {
            currentInput = result;
            firstNumber = null;
            operator = null;
            waitingForNumber = true;
            updateDisplay();
            return;
        }

        firstNumber = Number(result.toPrecision(12));
        currentInput = String(firstNumber);
    } else if (operator === null) {
        firstNumber = inputNumber;
    }

    operator = nextOperator;
    waitingForNumber = true;
    updateDisplay();
}


function getOperatorSymbol(op) {
    if (op === "*") return "×";
    if (op === "/") return "÷";
    return op;
}

function clearCalculator() {
    currentInput = "0";
    firstNumber = null;
    operator = null;
    waitingForNumber = false;
    updateDisplay();
}

function calculate(a, b, op) {
    if (op === "+") return a + b;
    if (op === "-") return a - b;
    if (op === "*") return a * b;

    if (op === "/") {
        if (b === 0) return "Cannot divide by zero";
        return a / b;
    }

    return b;
}

function enterNumber(number) {
    if (currentInput === "Cannot divide by zero") {
        clearCalculator();
    }

    if (waitingForNumber) {
        currentInput = number === "." ? "0." : number;
        waitingForNumber = false;
    } else if (number === "." && currentInput.includes(".")) {
        return;
    } else if (currentInput === "0" && number !== ".") {
        currentInput = number;
    } else {
        currentInput += number;
    }

    updateDisplay();
}

function chooseOperator(nextOperator) {
    if (currentInput === "Cannot divide by zero") return;

    const inputNumber = parseFloat(currentInput);

    if (operator !== null && !waitingForNumber) {
        const result = calculate(firstNumber, inputNumber, operator);

        if (typeof result === "string") {
            currentInput = result;
            firstNumber = null;
            operator = null;
            waitingForNumber = true;
            updateDisplay();
            return;
        }

        firstNumber = Number(result.toPrecision(12));
        currentInput = String(firstNumber);
    } else if (operator === null) {
        firstNumber = inputNumber;
    }

    operator = nextOperator;
    waitingForNumber = true;
    updateDisplay();
}

function showResult() {
    if (operator === null || waitingForNumber) return;

    const secondNumber = parseFloat(currentInput);
    const result = calculate(firstNumber, secondNumber, operator);

    if (typeof result === "string") {
        currentInput = result;
    } else {
        currentInput = String(Number(result.toPrecision(12)));
    }

    firstNumber = null;
    operator = null;
    waitingForNumber = true;
    updateDisplay();
}

function deleteLast() {
    if (currentInput === "Cannot divide by zero") {
        clearCalculator();
        return;
    }

    if (waitingForNumber) return;

    currentInput = currentInput.length > 1
        ? currentInput.slice(0, -1)
        : "0";

    if (currentInput === "-") currentInput = "0";

    updateDisplay();
}

buttons.forEach(function (button) {
    button.addEventListener("click", function () {
        if (button.dataset.number !== undefined) {
            enterNumber(button.dataset.number);
        } else if (button.dataset.operator) {
            chooseOperator(button.dataset.operator);
        } else if (button.dataset.action === "clear") {
            clearCalculator();
        } else if (button.dataset.action === "delete") {
            deleteLast();
        } else if (button.dataset.action === "equals") {
            showResult();
        }
    });
});
