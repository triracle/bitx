var bigint = require("big-integer")
var math = require("./my-math.js")
const p = bigint("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F", 16)
const a = bigint("0000000000000000000000000000000000000000000000000000000000000000", 16)
const b = bigint("0000000000000000000000000000000000000000000000000000000000000007", 16)
const G = {x: bigint("79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798", 16), y: bigint("483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8", 16)}
const n = bigint("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141", 16)
const base = bigint("FFFFFFFFFAAAAAAAAAAAAFFFFFFFFFFFFFFFAAAAAAAAAAAFFFFFFFFFFAAA", 16)
const max256 = bigint(1).shiftLeft(256)


const add = (P, Q, a, b, p) => {
	if (P.x.equals(Q.x) && P.y.equals(Q.y)) return doublePoint(P, a, b, p);
	var lamda = Q.y.subtract(P.y).multiply(math.Inverse(Q.x.subtract(P.x), p)).mod(p)
	lamda = lamda.add(p).mod(p)
	var res = {x:bigint(0), y:bigint(0)}
	res.x = (lamda.multiply(lamda).subtract(P.x).subtract(Q.x)).mod(p)
	res.y = (lamda.multiply(P.x.subtract(res.x)).subtract(P.y)).mod(p)
	res.x = math.Absmod(res.x, p)
	res.y = math.Absmod(res.y, p)
	return res
}

const doublePoint = (P, a, b, p) => {
	var res = {x: bigint(0), y:bigint(0)}
	var lamda = P.x.multiply(P.x).multiply(3).add(a).multiply(math.Inverse(P.y.multiply(2), p)).mod(p)
	res.x = lamda.multiply(lamda).subtract(P.x.multiply(2)).mod(p)
	res.y = (lamda.multiply(P.x.subtract(res.x)).subtract(P.y)).mod(p)
	res.x = math.Absmod(res.x, p)
	res.y = math.Absmod(res.y, p)
	return res
}

const mul = (P, k, a, b, p) => {
	res = {x:0, y:0}
	var first = true
	while (k>0) {
		if (k.and(1) == 1) {
			if (first) {
				res = {x: bigint(P.x), y: bigint(P.y)}
				first = false
			}
			else res = add(res, P, a, b, p)	
		}
		P = doublePoint(P, a, b , p)
		k = k.shiftRight(1)
	}
	return res
}



function GenSeed() {
	return math.RandInt(256, p)
}


function GenPrivateKey(seed, id) {
	var pk = seed.mod(n)
	for(var i=0; i<id; i++) {
		pk = pk.multiply(base).mod(n)
		if (pk <2) i--;
	}
	return pk;
}

function GetPubKey(privatekey) {
	return mul(G, privatekey, a, b, p)
}

const sign = (m, privatekey) => {
	while (true) {
		var k  = math.RandIntRange(256, bigint(2), n)
		console.log(k.toString())
		var Q = mul(G, k, a, b ,p)
		var r = Q.x.mod(n);
		if (r.equals(0)) continue;
		var inverK = math.Inverse(k, n)
		var s = inverK.multiply(privatekey.multiply(r).add(m)).mod(n)
		if (s.equals(0)) continue;
		else return {r: math.Absmod(r, n), s:math.Absmod(s, n)}
	}
}

function inRange(x, l, r) {
	return (x.compare(l) != -1 && x.compare(r) != 1)
}

const verify = (m, signature, publickey) => {
	var s = signature.s
	var r = signature.r
	if (!inRange(s, 2, n-1) || !inRange(r, 2, n-1)) return false;
	var w = math.Inverse(s, n)
	var u1 = m.multiply(w).mod(n)
	var u2 = r.multiply(w).mod(n)
	var X = add(mul(G, u1, a, b, p), mul(publickey, u2, a, b, p), a, b, p)
	var v = X.x.mod(n)
	console.log("v: " + v.toString())
	console.log("r: " + r.toString())
	return (v==r)
}


module.exports = {
	sign: sign,
	verify: verify,
	genSeed: GenSeed,
	genPrivateKey: GenPrivateKey,
	getPublicKey: GetPubKey
}
