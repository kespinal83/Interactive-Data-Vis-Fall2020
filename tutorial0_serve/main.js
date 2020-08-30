function addition(a, b) {
    return a + b;
}

console.log('Here we go muchachos!!!')
console.log('-----')

console.log('addition function:')
console.log(addition)
console.log('-----')

console.log('1 + 2:')
console.log(addition(1, 2))
console.log('-----')

console.log('3 + 4:')
console.log(addition(3, 4))
console.log('-----')

console.log('5 + 6:')
console.log(addition(5, 6))
console.log('-----')

const appendgoal = (string) => string + ' my goals!!!'
const appendall = (string) => string + ' all'

console.log(appendgoal('This class will help me achieve'))
console.log(appendgoal(appendall('This class will help me achieve')))