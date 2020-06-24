'use strict'

// 一、哈希算法 MD5和SHA1 
const crypto = require('crypto')
const hash = crypto.createHash('md5')  // 其他类型 sha1、sha256、sha512
hash.update('Hello, world!Hello, nodejs!')
// 可任意多次调用update()
// hash.update('Hello, world!')
// hash.update('Hello, nodejs!')
console.log(hash.digest('hex'))  // 7e1977739c748beac0c0fd14fd26a544

// 二、哈希算法 Hmac（需要一个密钥，密钥变化，得到的签名也不一样，用随机数“增强”的哈希算法）
const hmac = crypto.createHmac('sha256', 'secret-key')
hmac.update('Hello, world!')
hmac.update('Hello, nodejs!')
console.log(hmac.digest('hex'))

// 三、AES（对称加密算法，加解密都用同一个密钥）
function aesEncrypt(data, key) {
    const cipher = crypto.createCipher('aes192', key)
    var crypted = cipher.update(data, 'utf8', 'hex')
    crypted += cipher.final('hex')
    return crypted
}
function aesDecrypt(encrypted, key) {
    const decipher = crypto.createDecipher('aes192', key)
    var decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
}
var data = 'this is a secret message!'
var key = 'password'
var encrypted = aesEncrypt(data, key)
var decrypted = aesDecrypt(encrypted, key)
console.log('Plain text: ' + data)
console.log('Encrypted text: ' + encrypted)
console.log('Decrypted text: ' + decrypted)
/*
注意到AES有很多不同的算法，如aes192，aes-128-ecb，aes-256-cbc等，AES除了密钥外还可以指定IV（Initial Vector），
不同的系统只要IV不同，用相同的密钥加密相同的数据得到的加密结果也是不同的。加密结果通常有两种表示方法：hex和base64，
这些功能Nodejs全部都支持，但是在应用中要注意，如果加解密双方一方用Nodejs，另一方用Java、PHP等其它语言，需要仔细测试。
如果无法正确解密，要确认双方是否遵循同样的AES算法，字符串密钥和IV是否相同，加密后的数据是否统一为hex或base64格式。
*/

// DH算法（Diffie-Hellman)是一种密钥交换协议，基于数学原理，让双方在不泄露密钥的情况下协商出一个密钥
// 小明的keys
var ming = crypto.createDiffieHellman(512)
var ming_keys = ming.generateKeys()  // 提供给小红
var prime = ming.getPrime()  // 提供给小红
var generator = ming.getGenerator()  // 提供给小红
// 小红的keys
var hong = crypto.createDiffieHellman(prime, generator)
var hong_keys = hong.generateKeys()  // 提供给小明
// 双方计算出密码
var ming_secret = ming.computeSecret(hong_keys)
var hong_secret = hong.computeSecret(ming_keys)
console.log('Secret of xiao ming: ' + ming_secret.toString('hex'))
console.log('Secret of xiao hong: ' + hong_secret.toString('hex'))

/* 
RSA算法是一种非对称加密算法，由一个私钥和一个公钥构成的密码对，可以通过私钥加密公钥解密，或公钥加密私钥解密

在使用Node进行RSA加密前，我们先要准备好私钥和公钥。

首先，在命令行执行以下命令以生成一个RSA密钥对：
openssl genrsa -aes256 -out rsa-key.pem 2048
根据提示输入密码，这个密码是用来加密RSA密钥的，加密方式指定为AES256，生成的RSA的密钥长度是2048位。执行成功后，我们获得了加密的rsa-key.pem文件。

第二步，通过上面的rsa-key.pem加密文件，我们可以导出原始的私钥，命令如下：
openssl rsa -in rsa-key.pem -outform PEM -out rsa-prv.pem
输入第一步的密码，我们获得了解密后的私钥。

类似的，我们用下面的命令导出原始的公钥：
openssl rsa -in rsa-key.pem -outform PEM -pubout -out rsa-pub.pem
这样，我们就准备好了原始私钥文件rsa-prv.pem和原始公钥文件rsa-pub.pem，编码格式均为PEM。
*/
const fs = require('fs')
// 从文件加载 key，key 实际上是用PEM编码的字符串
function loadKey(file) {
    return fs.readFileSync(file, 'utf8')
}
let prvKey = loadKey('./rsa-prv.pem'),
    pubKey = loadKey('./rsa-pub.pem'),
    message = 'Hello, world!'
// 使用私钥加密公钥解密
let enc_by_prv = crypto.privateEncrypt(prvKey, Buffer.from(message, 'utf8'))
console.log('encrypted by private key: ' + enc_by_prv.toString('hex'))
let dec_by_pub = crypto.publicDecrypt(pubKey, enc_by_prv)
console.log('decrypted by publish key: ' + dec_by_pub)
// 使用公钥加密私钥解密
let enc_by_pub = crypto.publicEncrypt(pubKey, Buffer.from(message, 'utf8'))
console.log('enctypted by public key: ' + enc_by_pub.toString('hex'))
let dec_by_prv = crypto.privateDecrypt(prvKey, enc_by_pub)
console.log('decrypted by private key: ' + dec_by_prv)
/*
如果我们把message字符串的长度增加到很长，例如1M，这时，执行RSA加密会得到一个类似这样的错误：data too large for key size，
这是因为RSA加密的原始信息必须小于Key的长度。那如何用RSA加密一个很长的消息呢？实际上，RSA并不适合加密大数据，而是先生成一个随机的AES密码，
用AES加密原始信息，然后用RSA加密AES口令，这样，实际使用RSA时，给对方传的密文分两部分，一部分是AES加密的密文，另一部分是RSA加密的AES口令。
对方用RSA先解密出AES口令，再用AES解密密文，即可获得明文。
*/