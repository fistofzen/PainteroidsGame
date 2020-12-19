sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/m/library",
	"sap/ui/core/Fragment"
], function(BaseController, JSONModel, formatter, mobileLibrary,Fragment) {
	"use strict";

	// shortcut for sap.m.URLHelper
	var URLHelper = mobileLibrary.URLHelper;

	function _calculateOrderTotal (fPreviousTotal, oCurrentContext) {
		var fItemTotal = oCurrentContext.getObject().Quantity * oCurrentContext.getObject().UnitPrice;
		return fPreviousTotal + fItemTotal;
	}
	return BaseController.extend("sap.ui.demo.orderbrowser.controller.Detail", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit : function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			this._aValidKeys = ["shipping", "processor"];
			var oViewModel = new JSONModel({
				busy : false,
				delay : 0,
				lineItemListTitle : this.getResourceBundle().getText("detailLineItemTableHeading"),
				// Set fixed currency on view model (as the OData service does not provide a currency).
				currency : "EUR",
				// the sum of all items of this order
				totalOrderAmount: 0,
				selectedTab: ""
			});

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

			this.setModel(oViewModel, "detailView");

			this._onMetadataLoaded.bind(this);
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onSendEmailPress : function () {
			var oViewModel = this.getModel("detailView");

			URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},


		/**
		 * Updates the item count within the line item table's header
		 * @param {object} oEvent an event containing the total number of items in the list
		 * @private
		 */
		onListUpdateFinished : function (oEvent) {
			var sTitle,
				fOrderTotal = 0,
				iTotalItems = oEvent.getParameter("total"),
				oViewModel = this.getModel("detailView"),
				oItemsBinding = oEvent.getSource().getBinding("items"),
				aItemsContext;

			// only update the counter if the length is final
			if (oItemsBinding.isLengthFinal()) {
				if (iTotalItems) {
					sTitle = this.getResourceBundle().getText("detailLineItemTableHeadingCount", [iTotalItems]);
				} else {
					//Display 'Line Items' instead of 'Line items (0)'
					sTitle = this.getResourceBundle().getText("detailLineItemTableHeading");
				}
				oViewModel.setProperty("/lineItemListTitle", sTitle);

				aItemsContext = oItemsBinding.getContexts();
				fOrderTotal = aItemsContext.reduce(_calculateOrderTotal, 0);
				oViewModel.setProperty("/totalOrderAmount", fOrderTotal);
			}

		},

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		/**
		 * Binds the view to the object path and expands the aggregated line items.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched : function (oEvent) {
			var oArguments = oEvent.getParameter("arguments");
			this._sObjectId = oArguments.objectId;
			// Don't show two columns when in full screen mode
			if (this.getModel("appView").getProperty("/layout") !== "MidColumnFullScreen") {
				this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			}
			 
			 
			this._bindView(this._sObjectId);
		 
 
		},

		/**
		 * Binds the view to the object path. Makes sure that detail view displays
		 * a busy indicator while data for the corresponding element binding is loaded.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound to the view.
		 * @private
		 */
		_bindView : function (sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getModel("detailView");
			var that = this;
			var results = [];
			let item = "";
			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);

            this.getView().byId("thumbnails").removeAllContent();



                      $.ajax({
                        type: "GET",
                        url: "/paint/" +  "Drawings("+sObjectPath+")" + "/content",

                        contentType: "image/png",
                      })
                        .done(
                          function (oResult) {
                            // var blob = new Blob([oResult], {type: 'image/png'});
                            // var url = URL.createObjectURL(blob);
                 
                            const thumbnails = that
                              .getView()
                              .byId("thumbnails");
                            thumbnails.addContent(
                              new sap.m.Image({
                                src: oResult,
                                width: "100%",
                                height: "auto",
                                alt: "test image",

                                decorative: true,
                                success: function () {},
                                error: function () {
                                  this.setSrc("ERROR IMAGE PATH");
                                },
                              })
                            );





					$.ajax({
                        type: "GET",
                        url: "/paint/" +  "Drawings("+sObjectPath+")?$expand=categories"
                     })
                        .done(
                          function (oResult) {
							  let a = {
								  id : oResult.categories.Catid,
								  name : oResult.categories.Name,
													Selected:false


							  }
							  item = oResult.categories.Name;
							  results.push(a);

							  
								$.get(
										"/paint/Categories?$filter=Language eq 'TR'&$top=3"
									)
										 .done(
											function (oResult) {
												oResult.value.forEach(element => {
																									let a = {
													id : element.Catid,
													name : element.Name,
													Selected:false

												}
												results.push(a);
												});
																				
										var model = new sap.ui.model.json.JSONModel();
										model.setData({
										modelData: {
										riskData : results
										}
										});

									 	
	 										var oRdg1 = this.getView().byId("rd1").setModel(model);

										 this.getView().byId("rd1").removeAllItems();
								 		
										for (var i = 0; i < results.length; i++) {
											var txt = results[i].name;
											var oSegmentButtonItem =  new sap.m.Button({text : txt,
											
											press: function(oEvent) {
											 
												that.myFunction(item,this.getText());
												}

											});
											oSegmentButtonItem.addStyleClass("myplaymusicbutton");
											this.getView().byId("rd1").addItem(oSegmentButtonItem);
										}

										var clickedItems =  this.getView().getModel("main").getData().ClickedItems;


											}.bind(this)
								).fail(function () {});

                          }.bind(this)
                        )
                        .fail(function () {});






                          }.bind(this)
                        )
                        .fail(function () {});
                 
 
		},
		myFunction : function(a,b) {
			
			var that = this;

			var right = b;
			var answer = a;
			var userName = this.getView().getModel("main").Name;
			

			var oNewLocation = {
				gameId:this._sObjectId,
				guidid:this._sObjectId,
		 
				username: userName,
				answer:answer,
				right1:right
	 
			  };
	  
			 
			  var oBinding = this.getModel().bindList("/Guesses");
	  
			  oBinding.attachCreateCompleted(
				function (oEvent) { 
				  //not success
				  if (!oEvent.getParameter("success")) {
					 
				  } else {
					
					if(a === b) {
						that.openEndGameDialog();
							this.getView().getModel("main").getData().ClickedItems.forEach(element => {
							document.getElementById(element).className = "mydidbutton";
						});
					}

				  }
				}.bind(this)
			  );
	  
			  oBinding.create(oNewLocation);


			//save to
		},

		openEndGameDialog : function() {
  
			var oView = this.getView();  
			// create dialog lazily
			if (!this.pDialog) {
			  this.pDialog = Fragment.load({
				id: oView.getId(),
				name: "sap.ui.demo.orderbrowser.view.fragments.GameEndDialog",
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
		  this.byId("endDialog").close();
 
		},

		_onBindingChange : function () {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				// if object could not be found, the selection in the master list
				// does not make sense anymore.
				this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return;
			}

			var sPath = oElementBinding.getPath(),
				oResourceBundle = this.getResourceBundle(),
				oObject = oView.getModel().getObject(sPath),
				sObjectId = oObject.OrderID,
				sObjectName = oObject.OrderID,
				oViewModel = this.getModel("detailView");

			this.getOwnerComponent().oListSelector.selectAListItem(sPath);

			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href, oObject.ShipName, oObject.EmployeeID, oObject.CustomerID]));
		},

		_onMetadataLoaded : function () {
			// Store original busy indicator delay for the detail view
			var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
				oViewModel = this.getModel("detailView"),
				oLineItemTable = this.byId("lineItemsList"),
				iOriginalLineItemTableBusyDelay = oLineItemTable.getBusyIndicatorDelay();

			// Make sure busy indicator is displayed immediately when
			// detail view is displayed for the first time
			oViewModel.setProperty("/delay", 0);
			oViewModel.setProperty("/lineItemTableDelay", 0);

			oLineItemTable.attachEventOnce("updateFinished", function() {
				// Restore original busy indicator delay for line item table
				oViewModel.setProperty("/lineItemTableDelay", iOriginalLineItemTableBusyDelay);
			});

			// Binding the view will set it to not busy - so the view is always busy if it is not bound
			oViewModel.setProperty("/busy", true);
			// Restore original busy indicator delay for the detail view
			oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
		},
		onTabSelect : function(oEvent){
			var sSelectedTab = oEvent.getParameter("selectedKey");
			this.getRouter().navTo("object", {
				objectId: this._sObjectId,
				query: {
					tab: sSelectedTab
				}
			}, true);// true without history

		},

		_onHandleTelephonePress : function (oEvent){
			var sNumber = oEvent.getSource().getText();
			URLHelper.triggerTel(sNumber);
		},

		/**
		 * Set the full screen mode to false and navigate to master page
		 */
		onCloseDetailPress: function () {
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
			// No item should be selected on master after detail page is closed
			this.getOwnerComponent().oListSelector.clearMasterListSelection();
			this.getRouter().navTo("master");
		},

		/**
		 * Toggle between full and non full screen mode.
		 */
		toggleFullScreen: function () {
			var bFullScreen = this.getModel("appView").getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", !bFullScreen);
			if (!bFullScreen) {
				// store current layout and go full screen
				this.getModel("appView").setProperty("/previousLayout", this.getModel("appView").getProperty("/layout"));
				this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
			} else {
				// reset to previous layout
				this.getModel("appView").setProperty("/layout",  this.getModel("appView").getProperty("/previousLayout"));
			}

		}

	});
});