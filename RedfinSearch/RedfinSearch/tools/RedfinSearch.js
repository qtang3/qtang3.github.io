// Copyright 2015 ESRI 
// 
// All rights reserved under the copyright laws of the United States 
// and applicable international laws, treaties, and conventions. 
// 
// You may freely redistribute and use this sample code, with or 
// without modification, provided you include the original copyright 
// notice and use restrictions. 
// 
// See the Sample code usage restrictions topic for further information.
//
define([
    "dojo/_base/declare",
    "esriMaps/extensions/tools/_Tool",
    "xstyle/css!./../css/redfin.css"
], function(declare, _Tool) {
    return declare([_Tool], {

        label: "Google",
        iconClass: "esriMapsCommand",       

        _showRedfin: function(zipcode) {
            window.open("http://www.redfin.com/zipcode/" + zipcode, '_blank');
        },

        execute: function() {
            var pt, self = this;
            if (this._graphic) {
                if (this._graphic.attributes) {
                    var attribute = this._graphic.attributes;
                    var zipcode = attribute["Zip"] || attribute["ZipCode"] || attribute["ZIPcode"] || attribute["ZIP"] || attribute["ZIP_Code"];
                    if (zipcode) {
                        this._showRedfin(zipcode);
                    } else {
                        if (this._graphic.geometry) {
                            require(["esri/tasks/locator"], function(Locator) {
								var locator = new Locator("http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");
								locator.locationToAddress(self._graphic.geometry, 100).then(function(address) {
									if (address && address.address && address.address.Postal) {
										self._showRedfin(address.address.Postal);
									}
								}).otherwise(function(){
								alert("no data");
								});                                
                            });
                        }
                    }
                }
            }
        },

        initialize: function(app) {
            var self = this;            
            this.own(this.app.popup.on('selection-change', function() {
                self._graphic = app.popup && app.popup.getSelectedFeature();
				if (self._graphic && self._graphic.geometry && self._graphic.geometry.type === "point") {
					self.set("visible", true);
				} else {
					self.set("visible", false);
				}
            }));
        }
    });
});