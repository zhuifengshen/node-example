'use strict';

var name = "node.js";

function greet(name) {
    var s = "hello, " + name;
    console.log(s);
}

function hello(name) {
    var s = 'hei, ' + name;
    console.log(s)
}

// module.exports = greet;

module.exports = {
    greet: greet,
    hello: hello
}