const { odd, even } = require('./var.js')

console.log(odd)
console.log(even)

function checkOddOrEven(num) {
    if (num % 2) {
        return odd;
    }
    return even;
}

module.exports = checkOddOrEven