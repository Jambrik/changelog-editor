var fs = require('fs-extra');
var uuidv1 = require('uuid/v1')

exports.getNext = function(){
    let id = uuidv1(); 
    return id;
}