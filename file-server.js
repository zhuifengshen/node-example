'use strict'

/*
url 模块用来将一个字符串解析为一个 url 对象
var url = require('url')
console.log(url.parse('http://user:pass@host.com:8080/path/to/file?query=string#hash'))

Url {
    protocol: 'http:',
    slashes: true,
    auth: 'user:pass',
    host: 'host.com:8080',
    port: '8080',
    hostname: 'host.com',
    hash: '#hash',
    search: '?query=string',
    query: 'query=string',
    pathname: '/path/to/file',
    path: '/path/to/file?query=string',
    href: 'http://user:pass@host.com:8080/path/to/file?query=string#hash' }
*/

/*
path 模块可以方便地构造目录
var path = require('path')
//解析当前目录
var workDir = path.resolve('.')
console.log(workDir)  // /Users/zhangchuzhao/Project/js/node/hello
// 组合完整的文件路径：当前目录 + 'pub' + 'index.html'
var filePath = path.join(workDir, 'pub', 'index.html')
console.log(filePath)  // /Users/zhangchuzhao/Project/js/node/hello/pub/index.html
*/

// 静态网站加载发布工具
var fs = require('fs'),
    url = require('url'),
    path = require('path'),
    http = require('http')

console.log(process.argv)  // 命令行参数，第一个是node可执行文件路径，第二个是当前文件路径
var root = path.resolve(process.argv[2] || '.')
console.log('Static root dir: ' + root)

var server = http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname
    var filePath = path.join(root, pathname)
    fs.stat(filePath, function (err, stats) {
        if (!err) {
            if (stats.isDirectory()) {
                var t1 = path.join(filePath, 'index.html')
                if (fs.existsSync(t1)) {
                    filePath = t1
                }
                var t2 = path.join(filePath, 'default.html')
                if (fs.existsSync(t2)) {
                    filePath = t2
                }
            }
            console.log('200 ' + request.url)
            response.writeHead(200)
            fs.createReadStream(filePath).pipe(response)  // response 对象本身是一个 Writable Stream           
        } else {
            console.log('404 ' + request.url)
            response.writeHead(404)
            response.end('404 Not Found')
        }
    })
})

server.listen(9999)
console.log('Server is running at http://127.0.0.1:9999/')