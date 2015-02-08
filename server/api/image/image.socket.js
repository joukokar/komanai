/**
 * Broadcast updates to client when the model changes
 */

'use strict';
var _ = require('lodash');
var moment = require('moment');
var config = require('../../config/environment');

var fs = require('fs');
var Image = require('./image.model');

var images = [];

// parse name and return {lat:, lng:}
function parseImageName(name) {
  var lat, lng;

  var parts = name.match(/(\d+)_(\d+)_(\d+).*/);
  //console.log(name, parts);
  lat = parseInt(parts[1])/10000000;
  lng = parseInt(parts[2])/10000000;

  // TODO: capture timestamp
  var thedate = parts[3].toString();
  console.log(typeof thedate);
  var year   = parseInt(thedate.slice(0,4));
  var month  = parseInt(thedate.slice(4,6));
  var day    = parseInt(thedate.slice(6,8));
  var hour   = parseInt(thedate.slice(8,10));
  var minute = parseInt(thedate.slice(10,12));
  var second = parseInt(thedate.slice(12,14));

  var time = moment().year(year).month(month).day(day).hour(hour).minute(minute).second(second);
  return {
    lat: lat,
    lng: lng,
    time: time.valueOf(),
    filename: name,
    rating: 0
  }
}

console.log("aa");
exports.register = function(socket) {
  Image.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Image.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });

  socket.on("image:rate", function(post) {
    console.log("GOT", post);
    for(var i=0; i<images.length; i++) {
      if(images[i].filename === post.filename) {
        images[i].rating = post.rating;
      }
    }
  });

  setInterval(function() {
    var files = getFiles(config.root + "/client/assets/images/captures");
    for(var i=0; i<files.length; i++) {
      var existing = _.select(images, function(f) {  return f.filename == files[i]; });
      if(existing.length === 0) {
        var obj = parseImageName(files[i]);
        images.push(obj);
      }
    }
    socket.emit("image:list", images);
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

