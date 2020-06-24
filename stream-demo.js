'use strict'

var fs = require('fs')

// 从文件流读取文本内容
// data事件表示流的数据已经可以读取了，end事件表示这个流已经到末尾了，没有数据可以读取了，error事件表示出错了。
// 注意，data事件可能会有多次，每次传递的chunk是流的一部分数据
let rs = fs.createReadStream('index.html', 'utf-8')

rs.on('data', chunk => {
    console.log('DATA: ')
    console.log(chunk)
})

rs.on('end', () => console.log('END'))

rs.on('error', err => console.log('ERROR: ' + err))

// 以流的形式写入文件
let ws1 = fs.createWriteStream('output2.txt', 'utf-8')
ws1.write('使用 Stream 写入文本数据...\n')
ws1.write('END.')
ws1.end()

let ws2 = fs.createWriteStream('output3.txt')
ws2.write(new Buffer('使用 Stream 写入二进制数据...\n', 'utf-8'))
ws2.write(new Buffer('END.', 'utf-8'))
ws2.end()

// pipe
// 所有可以读取数据的流都继承自stream.Readable，所有可以写入的流都继承自stream.Writable
// 一个Readable流和一个Writable流串起来后，所有的数据自动从Readable流进入Writable流，这种操作叫pipe
let rStream = fs.createReadStream('output.txt')
let wStream = fs.createWriteStream('output4.txt')
rStream.pipe(wStream)