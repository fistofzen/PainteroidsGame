sap.ui.define(
  ["sap/ui/model/json/JSONModel", "sap/ui/Device"],
  function (JSONModel, Device) {
    "use strict";

    return {
      createDeviceModel: function () {
        var oModel = new JSONModel(Device);
        oModel.setDefaultBindingMode("OneWay");
        return oModel;
      },
      createMainModel: function () {
		var oData = {
			Name: '',
      editing: true,
      ClickedItems:[]
		  };
		  var oModel = new JSONModel(oData);
		  oModel.setDefaultBindingMode("TwoWay");
        return oModel;
      },
    };
  }
);
