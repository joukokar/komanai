'use strict';

angular.module('komanaiApp')
  .directive("ymap", function(unity, socket) {
    return {
      restrict: "A",
      link: function (scope, elem, attrs) {
        var ymap = new Y.Map("map", {
           configure : {
             doubleClickZoom : false,
             scrollWheelZoom : false,
             singleClickPan : false,
             dragging : false
           }
         });
        scope.ymap = ymap;
        scope.markers = [];

        ymap.drawMap(new Y.LatLng(35.712711, 139.804622), 16, Y.LayerSetId.NORMAL);

        /*var mapdata = [
          //
          [1,2,3,4,2,2,0,1,3,2,1,4,2,3,4,2,3,4,2],
          [1,2,3,4,2,2,2,1,3,2,1,4,2,3,4,2,3,4,2],
          [1,2,3,4,0,0,1,2,3,2,1,4,2,3,4,2,3,4,2],
          [1,2,3,4,2,0,0,2,2,5,5,4,2,3,4,2,3,4,2],
          [1,2,3,4,2,2,0,2,4,4,5,4,2,3,4,2,3,4,2],
          [1,2,3,4,2,4,0,0,4,4,4,4,2,3,4,2,3,4,2],
          [1,2,3,4,2,4,2,0,0,2,4,4,2,5,4,2,3,4,2],
        ];*/

        var COLORS = ["eeeeee", "0000ff", "4444bb", "884488", "ff8800", "ff0000"];


        //between these
        var maxLat = 35.716422;
        var minLat = 35.706634;
        var maxLng = 139.817080;
        var minLng = 139.793944

        var latScale = maxLat - minLat;
        var lngScale = maxLng - minLng;

        scope.latToZ = function(lat) {
          var val = 11.5 - ((lat - minLat) / latScale * 11.5);
          console.log("z", val);
          return val;
        }
        scope.lngToX = function(lng) {
          var val = 20.35 - ((lng - minLng) / lngScale * 20.35);
          console.log("x", val);
          return val;
        }
        scope.ZToLat = function(z) {
          //var val = (latScale*z + minLat*11.5)/11.5
          var val = minLat - x*latScale+11.5*latScale;
          //var val = 11.5 - ((lat - minLat) / latScale * 11.5);
          console.log("z", val);
          return val;
        }
        scope.XToLng = function(x) {
          //var val = 20.35 - ((lng - minLng) / lngScale * 20.35);
          //console.log("EH", lng, lngScale, minLng);
          var val = minLng - x*lngScale+20.35*lngScale;
          console.log("x", minLng, val);
          return val;
        }

        //console.log(scope.latToZ(minLat), scope.ZToLat(scope.latToZ(minLat)));
        //console.log(scope.latToZ(maxLat), scope.ZToLat(scope.latToZ(maxLat)));
        //console.log(scope.lngToX(minLng), scope.XToLng(scope.lngToX(minLng)));
        /*scope.UpdateMarker = function(msg) {
          console.log("got ", msg);
          var matches = msg.match(/([^,]+),([^,]+),([^,]+)/);
          if(matches) {
            var x = parseFloat(matches[1]),
                y = parseFloat(matches[2]),
                z = parseFloat(matches[3]);
            scope.ymap.removeFeature(scope.nowMarker);

            scope.nowMarker = new Y.Marker(new Y.LatLng(scope.ZToLat(z), scope.XToLng(x)));
            ymap.addFeature(scope.nowMarker);
          }
        }

        window.UpdateMarker = scope.UpdateMarker.bind(this);*/

        var centerLat = minLat + latScale/2;
        var centerLng = minLng + lngScale/2;

        /*scope.nowMarker = new Y.Marker(new Y.LatLng(centerLat, centerLng));
        ymap.addFeature(scope.nowMarker);

        for(var y=0; y<mapdata.length; y++) {
          for(var x=0; x<mapdata[y].length; x++) {
            if(mapdata[y][x] != 0) {
              var strokeStyle = new Y.Style(COLORS[mapdata[y][x]], null, 0.0);
              var fillStyle   = new Y.Style(COLORS[mapdata[y][x]], null, 0.2);
              var circle = new Y.Circle(
                new Y.LatLng(minLat+(y*(latScale/mapdata.length)), minLng+(x*(lngScale/mapdata[y].length))),
                new Y.Size(0.1, 0.1),
                {
                  unit:"km",
                  strokeStyle: strokeStyle,
                  fillStyle: fillStyle
              });
              circle.bind('click', function(latlng){
                  console.log(latlng, this);
                  console.log(this.latlng.Lat, this.latlng.Lon);
                  unity.moveToPosition(scope.lngToX(this.latlng.Lon), 1, scope.latToZ(this.latlng.Lat))
              });
              ymap.addFeature(circle);
            }
          }
        }*/


        function getExistingMarker(img) {
          var matchingMarkers = _.select(scope.markers, function(m) {
            return img.filename == m.filename
          });
          if(matchingMarkers.length > 0)
            return matchingMarkers[0];
          else
            return null;
        }

        function addMarker(name, location) {
            var marker = new Y.Marker(new Y.LatLng(location.lat, location.lng));
            location.name = name;
            location.marker = marker;
            scope.markers.push(location)
            scope.ymap.addFeature(marker);

            marker.bind("click", function() {
              console.log("clicked", location.name);
              unity.showingImage = scope.images.indexOf(location.name)
            });

        }

        socket.socket.on('image:list', function(res) {
          var img;
          console.log("GOT", res);
          scope.images = res;
          for(var i=0; i<scope.images.length; i++) {
            img = scope.images[i];

            var existing = getExistingMarker(img);
            // add only if does not exist already
            if(existing && existing.rating != img.rating) {
              ymap.removeFeature(existing.obj);
              scope.markers.splice(scope.markers.indexOf(existing),1);
              existing = null;
            }
            if(!existing) {
              var strokeStyle = new Y.Style(COLORS[img.rating], null, 0.2);
              var fillStyle   = new Y.Style(COLORS[img.rating], null, 0.2);
              var circle = new Y.Circle(
                new Y.LatLng(img.lat, img.lng),
                new Y.Size(0.1, 0.1),
                {
                  unit:"km",
                  strokeStyle: strokeStyle,
                  fillStyle: fillStyle
              });
              circle.bind('click', function(latlng){
                  console.log(latlng, this);
                  console.log(this.latlng.Lat, this.latlng.Lon);
                  unity.moveToPosition(scope.lngToX(this.latlng.Lon), 1, scope.latToZ(this.latlng.Lat))
              });
              ymap.addFeature(circle);
              var marker = {
                obj: circle,
                filename: img.filename,
                rating: img.rating
              };
              scope.markers.push(marker);

            }
          }
        });

        ymap.bind('click', function(latlng){
            console.log(latlng.toString());
        });
      }
    }
  });

