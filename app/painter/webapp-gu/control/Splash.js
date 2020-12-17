sap.ui.define(
  ["sap/ui/core/Control","sap/ui/core/Icon","sap/m/Button"],
  function (Control,Icon,Button) {
    return Control.extend("com.pai.ocn.painter.control.Splash", {
 

      metadata: {
        properties: {
          type: { type: "string" , defaultValue: ""},
          enabled: { type: 'boolean', defaultValue: true },
          value: { type: 'string', defaultValue: "",bindable: true }
        },
        aggregations: {
          _playgame: { type: "sap.m.Button", multiple: false },
          _ef: { type: 'sap.m.Input', multiple: false  }


        },
        events: {
          hideSplash: {}
        }
      },
      setValue: function (sValue) {
        this.ef.setValue(sValue);
      },
     
      setEnabled: function (bValue) {
        this.ef.setEnabled(bValue);
      },
      
      getValue: function(){
        return this.ef.getProperty("value");
      },
 
      
      getEnabled: function(){
        return this.ef.getProperty("enabled");
      },
      init: function () {
 
        this.ef = new sap.m.Input({
          width: '90%',
          value:"{main>/Name}"
        });
       
        this.setAggregation('_ef', this.ef);


        this.setAggregation("_playgame", new Button({
          text: "{i18n>playGame}",
          press: function () {
            this.fireHideSplash();
          }.bind(this)
        }).addStyleClass("mystartbutton2"));


      },
      renderer: {
        apiVersion: 2,
        render: function (oRm, oControl) {



          oRm.openStart("div");
          oRm.attr("id", "splashScreen");
          oRm.class("splash");
          oRm.openEnd();
          


          //add another div for image
          oRm.openStart("div");
          oRm.class("splashview-hero");
          oRm.openEnd();
 
          oRm.close("div");

          //close another div for image
          oRm.openStart("div");
          oRm.class("buttoncontainer");
      
          oRm.openEnd();

            oRm.openStart("div");
            oRm.class("button");
            oRm.openEnd();
 
            oRm.renderControl(oControl.getAggregation('_ef'));


            oRm.renderControl(oControl.getAggregation("_playgame"));
                
 
            
         
          
            oRm.close("div");
         
          oRm.close("div");
          oRm.close("div");
 
        }
      }
    });
  }
);
