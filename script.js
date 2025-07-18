const display = document.getElementById("display");
display.value = '0';

let firstNumber = null;
let secondNumber = null;
let operator = null;
let waitingforoperand = false;
let JustCalculated = false;

function Add(first, second)
{
    return first + second;
}

function Subtract(first, second)
{
    return first - second;
}

function Multiply(first, second)
{
    return first * second;
}

function Divide(first, second)
{
    if(second === 0)
    {
        return "Cannot divide by zero";
    }

    return first / second;
}

function Operate(oper, first, second)
{
    switch(oper)
    {
        case "+":
            return Add(first, second);
        case "-":
            return Subtract(first, second);
        case "*":
            return Multiply(first, second);
        case "/":
            return Divide(first, second);
        default:
            return null;
    }
}

function updateDisplay(value)
{
    display.value = value;
}

function calculate()
{
    if(firstNumber===null || operator===null || waitingforoperand)
    {
        return;
    }

    secondNumber = parseFloat(display.value);
    let result = Operate(operator, firstNumber, secondNumber);

    if(typeof result === "string")
    {
        updateDisplay(result);
        firstNumber = null;
        secondNumber = null;
        operator = null;
    }
    else
    {
        updateDisplay(result);
        firstNumber = result;
        secondNumber = null;
        operator = null;
    }

    waitingforoperand = true;
    JustCalculated = true;

    document.querySelectorAll(".operator").forEach(button => {
        button.classList.remove("active");
    });
}

function inputNumber(num)
{
    if(JustCalculated)
    {
        updateDisplay(num);
        JustCalculated = false;
        firstNumber = null;
        secondNumber = null;
        operator = null;
        waitingforoperand = false;
    }
    else if(waitingforoperand)
    {
        updateDisplay(num);
        waitingforoperand = false;
    }
    else
    {
        let currentDisplay = display.value;
        currentDisplay ==='0'?updateDisplay(num):updateDisplay(currentDisplay + num);
    }
}

function setOperator(op)
{
    if(firstNumber === null)
    {
        firstNumber = parseFloat(display.value);
        
    }
    else if(secondNumber === null && !waitingforoperand)
    {
        secondNumber = parseFloat(display.value);
        let result = Operate(operator, firstNumber, secondNumber);

        if(typeof result === "string")
        {
            updateDisplay(result);
            firstNumber = null;
            secondNumber = null;
            waitingforoperand = true;
            return;
        }
        // Round the result to 8 decimal places
        const roundedResult = Math.round(result * 100000000) / 100000000;
        updateDisplay(roundedResult.toString());
        firstNumber = roundedResult;
    }

    operator = op;
    waitingforoperand = true;
    JustCalculated = false;

    document.querySelectorAll(".operator").forEach(button => {
        button.classList.remove("active");
    });

    document.querySelector(`[data-operator="${op}"]`).classList.add('active');
}

function clearCalculator()
{
    firstNumber = null;
    secondNumber = null;
    operator = null;
    waitingforoperand = false;
    JustCalculated = false;
    updateDisplay('0');

    document.querySelectorAll(".operator").forEach(button => {
        button.classList.remove("active");
    });
}

function backspace()
{
    if(JustCalculated)
    {
        clearCalculator();
        return;
    }

    let currentDisplay = display.value;
    if(currentDisplay.length > 1)
    {
        updateDisplay(currentDisplay.slice(0, -1));
    }
    else
    {
        updateDisplay('0');
    }
}

function inputDecimal()
{
    let currentDisplay = display.value;
    if(waitingforoperand)
    {
        updateDisplay('0.');
        waitingforoperand = false;
        return;
    }

    if(JustCalculated)
    {
        updateDisplay('0.');
        JustCalculated = false;
        firstNumber = null;
        operator = null;
    }

    if(!currentDisplay.includes('.'))
    {
        updateDisplay(currentDisplay + '.');
    }
}

document.addEventListener("keydown", function(event) {
    if(event.key >= '0' && event.key <= '9')
    {
        inputNumber(event.key);
    }
    else if(event.key === '.')
    {
        inputDecimal();
    }
    else if(event.key === 'Enter' || event.key === '=')
    {
        calculate();
    }
    else if(event.key === 'Backspace')
    {
        backspace();
    }
    else if(['+', '-', '*', '/'].includes(event.key))
    {
        setOperator(event.key);
    }
    else if(event.key === 'Escape' || event.key.toLowerCase() === 'c')
    {
        clearCalculator();
    }
});