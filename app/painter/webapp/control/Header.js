sap.ui.define(
    ["sap/ui/core/Control","sap/m/Button","sap/m/Image"],
    function (Control,Button, Image) {
      return Control.extend("com.pai.ocn.painter.control.Header", {
        metadata: {
          properties: {
            type: { type: "string" }
          },
          aggregations: {
            _newDoddle: { type: "sap.m.Image", multiple: false },
            _sendDoddle: { type: "sap.m.Image", multiple: false },
            _eraseCanvas: { type: "sap.m.Image", multiple: false },
            _playMusic: { type: "sap.m.Image", multiple: false },
            _black: { type: "sap.m.Image", multiple: false },
            _red: { type: "sap.m.Image", multiple: false },
            _green: { type: "sap.m.Image", multiple: false },
            _blue: { type: "sap.m.Image", multiple: false },
            _orange: { type: "sap.m.Image", multiple: false },
            _yellow: { type: "sap.m.Image", multiple: false },



          },
          events: {
            newDoddle: {},
            sendDoddle: {},
            eraseCanvas: {},
            playMusic: {},
            black:{},
            red:{},
            green:{},
            blue:{},
            orange:{},
            yellow:{}

          }
        },
        init: function () {

          this.setAggregation("_eraseCanvas", new Image({
            src: "resources/img/sil.png",
            press: function () {
              this.fireEraseCanvas();
            }.bind(this)
          }).addStyleClass("myerasebutton"));

          this.setAggregation("_newDoddle", new Image({
            src: "resources/img/yeni.png",
            press: function () {
              this.fireNewDoddle();
            }.bind(this)
          }).addStyleClass("myrefreshbutton"));

          this.setAggregation("_sendDoddle", new Image({
            src: "resources/img/tamam.png",
            press: function () {
              this.fireSendDoddle();
            }.bind(this)
          }).addStyleClass("mysendbutton"));


          this.setAggregation("_playMusic", new Image({
            src: "resources/img/ses.png",
            id:"soundButton",
            press: function () {
              this.firePlayMusic();
            }.bind(this)
          }).addStyleClass("myplaymusicbutton"));

          //colors


          this.setAggregation("_black", new Image({
            src: "resources/img/black.png",
            id:"blackButton",
            press: function () {
              this.fireBlack();
            }.bind(this)
          }).addStyleClass("myblackbutton"));

          this.setAggregation("_red", new Image({
            src: "resources/img/red.png",
            id:"redButton",
            press: function () {
              this.fireRed();
            }.bind(this)
          }).addStyleClass("myblackbutton"));


          this.setAggregation("_green", new Image({
            src: "resources/img/green.png",
            id:"greenButton",
            press: function () {
              this.fireGreen();
            }.bind(this)
          }).addStyleClass("myblackbutton"));

          this.setAggregation("_blue", new Image({
            src: "resources/img/blue.png",
            id:"blueButton",
            press: function () {
              this.fireBlue();
            }.bind(this)
          }).addStyleClass("myblackbutton"));

          this.setAggregation("_orange", new Image({
            src: "resources/img/orange.png",
            id:"orangeButton",
            press: function () {
              this.fireOrange();
            }.bind(this)
          }).addStyleClass("myblackbutton"));

          this.setAggregation("_yellow", new Image({
            src: "resources/img/yellow.png",
            id:"yellowButton",
            press: function () {
              this.fireYellow();
            }.bind(this)
          }).addStyleClass("myblackbutton"));



        },
        renderer: {
          apiVersion: 2,
          render: function (oRm, oControl) {
  
  
            oRm.openStart("div");
            oRm.class("top-nav");
            oRm.openEnd();
            

            // oRm.renderControl(oControl.getAggregation("_red"));
            // oRm.renderControl(oControl.getAggregation("_blue"));
            // oRm.renderControl(oControl.getAggregation("_green"));
            // oRm.renderControl(oControl.getAggregation("_orange"));
            // oRm.renderControl(oControl.getAggregation("_yellow"));
                //for the doodle name
                oRm.openStart("div");
                oRm.class("doddle");
                
                oRm.openEnd();
                
                  oRm.openStart("p");
                  oRm.class("leftp");
                  oRm.attr("id", "doddle");
                  oRm.openEnd();
                  oRm.text(oControl.getType());
                  oRm.close("p");


                  //new doddle
                  oRm.openStart("div");
                  oRm.class("column");
                   oRm.openEnd();

                   oRm.openStart("div");
                   oRm.class("row");
                    oRm.openEnd();

                  oRm.renderControl(oControl.getAggregation("_newDoddle"));
                  oRm.renderControl(oControl.getAggregation("_playMusic"));
                  oRm.renderControl(oControl.getAggregation("_black"));
                  oRm.renderControl(oControl.getAggregation("_red"));
                  oRm.renderControl(oControl.getAggregation("_blue"));
                  oRm.renderControl(oControl.getAggregation("_green"));
                  oRm.renderControl(oControl.getAggregation("_orange"));
                  oRm.renderControl(oControl.getAggregation("_yellow"));
                  oRm.close("div");

                  //playmusic
                  // oRm.openStart("p");
                  oRm.class("leftp");
                  // oRm.openEnd();
                  oRm.openStart("div");
                  oRm.class("column");
                   oRm.openEnd();


          
                  oRm.close("div");

                  oRm.close("div");



                oRm.close("div");
                //end of the doodle name

                //for the buttons
                oRm.openStart("div");
                oRm.class("section");
                oRm.attr("id", "buttons");
                oRm.openEnd();

                  oRm.openStart("span");
                  oRm.class("leftp");
                  oRm.attr("id", "timer")
                  oRm.openEnd();
                  oRm.text("00:00");
                  oRm.close("span");


                oRm.close("div");
                //end of the buttons




                //for the timer
                oRm.openStart("div");
                oRm.class("sectionright");
                oRm.attr("id", "timer");
                oRm.openEnd();



                    oRm.openStart("p");
                    oRm.class("rightp");
                    oRm.openEnd();
                    oRm.renderControl(oControl.getAggregation("_sendDoddle"));
                    oRm.close("p");


                    oRm.openStart("p");
                    oRm.class("rightp");
                    oRm.openEnd();
                    oRm.renderControl(oControl.getAggregation("_eraseCanvas"));
                    oRm.close("p");

           




                oRm.close("div");
                //end of the timer

                                


            oRm.close("div");
   
          }
        },
        setType: function(sText){
            this.setProperty("type", sText, true);
            $("#doddle").html(sText);
           
        }
      });
    }
  );
  