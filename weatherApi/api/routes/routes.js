module.exports = (app) => {
	const data = require('../source/max_daily_temperatures.json');
	app.use((req, res, next) => {
		res.header("Access-Control-Allow-Origin", "http://localhost:3000");
		next();
	});
	
	app.get('/weather/cities', (req, res) => {
		return res.send(data);
	});
			
	app.get('/weather/cities/:city', (req, res) => {
		console.log("requested city: " + req.params.city);
		const city = data.cities.filter(o => {
			return  o.hasOwnProperty(req.params.city);
		})[0];
		
		if (city) {
			return res.send(city);
		}
		return res.send({"status": "error", "message": "wrong cityname"});
	});
};