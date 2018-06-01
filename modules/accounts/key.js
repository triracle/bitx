const bigint = require("big-integer")
var secp256k1 = require("./secp256k1.js")
var math = require("./my-math.js")


// Test

var t = secp256k1.genSeed()
var privatekey = secp256k1.genPrivateKey(t, 0)
console.log("privatekey = " + privatekey.toString())
var publickey = secp256k1.getPublicKey(privatekey)
//console.log("publickey: \n s = " + publickey.s.toString() + "\n r = " + publickey.r.toString())
var wtf = bigint("1212312123")
var si = secp256k1.sign(wtf, privatekey)
console.log(si)
var x = 1 

secp256k1.verify(wtf, si, publickey)

