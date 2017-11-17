import React from 'react';
import ReactDOM from 'react-dom';
import Chart from './Chart';
import CitySelector from './CitySelector';
import DatePicker from './DatePicker';
import AddCity from './AddCity';
import Dialog from 'react-bootstrap-dialog'
import _ from 'lodash';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * @param {number} min 
 * @param {number} max 
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min; 
}

/**
 * Collection of city names
 * @returns {array}
 */
function getCityNames(cities) {
  const cityNames = _.map(cities, city => {
    return _.keys(city)[0];
  });
  cityNames.push("london"); // added extra city outside the server data
  return cityNames.sort();
}

/**
 * Get array of suggestions
 * @returns {array}
 */
function getCityAutocomplete(cities) {
  const cityNames = getCityNames(cities);
  return _.map(cityNames, name => {
    return _.capitalize(name);
  });
}

/**
 * Collection of measured dates
 * @param {string} city
 * @returns {array}
 */
function getCityDates(city, cities) {
  const cityMeasurments = getCityMeasurments(city, cities);
  return _.map(cityMeasurments, item => {
    return _.keys(item)[0];
  });
}

/**
 * Collection of measured values in °C
 * @param {string} city
 * @returns {array}
 */
function getCityTemperatures(city, cities) {
  const cityMeasurments = getCityMeasurments(city, cities);
  return _.map(cityMeasurments, item => {
    return _.values(item)[0];
  });
}

/**
 * Collection of measured max temperatures with dates for particular city
 * @param {string} city 
 * @returns {arrray}
 */
function getCityMeasurments(city, cities) {
  return _
    .chain(cities)
    .find(city)
    .values()
    .head()
    .value();
}

/**
 * Open alert modal window
 * @param {object} that 
 * @param {string} title 
 * @param {string} body 
 */
function alert(that, title, body) {
  that.dialog.show({
    title: title,
    body: body,
    actions: [
      Dialog.OKAction()
    ],
    bsSize: 'small',
    onHide: (dialog) => {
      dialog.hide()
    }
  });
}

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
  	fetch('http://localhost:3001/weather/cities')
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
   * Add new date with measured temperature for specific city
   * @param {string} id 
   * @param {object} newData 
   */
  updateData(id, newData) {
    return fetch(`http://localhost:3001/weather/cities/${id}`, {
      method: 'PUT',
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
   * Handle change of city select field
   * @param {object} e 
   * @param {object} t 
   */
  citySelectHandler(e, t) {
    e.preventDefault();
    const newValue = e.target.typeahead.value.toLowerCase();
    if (_.includes(getCityNames(this.state.cities), newValue)) {
      this.setState({selectedCity: newValue});
      t.getInstance().clear();
    }
  }

  /**
   * Process submit event of add city component
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
    if (_.isEmpty(city)) {
      return;
    }
    const dates = ["19-09-2017", "20-09-2017", "21-09-2017", "22-09-2017", "23-09-2017"];
    
    //create dates with temperatures for new city
    const newCityData = {};
    newCityData[city] = _.map(dates, date => {
      const newMeasurment = {};
      newMeasurment[date] = getRandomInt(18, 30);
      return newMeasurment;
    });

    //push data to server
    this.addNewData(newCityData)
      .then(result => {
        //check data validation in server side
        if(result.status === "error") {
          alert (
            this,
            _.upperFirst(result.message),
            _.upperFirst(result.detailed)
          );
          return;
        } else {
          //check hardcoded data in application
          const cities = this.state.cities.slice();
          if (_.includes(getCityNames(cities), city)) {
            alert(
              this,
              "Duplicated data",
              `City ${_.capitalize(city)} already exists in app`
            );
            return;
          }

          //saved if data is unique
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
   * Process submit event of add new date component
   * @param {object} e 
   */
  newDateHandler(e) {
    e.preventDefault();

    //create date object
    const day = _.padStart(e.target.day.value, 2, '0');
    const month = _.padStart(e.target.month.value, 2, '0');
    const year = e.target.year.value;
    const {selectedCity, cities} = this.state;
    
    //create new temperature object for specific date
    const newDateObj = {};
    const date = `${day}-${month}-${year}`;
    newDateObj[date] = getRandomInt(12, 29);
    
    //push data to server
    this.updateData(this.state.selectedCity, newDateObj)
      .then(result => {
        //check data validation in server side
        if(result.status === "error") {
          alert(
            this,
            _.upperFirst(result.message),
            _.upperFirst(result.detailed)
          );
          return;
        } else {
          //check hardcoded data in application
          const dates = getCityDates(selectedCity, cities);
          if (_.includes(dates, date)) {
            alert(
              this,
              "Duplicated date",
              `Date ${date} already exists in app`
            );
            return;
          }
        }

        //saved if data is unique
        const index = _.findIndex(cities, selectedCity);
        const newCities = cities.slice();
        newCities[index][selectedCity].push(newDateObj);
        
        //Sort data
        const sortedMeasures = _.sortBy(newCities[index][selectedCity], [o => {
          const dateArr = _.keys(o)[0].split('-');
          return new Date(`${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`);
        }]);

        newCities[index][selectedCity] = sortedMeasures;
        this.setState({cities: newCities});
      });

  }

  render() {
    const {
      selectedCity,
      cities
    } = this.state;

    return (
      <div>
        <h3 className="title">Maximum temperatures in {_.capitalize(selectedCity)}</h3>
        <div className="cityselector">
          <CitySelector 
            onChange={(e, t) => this.citySelectHandler(e, t)}
            options={getCityAutocomplete(cities)} />
        </div>
        <div className="form-inline">
          <div className="form-group cityadd-control">
            <AddCity cityHandler={e => this.newCityHandler(e)} />
          </div>
          <div className="form-group">
            <DatePicker 
              date="16-11-2017"
              onSubmit={e => this.newDateHandler(e)} />
          </div>
        </div>
        <div className="chart">
          <Chart 
            labels={getCityDates(selectedCity, cities)}
            values={getCityTemperatures(selectedCity, cities)} />
        </div>
        <Dialog ref={(el) => { this.dialog = el }} />
      </div>
   )
  }
}

ReactDOM.render(<Weather />, document.getElementById('root'));