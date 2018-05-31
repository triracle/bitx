'use strict'

// constructor
const Block = (scope, cb) => {
  this.scope = scope;
  return cb && cb(null, this);
}

Block.prototype.create = () => {
  
}

module.exports = Block;

