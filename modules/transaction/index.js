// List transactions of block
'use strict'

const utils = require('../../utils')

const Transaction = (data) => {
  data = data || {}
  const fields = [{
    name: 'nonce',
    length: 32,
    allowLess: true,
    default: Buffer.from([])
  }, {
    name: 'gasPrice',
    length: 32,
    allowLess: true,
    default: Buffer.from([])
  }, {
    name: 'gasLimit',
    alias: 'gas',
    length: 32,
    allowLess: true,
    default: Buffer.from([])
  }, {
    name: 'to',
    allowZero: true,
    length: 20,
    default: Buffer.from([])
  }, {
    name: 'value',
    length: 32,
    allowLess: true,
    default: Buffer.from([])
  }, {
    name: 'data',
    alias: 'input',
    allowZero: true,
    default: Buffer.from([])
  }, {
    name: 'v',
    allowZero: true,
    default: Buffer.from([0x1c])
  }, {
    name: 'r',
    length: 32,
    allowZero: true,
    allowLess: true,
    default: Buffer.from([])
  }, {
    name: 's',
    length: 32,
    allowZero: true,
    allowLess: true,
    default: Buffer.from([])
  }]

  utils.defineProperties(this, fields, data)
  console.log(this.serialize())
}

module.exports = Transaction
