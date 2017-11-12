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

	app.put('/weather/cities/:city', (req, res) => {
		const newValue = req.body;
		const id = req.params.city;
		const measurments = _
			.chain(weatherData.cities)
			.find(id)
			.values()
			.head()
			.value();
		const dates = _.map(measurments, measurment => {
			return _.keys(measurment)[0];
		});

		console.log(`New object key: ${_.keys(newValue)[0]}`);
		console.log(`Dates: ${dates}`);
		console.log(`ID: ${id}`);
		console.log(`New object in db: ${!_.includes(dates, _.keys(newValue)[0])}`);

		if (!newValue) {
			return res.send({"status": "error", "message": "missing parameters"});
		} else {
			if (!_.includes(dates, _.keys(newValue)[0])) {
				return res.send({"status": "info", "message": "data updated"});
			} else {
				return res.send({"status": "error", "message": "duplicated data", "detailed": "date " + _.keys(newValue)[0] + " already exists in db"});
			}
		}
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
				return res.send({"status": "info", "message": "data added"});
			} else {
				return res.send({"status": "error", "message": "duplicated data", "detailed": "city " + _.capitalize(newCity) + " already exists in db"});
			}
		}
	});
};