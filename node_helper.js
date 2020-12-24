/* Magic Mirror
 * Node Helper: MMM-Fuel-HR
 *
 * By Lolo
 *.
 */

const NodeHelper = require('node_helper');
const puppeteer = require("puppeteer");
const cheerio = require('cheerio');
const url = 'https://mzoe-gor.hr/#main-nav-open';
var self;
module.exports = NodeHelper.create({

    start: function () {
        self = this; 
        self.browser;
	console.log("Starting node_helper for: " + this.name);
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === 'GET_FUEL_DATA') {
            self.config = payload;
            getFuelData();

        }
    },
});

async function getFuelData() {
    try {
        if(self.config.chromiumBrowserPath != null){
		self.browser = await puppeteer.launch({executablePath: self.config.chromiumBrowserPath,  headless : !self.config.showChromiumBrowser }); // headless : false
	}else{
		self.browser = await puppeteer.launch({ headless : !self.config.showChromiumBrowser}); // headless : false
	}
        const page = await self.browser.newPage();
        await page.goto(url);

        await page.waitForSelector('input[id="react-select-2-input"]', {
            visible: true
        });
        await page.type('input[id="react-select-2-input"]', self.config.place, {
            delay: 10
        });
		//await page.waitForTimeout(1000);// for testing
        await page.keyboard.press('Enter');
        await page.select('#trazivrstagoriva', self.config.fuelType.toString());
		//await page.waitForTimeout(1000); //for testing
        await page.select('#traziradius', self.config.radius.toString());
        	//await page.waitForTimeout(1000); //for testing
        const html = await page.content();
        const $ = cheerio.load(html)

            var gasStationList = [];

        $("article.postaja").each(function (index, element) {
            const $element = $(element);

            var idName = $element.find('a[class="postaja-link"]>h3').text();
            var name = $element.find('img').attr('alt');
            var logo_old = $element.find('img').attr('src');
            var logo = "https:" + encodeURI(logo_old);
            var proximity = $element.find('li.postaja-proximity').text();
            var street = $element.find('address.postaja-lokacija > ul > li:nth-child(1)').text();
            var fromTime = $element.find('dl.postaja-rv > dd:nth-child(2) > time:nth-child(1)').text();
            var toTime = $element.find('dl.postaja-rv > dd:nth-child(2) > time:nth-child(2)').text();

            const fuelList = [];
            $element.find('h6.cijena ').each((j, fuelItem) => {
                $fuelItem = $(fuelItem);
                fuelList.push($fuelItem.text());
            });

            const priceList = [];
            var price = [];
            $element.find('span.bold-cijena').each((j, priceItem) => {
                $priceItem = $(priceItem);
                priceList.push($priceItem.text());
            });

            var list = {
                idName,
                name,
                logo,
                proximity,
                street,
                fromTime,
                toTime,
                fuelList,
                priceList
            };
            gasStationList.push(list);

        });
       
		//console.log("this is Gas Station list:", gasStationList);
        self.sendSocketNotification('GAS_STATION_LIST', gasStationList);
        
		await self.browser.close();
    } catch (error) {
        console.error('getFuelData(): ' + error);

    }
};
