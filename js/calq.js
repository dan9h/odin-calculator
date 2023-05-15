(function (d) {
  "use strict";

  const display = d.getElementById("calc-display");
  const digits = d.getElementsByClassName("digit");
  const operators = d.getElementsByClassName("operator");

  const leftOperand = { value: "" };
  const rightOperand = { value: "" };

  let targetOperand = leftOperand;
  let operator = null;
  let result = null;

  for (const digit of digits) {
    digit.value = digit.dataset.value;
    digit.addEventListener("click", handleDigitClick);
  }

  function handleDigitClick(event) {
    const value = event.target.value;

    if (result !== null) {
      result = null;
      targetOperand.value = "";
    }

    if (/\./.test(value)) {
      /* . */
      if (/^0?$/.test(targetOperand.value)) {
        targetOperand.value = "0";
      }
      if (!/\./.test(targetOperand.value)) {
        targetOperand.value += value;
      }
    } else {
      /* 0-9 */
      if (/^0$/.test(targetOperand.value)) {
        targetOperand.value = value;
      } else {
        targetOperand.value += value;
      }
    }

    if (operator === null) {
      display.textContent = targetOperand.value;
    } else {
      display.textContent = `${leftOperand.value} ${operator} ${rightOperand.value}`;
    }
  }

  for (const operator of operators) {
    operator.value = operator.dataset.value;
    operator.addEventListener("click", handleOperatorClick);
  }

  function handleOperatorClick(event) {
    const value = event.target.value;

    switch (value) {
      // DEL
      case "D":
        {
          if (targetOperand === rightOperand) {
            if (targetOperand.value !== "") {
              targetOperand.value = targetOperand.value.slice(0, -1);
              display.textContent = `${leftOperand.value} ${operator} ${targetOperand.value}`;
              return;
            } else {
              targetOperand = leftOperand;
            }
          }

          if (operator !== null) {
            operator = null;
          } else {
            if (targetOperand.value !== "") {
              targetOperand.value = targetOperand.value.slice(0, -1);
            }
          }
          display.textContent = targetOperand.value;
        }
        break;

      // RESET
      case "R":
        {
          leftOperand.value = "";
          rightOperand.value = "";
          operator = null;
          targetOperand = leftOperand;

          display.textContent = targetOperand.value;
        }
        break;

      // EQUALS
      case "=":
        {
          if (operator === null) return;

          result = calculate(+leftOperand.value, operator, +rightOperand.value);

          if (result === "error") {
            leftOperand.value = "";
          } else {
            leftOperand.value = "" + result;
          }

          rightOperand.value = "";
          operator = null;
          targetOperand = leftOperand;

          display.textContent = result;
        }
        break;

      // +-/*
      default:
        {
          if (targetOperand === leftOperand && targetOperand.value === "")
            return;

          if (operator === null) {
            operator = value;
            targetOperand = rightOperand;
          } else {
            if (targetOperand.value !== "") {
              result = calculate(
                +leftOperand.value,
                operator,
                +rightOperand.value
              );

              if (result === "error") {
                leftOperand.value = "";
                rightOperand.value = "";
                operator = null;
                targetOperand = leftOperand;
                display.textContent = result;
                return;
              }

              leftOperand.value = "" + result;
              rightOperand.value = "";
            }
            operator = value;
          }

          display.textContent = `${leftOperand.value} ${operator}`;
        }
        break;
    }
  }

  function calculate(leftOperand, operator, rightOperand) {
    let result = null;

    switch (operator) {
      case "+":
        result = leftOperand + rightOperand;
        break;

      case "-":
        result = leftOperand - rightOperand;
        break;

      case "*":
        result = leftOperand * rightOperand;
        break;

      case "/":
        if (rightOperand === 0) return "error";
        result = leftOperand / rightOperand;
        break;
    }

    return +result.toFixed(10);
  }
})(document);
