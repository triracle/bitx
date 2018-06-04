const rlp = require('rlp')
const assert = require('assert')

/**
 * Check a string is a hex string
 * @param {String} v input data
 * @return {Boolean}
 */
const isHexString = (v) => {
  if (v.slice(0, 2) == '0x') v = v.slice(2)
  for (let i = 0; i < v.length; i++) {
    if (!((v[i] >= 'a' && v[i] <= 'z') || (v[i] >= '0' && v[i] <= '9'))) {
      return false
    }
  }
  return true
}

/**
 * Check a string is hex prefix
 * example: 0x09ac02
 * @param {String} v input data
 * @return {String}
 */
const isHexPrefix = (v) => {
  if (Buffer.isBuffer(v)) return false
  if (v.length < 2) return false
  return (v.slice(0, 2) === '0x'  ? true : false)
}

/**
 * Get value of hex string
 * example: 0x123 => 123
 * @param {String} v input data
 * @return {String}
 */
const stripHexPrefix = (v) => {
  return isHexPrefix(v) ? v.slice(2) : v
}

/**
 * If a hex string has odd length, make it even by add 0 to the begin of string
 * @param {String} v input data
 * @return {String}
 */
const padToEven = (v) => {
  let a = v
  
  assert(typeof a === 'string', `While padToEven, value must be string, is currently ${typeof a}`)

  if (a.length % 2 != 0) {
    a = `0${a}`
  }

  return a
}

/**
 * Convert from int to hex
 * @param {String} v input data
 * @return {String}
 */
const intToHex = (v) => {
  const hex = v.toString(16)
  return `0x${hex}`
}

/**
 * Convert from int to buffer
 * @param {String} v input data
 * @return {Buffer}
 */
const intToBuffer = (v) => {
  const hex = intToHex(v)
  return Buffer.from(hex.slice(2), 'hex')
}

/**
 * Move 0 from the begining
 * @param {String|Buffer|Array} a
 * @return {String|Buffer|Array}
 */
const trimZero = (v) => {
  v = stripHexPrefix(v)
  for (let i = 0; i < v.length; i++) {
    if (v[i].toString() !== '0') {
      return v.slice(i)
    }
  }
  return v.slice(v.length - 1)
}

/**
 * Attemps to turn a value to Buffer
 * Input can be `Buffer`, `String`, `Number`, null/undefined, BN, Object has
 * toArray() method
 * @param {*} v the value
 * */
const toBuffer = (v) => {
  if (!Buffer.isBuffer(v)) {
    if (Array.isArray(v)) {
      v = Buffer.from(v)
    } else if (typeof v === 'string') {
      if (isHexString(v)) {
	v = Buffer.from(padToEven(stripHexPrefix(v)), 'hex')
      } else {
	v = Buffer.from(v)    
      }
    } else if (typeof v === 'number') {
      v = intToBuffer(v)
    } else if (v === null || v === undefined) {
      v = Buffer.allocUnsafe(0)
    } else if (v.toArray()) {
      v = Buffer.from(v.toArray())
    } else {
      assert(false, 'Invalid type')
    }
    return v
  }
  return v
}

const defineProperties = (self, fields, data) => {
  self._fields = []
  self.raw = []

  self.serialize = () => {
    return rlp.encode(self.raw)
  }

  fields.forEach((field, i) => {
    self._fields.push(field.name)
    const getter = () => {
      return self.raw[i]
    }
    const setter = (v) => {
      v = toBuffer(v)

      if (v.toString('hex') === '00' && !field.allowZero) {
	v = Buffer.allocUnsafe(0)
      }

      if (field.allowLess && field.length) {
	v = trimZero(v)
	assert(field.length >= v.length, `The field ${field.name} must not have more than ${field.length} bytes`)
      }
    }
  })
}

module.exports = {
  defineProperties
}

const v = Buffer.from([0, 1, 2])
console.log(v)
console.log(trimZero(v))
