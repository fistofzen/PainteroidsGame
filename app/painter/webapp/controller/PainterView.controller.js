sap.ui.define(
  [
    "com/pai/ocn/painter/controller/BaseController",
    "../model/models",
    "sap/ui/model/json/JSONModel",
    "com/pai/ocn/painter/control/Drawings",
    "../libs/socket",
    "sap/m/Dialog",
    "sap/m/DialogType",
    "sap/m/Button",
    "sap/m/ButtonType",
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/m/Text",
    "sap/ui/core/Fragment"
  ],
  function (Controller, models, JSONModel, Drawings, socket, Dialog, DialogType, Button, ButtonType, List, StandardListItem, Text,Fragment) {
    "use strict";
    var audio;
    var interval;
    return Controller.extend("com.pai.ocn.painter.controller.PainterView", {
      onInit: function () {
        this.setModel(models.createMainModel());
      },

      onAfterRendering: function () {
        //init();
      },
      onHideSplash: function () {
        let that = this;
        let random = Math.floor(Math.random() * 143);

        const oBundle = this.getView().getModel("i18n").getResourceBundle();

        $.get(
          "/paint/Categories?$filter=Language eq 'TR'&$top=1&$skip=" + random
        )
          .done(
            function (oResult) {
              $("#splashScreen").slideUp();

              oResult.value[0].Name =
                oBundle.getText("requestedDoddle") +
                ": " +
                oResult.value[0].Name;
              this.getModel().setSizeLimit(oResult.length);
              oResult.value[0].rand = that.generateRandom(10);
              this.getModel().setData(oResult.value[0]);
          
              that.startTimer(oResult.value[0]);
            }.bind(this)
          )
          .fail(function () {
          
          });
      },
      onSendDoddle: function () {

        sap.ui.core.BusyIndicator.show();

        
        var that = this;

        let random = Math.floor(Math.random() * 143);
        const oBundle = this.getView().getModel("i18n").getResourceBundle();

        const image = $(
          "#container-painter---idAppControl--drawonme"
        )[0].toDataURL("image/png");

        var oNewLocation = {
          lines: this.getModel().getProperty("/Lines"),
          categories_Catid: this.getModel().getData().Catid,
          gameId: this.getModel().getData().rand,
          mediaType: "image/png",
        };

        var audio = new Audio("../webapp/resources/sound/bell.mp3");
        audio.play();

        var oBinding = this.getModel("backend").bindList("/Drawings");

        oBinding.attachCreateCompleted(
          function (oEvent) { 
            //not success
            if (!oEvent.getParameter("success")) {
              this.showError("Could not create drawing in DB");
            } else {
              //if successflly uploaded than upload the image
              const path = oEvent.mParameters.context.sPath;

              $("#container-painter---idAppControl--drawonme")[0].toBlob(
                (blob) => {
                  const imageBlob = blob;
                  const imageData = $(
                    "#container-painter---idAppControl--drawonme"
                  )[0]
                    .getContext("2d")
                    .createImageData(222, 222).data;
                  $.ajax({
                    url: "/paint" + path + "/content",
                    type: "PUT", //type is any HTTP method
                    data: image, //Data as js object
                    processData: false,
                    success: function () {
                      //you can get the categories, because image is succesfully saved to the HANA DB

                      $.ajax({
                        type: "GET",
                        url: "/paint/" + path + "/content",

                        contentType: "image/png",
                      })
                        .done(
                          function (oResult) {
                            // var blob = new Blob([oResult], {type: 'image/png'});
                            // var url = URL.createObjectURL(blob);
                            that.getView().byId("drawonme").jump();
                            const thumbnails = that
                              .getView()
                              .byId("thumbnails");
                            thumbnails.addContent(
                              new sap.m.Image({
                                src: oResult,
                                width: "20%",
                                height: "auto",
                                alt: "test image",

                                decorative: true,
                                success: function () {},
                                error: function () {
                                  this.setSrc("ERROR IMAGE PATH");
                                },
                              })
                            );

                            $.get(
                              "/paint/Categories?$filter=Language eq 'TR'&$top=1&$skip=" +
                                random
                            )
                              .done(
                                function (oResult) {
                                  oResult.value[0].Name =
                                    oBundle.getText("requestedDoddle") +
                                    ": " +
                                    oResult.value[0].Name;
                                  that.getModel().setSizeLimit(oResult.length);
                                  oResult.value[0].rand =  that.getModel().getData().rand;
                                  that.getModel().setData(oResult.value[0]);

                                  //if (interval > 0) clearInterval(interval);

                                  //that.startTimer(oResult.value[0]);
                                  that.getView().byId("drawonme").eraseCanvas();

                                  sap.ui.core.BusyIndicator.hide();

                                  
                                }.bind(this)
                              )
                              .fail(function () {});
                          }.bind(this)
                        )
                        .fail(function () {});
                    },
                  });
                },
                "image/png"
              );
            }
          }.bind(this)
        );

        oBinding.create(oNewLocation);
      },

      generateRandom: function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
      },
      onEraseCanvas: function () {
        var socket = io("/content-srv", {
          path: "/content-srv/socket.io",
          transports: ["polling"],
          secure: true,
        });

        socket.emit("message", { hello: "world1" });
        socket.on("messageSuccess", function (data) {
          //do stuff here
          alert("2");
        });

        this.getView().byId("drawonme").eraseCanvas();

        var audio = new Audio("../webapp/resources/sound/erase.mp3");
        audio.play();
      },
      onFireRed: function () {
        $("#container-painter---idAppControl--drawonme")[0].getContext("2d").strokeStyle = '#F26968';
        $("#container-painter---idAppControl--drawonme")[0].getContext("2d").fillStyle = '#F26968';
       
      },  
      onFireBlue: function () {
        $("#container-painter---idAppControl--drawonme")[0].getContext("2d").strokeStyle = '#2A93D5';
        $("#container-painter---idAppControl--drawonme")[0].getContext("2d").fillStyle = '#2A93D5';
             },
      onFireBlack: function () {
        $("#container-painter---idAppControl--drawonme")[0].getContext("2d").strokeStyle = '#000000';
        $("#container-painter---idAppControl--drawonme")[0].getContext("2d").fillStyle = '#000000';
             },
      onFireGreen: function () {
        $("#container-painter---idAppControl--drawonme")[0].getContext("2d").strokeStyle = '#6CBF84';
        $("#container-painter---idAppControl--drawonme")[0].getContext("2d").fillStyle = '#6CBF84';
             },
      onFireYellow: function () {
        $("#container-painter---idAppControl--drawonme")[0].getContext("2d").strokeStyle = '#FAF417';
        $("#container-painter---idAppControl--drawonme")[0].getContext("2d").fillStyle = '#FAF417';
             },
      onFireOrange: function () {
        $("#container-painter---idAppControl--drawonme")[0].getContext("2d").strokeStyle = '#FF7E5F';
        $("#container-painter---idAppControl--drawonme")[0].getContext("2d").fillStyle = '#FF7E5F';
             },
      onPlayMusic: function () {
        if (audio) {
          audio.pause();
          audio = null;
        }else{
        var button = this.getView().byId("soundButton");
        audio = new Audio("../webapp/resources/sound/Our-Mountain_v003.mp3");
        audio.play();
      }
      },
      onNewDoddle: function () {
        let that = this;
        let random = Math.floor(Math.random() * 143);
        $("#splashScreen").slideUp();
        const oBundle = this.getView().getModel("i18n").getResourceBundle();

        $.get(
          "/paint/Categories?$filter=Language eq 'TR'&$top=1&$skip=" + random
        )
          .done(
            function (oResult) {
              oResult.value[0].Name =
                oBundle.getText("requestedDoddle") +
                ": " +
                oResult.value[0].Name;
              this.getModel().setSizeLimit(oResult.length);
              this.getModel().setData(oResult.value[0]);

              if (interval > 0) clearInterval(interval);

              //that.startTimer(oResult.value[0]);
              this.getView().byId("drawonme").eraseCanvas();
            }.bind(this)
          )
          .fail(function () {
            MessageBox.error(oBundle.getText("datarequestfailed"), {
              onClose: function (action) {
                if (action !== MessageBox.Action.CLOSE) {
                  //do nothing now
                }
              }.bind(this),
            });
          });
      },

      startTimer: function (oResult) {
        let display = $("#timer");
        var timer = oResult.Duration,
          minutes,
          seconds;
        interval = setInterval( () => {
          minutes = parseInt(timer / 60, 10);
          seconds = parseInt(timer % 60, 10);

          minutes = minutes < 10 ? "0" + minutes : minutes;
          seconds = seconds < 10 ? "0" + seconds : seconds;

          $("#buttons span")[0].textContent = minutes + ":" + seconds;

          if (--timer < 0) {
            clearInterval(interval);
            this.freezeElement();
            // timer = oResult.Duration;
          }
        }, 1000);
      },

      //freeze the screen
      freezeElement: function(){

        this.openEndGameDialog();

      },

      _getDialog : function () {
       
        if (!this._oDialog) {
           this._oDialog = sap.ui.xmlfragment("");
           this.getView().addDependent(this._oDialog);
        }
        return this._oDialog;
     },
      openEndGameDialog : function() {
  
          var oView = this.getView();  
          // create dialog lazily
          if (!this.pDialog) {
            this.pDialog = Fragment.load({
              id: oView.getId(),
              name: "com.pai.ocn.painter.view.fragments.GameEndDialog",
              controller: this
            }).then(function (oDialog) {
              oView.addDependent(oDialog);
              return oDialog;
            });
          }
          this.pDialog.then(function(oDialog) {
            oDialog.open();
          });
      },
      onFinishGame:function () {
        //this.byId("endDialog").close();
     
        let newLinebrk = ["test"];
        this.finishGameOk(newLinebrk);
      },

      finishGameOk: function (oControlEvent) {
 
 
          jQuery.ajax("/content-srv/", {
            method: "HEAD",
            headers: {
              "x-csrf-token": "Fetch"
            },
            success: function (data, status, req) {
              jQuery.ajax("/content-srv/endgame", {
                method: "POST",
                contentType: "application/json",
                headers: {
                  "x-csrf-token": req.getResponseHeader("x-csrf-token")
                },
                data: oControlEvent,
                success: function (data) {
  
                
  
                }.bind(this),
                error: function (xhr, errorText, error) {
               
 
                }.bind(this)
              });
            }.bind(this),
            error: function (xhr, errorText, error) {
              console.error(error);
          
              // how to handle failure when trying to get the current e-mail address? Let user add new entry.
            }.bind(this),
          });
  
      
   
      
     
   
  
      }

      
    });
  }
);
