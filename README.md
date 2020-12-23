# MMM-Fuel-HR

Module for [MagicMirror](https://github.com/MichMich/MagicMirror) that scrapes MagicMirror](https://github.com/MichMich/MagicMirror) scraping [mzoe-gor.hr] (https://mzoe-gor.hr/#main-nav-open) for fuel prices, location and distance of various gas stations in Croatia.
The result is returned as the lowest price in the radius of the selected location. <br />
It is limit to show up to five OPEN stations in range of radius.
## Screenshot
![GitHub Logo](/images/Capture.PNG)
## Installation
Clone this repository into the MagicMirror Modules folder:
```
cd ~/MagicMirror/modules
git clone https://github.com/englolo/MMM-Fuel-HR.git
```
Install the dependencies (puppeteer, cheerio) in the MMM-Radovi_RI module folder:
```
cd ~/MagicMirror/modules/MMM-Fuel-HR
npm install
```
## Configuration


Add the following data to your config.js file
```
{
	module: "MMM-Fuel-HR",
	position: "top_right",            
		place : "Bakar-dio, BAKAR",   //enter the desired place in Croatia!!! check below
                fuelType: 2, //default  1 
	        radius : 10,  // default 5 (km)
		chromiumPath:'',// depending if using puppeteer chromium browser or something else
		
				}		
```
## Config Options


| Option | Default | Description |
|:--|:-:|:--:|
| <code>place:</code>| REQUIRED | Enter your place. Description below.. |
| <code>fuelType:</code>| <code>1,</code>| option: <br />1- PETROL, <br /> 2- DIESEL, <br /> 3- CAR GAS, <br /> 4- GAS OIL|
| <code>radius:</code>|  <code>1,</code> |option: 5,10,15,25,50 km|
| <code>chromiumPath:</code>|  <code>'', </code>| 'chromium-browser'|
| <code>showBrowser:</code>|  <code>false, </code>| false or true|
| <code>showLogo:</code>|  <code>false, </code>| Show the gas stations logo <br />false or true|
| <code>showAddress:</code>|  <code>false, </code>|Show the gas stations addrress <br /> false or true|
| <code>fade:</code>|  <code>false, </code>| false or true|
| <code>showIcon:</code>|  <code>false, </code>|Show the gas stations icon <br /> false or true|
| <code>updateInterval:</code>|  <code>2 * 60 * 60 * 1000,</code>|How often should the data be fetched.<br /> Lower the number only if you wont to know if station is open or close otherwise prices are changed once per week.|
## How to select location  <code>place:</code>
Folow link [mzoe-gor.hr] (https://mzoe-gor.hr/#main-nav-open)<br />
In the search box start typing place of interest till you get only one selector or choose one closest, if your place is not listed.<br />
Now type that selector in the config  <code>place:</code> in the same way as it is.<br /> 
Most important is that you have onlyone selector shown.
It is not importan to write down whole selector but partly mast be match.<br /> 
![GitHub Logo](/images/Capture3.PNG)<br /> 
<code>place:"dubrovnik"</code><br /> 
Unfortunaly web page using react wich i was not able to confront for now.

## Troubleshooting
First sett <code>showBrowser: true,</code> <br /> 
If the browser is not open, there is probably a problem with the path to the browser or browser it is not installed.<br /> 
Sett correctly <code>chromiumPath:</code> <br /> 
 example RPi4 <code>chromiumPath:'chromium-browser',</code> <br />
If the browser pops up, but still does not receiving data, check the entries in the config."# MMM-Fuel-HR" else commit issue.
