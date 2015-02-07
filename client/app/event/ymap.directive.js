'use strict';

angular.module('komanaiApp')
  .directive("ymap", function(unity) {
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

        ymap.drawMap(new Y.LatLng(35.712711, 139.804622), 17, Y.LayerSetId.NORMAL);

        var mapdata = [
          [1,2,3,4,2,4,2,1,3,2,0,0,2,5,4,2,3,4,2],
          [1,2,3,4,2,4,1,1,2,0,0,4,2,3,4,2,3,4,2],
          [1,2,3,4,2,2,2,2,0,0,5,4,2,3,4,2,3,4,2],
          [1,2,3,4,2,2,2,0,0,5,5,4,2,3,4,2,3,4,2],
          [1,2,3,4,2,2,2,0,3,2,1,4,2,3,4,2,3,4,2],
          [1,2,3,4,2,2,2,1,3,2,1,4,2,3,4,2,3,4,2],
          [1,2,3,4,2,2,2,1,3,2,1,4,2,3,4,2,3,4,2],
        ];

        var colors = ["ffffff", "0000ff", "4444bb", "884488", "ff8800", "ff0000"];


        //between these
        //35.709261, 139.791673
        //35.717903, 139.815319
        scope.latToY = function(lat) {
          var val = (lat - 35.709261) / (35.717903 - 35.709261) * 5.65;
          console.log("lat", val);
          return val;
        }
        scope.lngToX = function(lng) {
          var val = (lng - 139.791673) / (139.815319 - 139.791673 * 13.65);
          console.log("lng", val);
          return val;
        }
        var centerLat = 35.712711;
        var centerLng = 139.804622;
        for(var y=0; y<mapdata.length; y++) {
          for(var x=0; x<mapdata[y].length; x++) {
            if(mapdata[y][x] != 0) {
              var strokeStyle = new Y.Style(colors[mapdata[y][x]], null, 0.0);
              var fillStyle   = new Y.Style(colors[mapdata[y][x]], null, 0.2);
              var circle = new Y.Circle(new Y.LatLng(centerLat-y/1000+0.003, centerLng+x/1000-0.01), new Y.Size(0.05, 0.05), {
                  unit:"km",
                  strokeStyle: strokeStyle,
                  fillStyle: fillStyle
              });
              circle.bind('click', function(latlng){
                  console.log(latlng, this);
                  unity.moveToPosition(scope.latToY(this.latlng.Lat), scope.lngToX(this.latlng.Lon))
              });
              ymap.addFeature(circle);
            }
          }
        }

        ymap.bind('click', function(latlng){
            console.log(latlng.toString());
        });
      }
    }
  });

