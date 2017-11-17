module.exports = (app) => {
	const _ = require('lodash');
	const weatherData = require('../source/max_daily_temperatures.json');
	app.use((req, res, next) => {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		res.header("Access-Control-Allow-Methods", "GET, POST, PUT");
		next();
	});
	
	app.get('/weather/cities', (req, res) => {
		return res.send(weatherData);
	});
			
	app.get('/weather/cities/:city', (req, res) => {
		console.log("requested city: " + req.params.city);
		const city = weatherData.cities.filter(o => {
			return  o.hasOwnProperty(req.params.city);
		})[0];
		
		if (city) {
			return res.send(city);
		}
		return res.send({"status": "error", "message": "wrong cityname"});
	});

	app.post('/weather/cities', (req, res) => {
		const cityData = req.body;
		
		if (!cityData) {
			return res.send({"status": "error", "message": "missing parameters"});
		} else {
			const newCity = _.keys(cityData)[0];
			const cityNames = _.map(weatherData.cities, city => {
				return _.keys(city)[0];
			});

			if (!_.includes(cityNames, newCity)) {
				return res.send({"status": "info", "message": "data updated"});
			} else {
				return res.send({"status": "error", "message": "duplicated data", "detailed": "city " + newCity + " already exists"});
			}
		}
	});
};