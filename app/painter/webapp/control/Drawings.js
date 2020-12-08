sap.ui.define(
    ["sap/ui/core/Control","sap/m/Button"],
    function (Control,Button) {


      var socket, canvas, ctx, rect,
      brush = {
          x: 0,
          y: 0,
          color: '#000000',
          size: 10,
          down: false,
      },
      
      currentStroke = null;


      return Control.extend("com.pai.ocn.painter.control.Drawings", {

        
        metadata: {
          properties: {
            type: { type: "string" }
          },
          aggregations: {
            _newDoddle: { type: "sap.m.Button", multiple: false },
            _sendDoddle: { type: "sap.m.Button", multiple: false },
            _eraseCanvas: { type: "sap.m.Button", multiple: false }
          },
          events: {
            newDoddle: {},
            sendDoddle: {},
            eraseCanvas: {}
          }
        },
        init: function (drawings) {

          this.setAggregation("_eraseCanvas", new Button({
            icon: "sap-icon://activate",
            press: function () {
              this.fireEraseCanvas();
            }.bind(this)
          }).addStyleClass("myerasebutton"));

          this.setAggregation("_newDoddle", new Button({
            icon: "sap-icon://request",
            press: function () {
              this.fireNewDoddle();
            }.bind(this)
          }).addStyleClass("myrefreshbutton"));

          this.setAggregation("_sendDoddle", new Button({
            icon: "sap-icon://paper-plane",
            press: function () {
              this.fireSendDoddle();
            }.bind(this)
          }).addStyleClass("mysendbutton"));


        },


        onAfterRendering : function(arguments) {
            // canvas = $('#container-painter---idAppControl--thumbnail');
        
            // canvas.attr({
            //       width: window.innerWidth,
            //       height: window.innerHeight,
            //   });
            // ctx = canvas[0].getContext('2d');
          ///////this.draw();

          alert("2");

          },


        fillCanvasThumbnails : function(callback){
    
          this.paint(callback);


    
        },

        paint :  function(strokes2) {
     
          const strokes=JSON.parse(strokes2);
             canvas = $('#container-painter---idAppControl--thumbnail');
        
             canvas.attr({
                   width: 200,
                   height: 200,
               });
             ctx = canvas[0].getContext('2d');
          ctx.clearRect(0, 0, canvas.width(), canvas.height());
          ctx.lineCap = 'round';
          for (var i = 0; i < strokes.length; i++) {
              var s = strokes[i];
              ctx.strokeStyle = s.color;
              ctx.lineWidth = s.size;
              ctx.beginPath();
              ctx.moveTo(s.points[0].x, s.points[0].y);
              for (var j = 0; j < s.points.length; j++) {
                  var p = s.points[j];
                  ctx.lineTo(p.x, p.y);
              }
              ctx.stroke();
          }
        },

     
          render: function (oRm, oControl) {
  
        
            oRm.openStart("canvas", oControl);
            oRm.attr("id","thumbnail");
            oRm.class("canvas");
            oRm.openEnd();
  
     
  
            oRm.close("canvas");
   
          
        },
        setType: function(sText){
            this.setProperty("type", sText, true);
            $("#doddle").html(sText);
           
        }
      });
    }
  );
  