var bigint = require("big-integer")

function RandBit() {
	return Math.floor(Math.random() * 2)
}	

const RandInt = (bits, mod) => {
	var res = bigint(0)
	for(var i=0; i<bits; i++) {
		var x = RandBit()
		res = res.shiftLeft(1).or(x).mod(mod)
	}
	return res
}

const RandIntRange = (bits, min, max) => {
	return RandInt(bits, max.subtract(min)).add(min)
}

function Inverse(x, p) {
	return x.modPow(p.subtract(2), p)
}
function Absmod(x, p) {
	return x.mod(p).add(p).mod(p);
}

const inRange = (x, l, r) => {
	return (x.compare(l) != -1 && x.compare(r) != 1)
}

module.exports = {
	RandInt: RandInt,
	RandIntRange: RandIntRange,
	Inverse: Inverse,
	Absmod: Absmod,
	InRange: inRange,
}
