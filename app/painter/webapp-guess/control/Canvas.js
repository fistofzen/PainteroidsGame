sap.ui.define(
  ["sap/ui/core/Control","sap/m/Button"],
  function (Control) {

    var socket, canvas, ctx, rect,
    brush = {
        x: 0,
        y: 0,
        color: '#000000',
        size: 10,
        down: false,
    },
    strokes = [],
    currentStroke = null;


    return Control.extend("com.pai.ocn.painter.control.Canvas", {
      metadata: {
        properties: {
          type: { type: "string" }
        }
      },

      renderer: {
        apiVersion: 2,
        render: function (oRm, oControl) {

 
  
          oRm.openStart("canvas", oControl);
          oRm.attr("id","paint");
          oRm.class("canvas");
          oRm.openEnd();

   

          oRm.close("canvas");

     
          
        }
      },
      onAfterRendering : function(arguments) {
        canvas = $('#container-painter---idAppControl--drawonme');
      
      canvas.attr({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    ctx = canvas[0].getContext('2d');
    ///////this.draw();
    },
    jump : function(e){
      strokes = [];
      this.paint();

      //here lets erase the canvas and show thumbnails




    },
    eraseCanvas : function(e){
      strokes = [];
      this.paint();

    },
     

    
    ontouchstart: function(e) {
   
    },
    ontouchmove:  function(e) {
      if (brush.down){
   
        brush.x = e.pageX - rect.left;
        brush.y = e.pageY - rect.top;
  
          currentStroke.points.push({
              x: brush.x,
              y: brush.y,
          });
          console.log("x:" +e.pageX + " y:" + e.pageY)
          this.paint();
      }
    },
    ontouchend: function(e) {
      
    },
    ontouchcancel: function(e) {
       
    },
    onsapselect:  function(e) {
       
    },
    onmouseup:  function(e) {
      brush.down = false;

      brush.x = e.pageX - rect.left;
      brush.y = e.pageY - rect.top;

        currentStroke.points.push({
            x: brush.x,
            y: brush.y,
        });
        console.log("x:" +e.pageX + " y:" + e.pageY)
        this.paint();

        this.getModel().setProperty("/Lines",JSON.stringify(strokes));

       
     
      currentStroke = null;
    },
    onmouseover: function(e){

      
    },
    onmousedown:  function(e) {
      rect = canvas[0].getBoundingClientRect();
      brush.down = true;
      currentStroke = {
        color: brush.color,
        size: brush.size,
        points: [],
      };

      strokes.push(currentStroke);


      brush.x = e.pageX - rect.left;
      brush.y = e.pageY - rect.top;

        currentStroke.points.push({
            x: brush.x,
            y: brush.y,
        });
        console.log("x:" +e.pageX + " y:" + e.pageY)
        this.paint();

    },
    
    draw : function() {
 
      if (ctx) {
        var ctx1 = ctx
    

        var json = JSON.parse('{"word":"The Eiffel Tower","countrycode":"EE","timestamp":"2017-03-27 15:08:31.95427 UTC","recognized":true,"key_id":"6616116459732992","drawing":[[[671,667,664,669,675,680,678,673,670],[86,91,96,97,97,97,92,88,86],[1,112,171,264,296,338,512,566,603]],[[662,662],[97,97],[1400,1440]],[[664,659,658,657,656,654,652,650,647,645,644],[98,103,108,113,120,125,131,137,143,149,151],[1561,1928,1960,1976,1999,2016,2032,2051,2065,2080,2093]],[[684,682,682,682,682,682,682,683,684,685,685,686,687],[99,105,110,115,120,126,132,138,145,151,158,163,165],[2457,2616,2632,2647,2666,2679,2696,2712,2728,2744,2760,2776,2787]],[[641,654,662,670,679,686,692,695],[160,160,160,161,162,163,164,164],[3113,3194,3208,3224,3244,3255,3272,3294]],[[636,636,636,635,634,632,630,628,627,623,621,619,617,615,612,610,608,606,604,603,601,600,599,597,597],[160,165,170,175,182,189,198,203,208,217,222,227,232,237,243,248,254,260,265,271,276,281,286,294,294],[3680,3744,3760,3776,3793,3808,3824,3835,3840,3855,3863,3872,3880,3888,3896,3903,3911,3920,3927,3936,3945,3952,3959,3976,3979]],[[686,690,690,690,691,692,692,694,695,696,697,698,698,699,700,700],[165,177,182,189,196,208,215,232,241,246,256,265,270,278,287,289],[4496,4593,4605,4615,4632,4656,4672,4708,4723,4728,4749,4765,4768,4785,4808,4821]],[[599,605,611,619,627,632,642,648,660,667,681,688,701,707,717,717],[293,294,294,294,295,295,295,295,297,297,299,300,301,301,302,302],[5330,5359,5382,5392,5408,5415,5432,5440,5457,5464,5481,5487,5506,5511,5531,5534]],[[600,594,583,578,573,570,569,567,566,564,562,560,557,555,553,550,547,544,542,540,539,538,537,542,548,555,566,571,576,579,580,582,583,586,589,594,600,605,610,620,626,633,639,654,659,665,672,678,684,689,694,697,697,697,697,696,696,696,701,706,711,718,723,728,733,734,732,730,729,729,729,730,730,729,729,728,727,727,727,726,726,726],[293,292,294,295,295,300,305,311,317,323,330,335,342,347,353,361,369,377,382,388,393,398,403,405,406,407,411,412,413,407,402,397,392,387,382,380,378,377,376,375,374,374,374,375,375,375,375,375,375,375,375,380,385,390,396,402,407,412,415,416,416,416,416,417,417,412,407,401,395,389,382,377,372,367,361,356,351,346,341,335,330,323],[6096,6206,6330,6420,6463,6567,6592,6615,6640,6664,6689,6710,6734,6744,6760,6784,6809,6834,6849,6864,6881,6911,6936,7060,7098,7132,7179,7214,7255,7343,7376,7410,7439,7472,7519,7552,7576,7592,7608,7634,7648,7664,7682,7720,7736,7752,7767,7784,7801,7815,7851,7944,7978,8002,8024,8048,8072,8112,8192,8215,8239,8264,8280,8295,8312,8426,8456,8480,8504,8528,8553,8568,8584,8599,8623,8639,8656,8671,8687,8711,8736,8768]]]}');
        
        var a = json.drawing;
        a.forEach(function(entry, i) {
             x = entry[0];
             y = entry[1];

             x.forEach(function(entry1,j) {
              x1 = entry1;
              y1 = y[j];

              var rectangle = new Path2D();
              rectangle.rect(x1, y1, 1, 1);
          
          
              ctx1.stroke(rectangle);
              
            });

        });
  
  
      }
    },

    paint :  function() {
     
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
  }
  

    });
  }
);
