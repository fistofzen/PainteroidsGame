sap.ui.define(
    ["sap/ui/core/Control","sap/m/Button"],
    function (Control,Button) {
      return Control.extend("com.pai.ocn.painter.control.Header", {
        metadata: {
          properties: {
            type: { type: "string" }
          },
          aggregations: {
            _newDoddle: { type: "sap.m.Button", multiple: false },
            _sendDoddle: { type: "sap.m.Button", multiple: false },
            _eraseCanvas: { type: "sap.m.Button", multiple: false },
            _playMusic: { type: "sap.m.Button", multiple: false }

          },
          events: {
            newDoddle: {},
            sendDoddle: {},
            eraseCanvas: {},
            playMusic: {},
          }
        },
        init: function () {

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


          this.setAggregation("_playMusic", new Button({
            icon: "sap-icon://sound-loud",
            id:"soundButton",
            press: function () {
              this.firePlayMusic();
            }.bind(this)
          }).addStyleClass("myplaymusicbutton"));


        },
        renderer: {
          apiVersion: 2,
          render: function (oRm, oControl) {
  
  
            oRm.openStart("div");
            oRm.class("top-nav");
            oRm.openEnd();
            

                
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
                  oRm.openStart("p");
                  oRm.class("rightp");
                  oRm.openEnd();
                  oRm.renderControl(oControl.getAggregation("_newDoddle"));
                  oRm.close("p");

                  //playmusic
                  oRm.openStart("p");
                  oRm.class("leftp");
                  oRm.openEnd();
                  oRm.renderControl(oControl.getAggregation("_playMusic"));
                  oRm.close("p");



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
  