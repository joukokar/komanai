/**
 * Broadcast updates to client when the model changes
 */

'use strict';
var config = require('../../config/environment');

var fs = require('fs');
var Image = require('./image.model');

exports.register = function(socket) {
  Image.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Image.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });

  setInterval(function() {
    var files = getFiles(config.root + "/client/assets/images/captures");
    socket.emit("image:list", files);
  }, 1000);
}

function onSave(socket, doc, cb) {
  socket.emit('image:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('image:remove', doc);
}

function getFiles(dir,files_){
    files_ = files_ || [];
    if (typeof files_ === 'undefined') files_=[];
    var files = fs.readdirSync(dir);
    for(var i in files){
        if (!files.hasOwnProperty(i)) continue;
        var name = files[i];
        if(name != ".gitkeep") {
          files_.push(name);
        }
        //var name = dir+'/'+files[i];
        /*if (fs.statSync(name).isDirectory()){
            getFiles(name,files_);
        } else {
            files_.push(name);
        }*/
    }
    return files_;
}

