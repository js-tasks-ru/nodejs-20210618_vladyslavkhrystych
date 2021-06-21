function sum(a, b) {
  const isNumber = (arg) => typeof arg === "number";

  if (isNumber(a) && isNumber(b)) {
    return a + b;
  } else {
    throw new TypeError("Every function argument should be a number!");
  }
}

module.exports = sum;
