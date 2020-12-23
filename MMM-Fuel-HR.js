/* global Module */

/* Magic Mirror
 * Module: MMM-Fuel-HR
 *
 * By Lolo
 * MIT Licensed.
 */

Module.register("MMM-Fuel-HR", {
    defaults: {
        fuelType: 1, 
        radius: 5, 
        showLogo: false,
        showIcon: false, 
        initialLoadDelay: 4250,
        updateInterval: 2 * 60 * 60 * 1000,
        fade: false,
        fadePoint: 0.2,  
		showAddress:false,
    },

    start: function () {
        console.log("Starting module: " + this.name);
        requiresVersion: "2.1.0";
        this.scheduleUpdate();

 
        var self = this;
    },
    getStyles: function () {
        return ["font-awesome.css", 'MMM-Fuel-HR.css'];
    },

    getTranslations: function () {
        return {
            en: "translations/en.json",
            hr: "translations/hr.json"
        };
    },
    getInfo: function () {

        this.sendSocketNotification('GET_FUEL_DATA', this.config);

    },

    getDom: function () {
        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";

        if (!this.loaded) {
            wrapper.innerHTML = "Awaiting data...";
            return wrapper;
        }
 
		
		if (this.loaded) {
            var header = document.createElement("header");
			
			if (this.config.fuelType === 1){
				header.innerHTML = this.translate("PRICE_LIST")+ "  "+this.translate("PETROL");
			}
			if (this.config.fuelType === 2){
				header.innerHTML = this.translate("PRICE_LIST")+ "  "+this.translate("DIESEL");
			}
			if (this.config.fuelType === 3){
				header.innerHTML = this.translate("PRICE_LIST")+ "  "+this.translate("CAR_GAS");
			}		
			if (this.config.fuelType === 4){
				header.innerHTML = this.translate("PRICE_LIST")+ "  "+this.translate("GAS_OIL");
			}			
            wrapper.appendChild(header);
        }

        var table = document.createElement('table');
        table.classList.add("xsmall", "bright");

        var startFade = this.listUpdate.length * this.config.fadePoint;
        var fadeSteps = this.listUpdate.length - startFade;
        var currentFadeStep = 0;

        var j = Object.keys(this.listUpdate);
        if (j.length > 0) {
            for (j = 0; j < this.listUpdate.length; j++) {

                var mainTr = document.createElement('tr');

                if (this.config.fade) {
                    if (j >= startFade) {
                        currentFadeStep = j - startFade;
                    }
                }
                mainTr.style.opacity = 1 - (1 / fadeSteps) * currentFadeStep;
                //console.log(j,mainTr.style.opacity);
                if (this.config.showLogo) {

                    var logoTd = document.createElement('td');

                    var a = document.createElement('a');

                    var image = document.createElement("img");
                    image.className = "image";
                    image.src = this.listUpdate[j].logo;

                    a.appendChild(image);
                    logoTd.appendChild(a);
                    mainTr.appendChild(logoTd);

                } else {
                    if (this.config.showIcon) {
                        var logoTd = document.createElement('td');

                        var icon = document.createElement("i");
                        icon.classList = "fas fa-gas-pump fa-lg"; 
                        logoTd.appendChild(icon);
                        
						mainTr.appendChild(logoTd);
                    }
                }

                var dataTd = document.createElement('td');
                dataTd.className = "dataTd";
                
                var stationName = document.createElement('tr');
                stationName.innerHTML = this.listUpdate[j].name;
				dataTd.appendChild(stationName);

                if (this.config.showAddress) { 
                var address = document.createElement('tr');
                address.className = 'address';
                address.innerHTML = this.listUpdate[j].street;
                dataTd.appendChild(address);
                }
				
                var details = document.createElement('tr');
                details.className = 'details';
                details.innerHTML = this.translate("OPEN") + " " +this.translate("FROM")+ " " + this.listUpdate[j].fromTime + " " +this.translate("TO")+ " " + this.listUpdate[j].toTime;

                dataTd.appendChild(details);
                mainTr.appendChild(dataTd);
                
				var distanceTd = document.createElement('td');
                distanceTd.innerHTML = this.listUpdate[j].proximity;				
				distanceTd.className= 'distanceTd';
				mainTr.appendChild(distanceTd);
				
                var fuelpriceTd = document.createElement('td');
                fuelpriceTd.className = "fuelpriceTd";

                var i = Object.keys(this.listUpdate[j].fuelList);
                if (i.length > 0) {
                    for (i = 0; i < this.listUpdate[j].fuelList.length; i++) {
                        var fuelpriceTr = document.createElement('tr');
                        fuelpriceTr.innerHTML = this.listUpdate[j].fuelList[i] + " " + this.listUpdate[j].priceList[i] + " kn/L";
                        fuelpriceTd.appendChild(fuelpriceTr);
                        mainTr.appendChild(fuelpriceTd);
                        mainTr.appendChild(fuelpriceTd);
                    }
                }
                table.appendChild(mainTr);
            }
        }
        wrapper.appendChild(table);
        return wrapper;
    }, // <-- closes the getDom function from above

    scheduleUpdate: function () {
        setInterval(() => {
            this.getInfo();
        }, this.config.updateInterval);
        this.getInfo(this.config.initialLoadDelay);
        var self = this;
    },

    socketNotificationReceived: function (notification, payload) {
 
		if (notification === "GAS_STATION_LIST") {
            this.listUpdate = payload;
            this.updateDom(this.config.initialLoadDelay);
            this.loaded = true;
            //console.log(this.listUpdate);
        }
        this.updateDom(this.config.initialLoadDelay);
    },

});
