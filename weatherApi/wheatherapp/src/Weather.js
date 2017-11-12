import React from 'react';
import Chart from './Chart';
import _ from 'lodash';
import './Weather.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

class Weather extends React.Component {
	constructor() {
  	super();
      this.state = {
        cities: [],
        selectedCity: "ostrava"
      };
  }

  /**
   * Fetch REST data from server by GET method
   * @returns {JSON}
   */
  componentDidMount() {
  	fetch(`http://localhost:3001/weather/cities`)
    .then(result => result.json())
    .then(weatherData => {
      if (weatherData) {
        this.setState({
          cities: weatherData.cities
        });
      }
    })
  }

  /**
   * Add new city with measured temperatures using POST method
   * @returns confirmation message
   */
  addNewData(newData) {
    return fetch('http://localhost:3001/weather/cities', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newData)
    })
    .then(result => result.json())
    .then(message => message)
  }

  /**
   * Returns a random integer between min (inclusive) and max (inclusive)
   * @param {number} min 
   * @param {number} max 
   */
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min; 
  }

   /**
   * Process change event on city select element
   * @param {object} e 
   */
  handleClick(e) {
    const value = e.target.value;
    this.setState({selectedCity: value});
  }

  /**
   * Process submit event on new city add button
   * @param {object} e 
   */
  newCityHandler(e) {
    e.preventDefault();
    this.addNewCity(e.target);
  }

  /**
   * Create and add new city data
   * @param {object} target of entry field element
   */
  addNewCity(target) {
    const city = target.newCity.value.toLowerCase();
    const dates = ["19-09-2017", "20-09-2017", "21-09-2017", "22-09-2017", "23-09-2017"];
    
    // creates measured data for new city
    const newCityData = {};
    newCityData[city] = _.map(dates, date => {
      const newMeasurment = {};
      newMeasurment[date] = this.getRandomInt(18, 30);
      return newMeasurment;
    });

    // push data to server
    this.addNewData(newCityData)
      .then(result => {
        // check validation result from server
        if(result.status === "error") {
          alert(`${_.capitalize(result.message)} \n${_.capitalize(result.detailed)}`);
        } else {
          // validates hardcoded data
          const cities = this.state.cities.slice();
          if (_.includes(this.getCityNames(), city)) {
            alert(`Duplicated data \nCity ${city} already exists`);
            return;
          }
          // updates data in memory
          cities.push(newCityData);
          this.setState({
            cities,
            selectedCity: city
          });
          target.newCity.value = "";
        }
      });
  }

  /**
   * Collection of city names
   * @returns {array}
   */
  getCityNames() {
    const cities = this.state.cities;
    const cityNames = _.map(cities, city => {
      return _.keys(city)[0];
    });
    cityNames.push("london"); // added extra city outside the server data
    return cityNames.sort();
  }

  /**
   * Collection of measured dates
   * @param {string} city
   * @returns {array}
   */
  getCityDates(city) {
    const cityMeasurments = this.getCityMeasurments(city);
    return _.map(cityMeasurments, item => {
      return _.keys(item)[0];
    });
  }

  /**
   * Collection of measured values in °C
   * @param {string} city
   * @returns {array}
   */
  getCityTemperatures(city) {
    const cityMeasurments = this.getCityMeasurments(city);
    return _.map(cityMeasurments, item => {
      return _.values(item)[0];
    });
  }

  /**
   * Collection of measured max temperatures with dates for particular city
   * @param {string} city 
   * @returns {arrray}
   */
  getCityMeasurments(city) {
    const cities = this.state.cities;
    let result = [];
    _.forEach(cities, cityObj => {
      if (_.keys(cityObj)[0] === city) {
        result = _.values(cityObj)[0];
        return;
      }
    });
    return result;
  }

  /**
   * Create option items for html select element
   * @returns {html}
   */
  composeSelectOptions() {
    const cityNames = this.getCityNames();
    return (
      _.map(cityNames, name => {
        const capitalizedName = _.capitalize(name);
        return <option key={name} value={name}>{capitalizedName}</option>;
      })
    );
  }
  
  render() {
    return (
      <div>
        <h3 className="title">Maximum temperatures in selected cities</h3>
        <div className="form-group city-select">
            <label className="col-form-label city-label">City:</label>
            <select className="form-control city-select-dropdown" value={this.state.selectedCity} onChange={e => this.handleClick(e)}>
              {this.composeSelectOptions()}
            </select>
        </div>
        <form className="row" onSubmit={(e) => this.newCityHandler(e)}>
          <div className="form-row align-items-center">
            <div className="col-sm-3">
              <input type="text" name="newCity" className="form-control" placeholder="New city" />
            </div>
            <div className="col-sm-2">
              <input className="btn btn-default" type="submit" value="Add city" />
            </div>
          </div>
        </form>
        <Chart 
          labels={this.getCityDates(this.state.selectedCity)}
          values={this.getCityTemperatures(this.state.selectedCity)}
        />
      </div>
   )
  }
}

export default Weather;