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
   * Collection of city names
   * @returns {array}
   */
  getCityNames() {
    const cities = this.state.cities;
    const cityNames = _.map(cities, city => {
      return _.keys(city)[0];
    });
    cityNames.push("london"); // added extra city outside the server data
    return cityNames;
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
   * Process change event on city select element
   * @param {object} e 
   */
  handleClick(e) {
    const value = e.target.value;
    this.setState({selectedCity: value});
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
        <Chart 
          labels={this.getCityDates(this.state.selectedCity)}
          values={this.getCityTemperatures(this.state.selectedCity)}
        />
      </div>
   )
  }
}

export default Weather;