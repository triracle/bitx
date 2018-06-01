const bigint = require("big-integer")
var secp256k1 = require("./secp256k1.js")
var math = require("./my-math.js")
var converter = require("./converter.js")
var sha3 = require("js-sha3")
function genSeed() {
	return math.RandInt(256, secp256k1.p)
}

const genPrivateKey = (seed, id)  => {
	var pk = seed.mod(n)
	for(var i=0; i<id; i++) {
		pk = pk.multiply(base).mod(n)
		if (pk <2) i--;
	}
	return pk;
}


const getPublicKey = (privatekey) => {
	return secp256k1.getPublicKey(privatekey)
}



function getAddr (compressedPubkey) {
	var bytes = converter.BigintToBytes(compressedPubkey)
	var addr = sha3.keccak256(bytes)
	addr = addr.substr(addr.length - 40, 40)
	return addr
}

const sign = (m, privatekey) => {
	return secp256k1.sign(m, privatekey)
}

const verify = (m, sign, publickey) => {
	return secp256k1.verify(m, sign, publickey)
}

const getAddrFromPublicKey = (publickey) => {
	var t = publickey.x.shiftLeft(256).add(publickey.y)
	return getAddr(t)
}

const getAddrFromPrivateKey = (privatekey) => {
	var publickey = getPublicKey(privatekey)
	return getAddrFromPublicKey(publickey)
}

module.exports = {
	GenSeed: genSeed,
	GetPublicKey: getPublicKey,
	GenPrivateKey: genPrivateKey,
	getAddrFromPublicKey: getAddrFromPublicKey,
	getAddrFromPrivateKey: getAddrFromPrivateKey,
	sign: sign,
	verify: verify
}
