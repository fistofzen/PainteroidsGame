sap.ui.define(
  [
    "com/pai/ocn/painter/controller/BaseController",
    "../model/models",
    "sap/ui/model/json/JSONModel",
    "com/pai/ocn/painter/control/Drawings",
    "../libs/socket",
  ],
  function (Controller, models, JSONModel, Drawings, socket) {
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
        let random = Math.floor(Math.random() * 11);

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
              this.getModel().setData(oResult.value[0]);
              that.startTimer(oResult.value[0]);
            }.bind(this)
          )
          .fail(function () {
            MessageBox.error(oBundle.getText("datarequestfailed"), {
              onClose: function (action) {
                if (action !== MessageBox.Action.CLOSE) {
                  //do nothing
                }
              }.bind(this),
            });
          });
      },
      onSendDoddle: function () {
        var that = this;

        let random = Math.floor(Math.random() * 11);
        const oBundle = this.getView().getModel("i18n").getResourceBundle();

        const image = $(
          "#container-painter---idAppControl--drawonme"
        )[0].toDataURL("image/png");

        var oNewLocation = {
          lines: this.getModel().getProperty("/Lines"),
          categories_Catid: 22,
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
                      //you can get the categories

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
                                  that.getModel().setData(oResult.value[0]);

                                  if (interval > 0) clearInterval(interval);

                                  that.startTimer(oResult.value[0]);
                                  that.getView().byId("drawonme").eraseCanvas();
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

      onPlayMusic: function () {
        if (audio) {
          audio.pause();
        }
        var button = this.getView().byId("soundButton");
        audio = new Audio("../webapp/resources/sound/Our-Mountain_v003.mp3");
        audio.play();
      },
      onNewDoddle: function () {
        let that = this;
        let random = Math.floor(Math.random() * 11);
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

              that.startTimer(oResult.value[0]);
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
        interval = setInterval(function () {
          minutes = parseInt(timer / 60, 10);
          seconds = parseInt(timer % 60, 10);

          minutes = minutes < 10 ? "0" + minutes : minutes;
          seconds = seconds < 10 ? "0" + seconds : seconds;

          $("#buttons span")[0].textContent = minutes + ":" + seconds;

          if (--timer < 0) {
            timer = oResult.Duration;
          }
        }, 1000);
      },
    });
  }
);
