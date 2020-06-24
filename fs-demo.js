'use strict'

// 由于Node环境执行的JavaScript代码是服务器端代码，所以，绝大部分需要在服务器运行期反复执行业务逻辑的代码，
// 必须使用异步代码，否则，同步代码在执行时期，服务器将停止响应，因为JavaScript只有一个执行线程。
// 服务器启动时如果需要读取配置文件，或者结束时需要写入到状态文件时，可以使用同步代码，
// 因为这些代码只在启动和结束时执行一次，不影响服务器正常运行时的异步执行。

var fs = require('fs')

// 异步读取文本文件
fs.readFile('hello.js', 'utf-8', function (err, data) {
    // 正常读取 err 为 null，异常读取 data 为 undefined
    if (err) {
        console.log(err)
    } else {
        console.log(data)
    }
})
// 异步读取二进制文件（不传入文件编码，回调函数的 data 参数返回一个 Buffer 对象，一个包含零个或任意个字节的数组（和Array不同）
fs.readFile('luffy.jpg', function (err, data) {
    if (err) {
        console.log(err)
    } else {
        console.log(data)
        console.log(data.length + ' bytes')
    }
})
// Buffer 对象可以和 String 对象互相转换
let text = 'hello text'
// string -> buffer
let str_2_buf = Buffer.from(text, 'utf8')  // utf-8
console.log(str_2_buf)  // Buffer(10) [104, 101, 108, 108, 111, 32, 116, 101, …]
// buffer -> string
var buf_2_str = str_2_buf.toString('utf-8')
console.log(buf_2_str)


// 同步读取文本文件
try {
    const data = fs.readFileSync('hello.js', 'utf-8')
    console.log(data)
} catch (err) {
    // 出错了
}


// 异步写文件
let data = 'Hello, Node.js'
// 参数依次为文件名、数据、回调函数，如果传入的数据是String，默认按UTF-8编码写入文件，如果传入的参数是Buffer，则写入的是二进制文件
fs.writeFile('output.txt', data, function (err) {
    if (err) {
        console.log(err)
    } else {
        console.log('output.txt write sucessfully')
    }
})
// 同步写文件
let data1 = 'Hello, VScode'
try {
    fs.writeFileSync('output1.txt', data1)
} catch (err) {
    console.log(err)
}


// 获取文件信息
let filePath = 'luffy.jpg'
fs.exists(filePath, function (exists) {
    if (exists) {
        fs.stat(filePath, function (err, stat) {
            if (err) {
                console.log(err)
            } else {
                console.log('isFile: ' + stat.isFile())
                console.log('isDerectory: ' + stat.isDirectory())
                if (stat.isFile()) {
                    console.log('size: ' + stat.size)
                    console.log('birth time ' + stat.birthtime)
                    console.log('modified time ' + stat.mtime)
                }
            }
        })
    } else {
        console.log(filePath + ' is not exists')
    }
})