import React from 'react';
import _ from 'lodash';
import './DatePicker.css'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

/**
 * Prepare options for day selector
 * @param {int} month 
 * @param {int} year
 * @returns html option collection
 */
function getDayOptions(month, year) {
    const month30 = [4, 6, 9, 11];
    let dayLimit = 31;

    if (_.includes(month30, month)) {
        dayLimit = 30;
    } else if (month === 2) {
        dayLimit = leapYear(year) ? 29 : 28;
    }

    const daysArr = _.range(dayLimit);
    return (
        _.map(daysArr, day => {
            return <option key={day + 1} value={day + 1}>{day + 1}</option>;
        })
    );
}

/**
 * Prepare options for month selector
 * @returns html option collection
 */
function getMonthOptions() {
    const monthArr = _.range(12);
    return (
        _.map(monthArr, month => {
            return <option key={month + 1} value={month + 1}>{month + 1}</option>;
        })
    );
}

/**
 * Prepare options for year selector
 * @param {int} day
 * @returns html option collection
 */
function getYearOptions(day) {
    const startYear = (new Date()).getFullYear();
    const yearArr = _.range(10);
    return (
        _.map(yearArr, year => {
            year += startYear;
            return <option key={year} value={year}>{year}</option>;
        })
    );
}

/**
 * Check leap year
 * @param {int} year
 * @returns {boolean}
 */
function leapYear(year) {
  return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}

class DatePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            day: 0,
            month: 0,
            year: 0
        };
    }

    /**
     * Process props before save to state
     */
    componentWillReceiveProps() {
        const dateElements = this.props.date.split('-');
        this.setState({
            day: _.toInteger(dateElements[0]),
            month: _.toInteger(dateElements[1]),
            year: _.toInteger(dateElements[2])
        });
    }

    /**
     * Handle day click
     * @param {object} e 
     */
    handleDay(e) {
        this.setState({day: _.toInteger(e.target.value)});
    }

    /**
     * Handle month click
     * @param {object} e 
     */
    handleMonth(e) {
        const month = _.toInteger(e.target.value);
        let day = this.state.day;
        switch (month) {
            case 2:
                if (day > 28) {
                    day = leapYear(this.state.year) ? 29 : 28;
                }
                break;
            case 4:
            case 6:
            case 9:
            case 11:
                if (day > 31) {
                    day = 30;
                }
                break;
            default:
                break;
        }
        this.setState({
            month,
            day
        });
    }

    /**
     * Handle year click
     * @param {object} e 
     */
    handleYear(e) {
        let day = this.state.day;
        const month = this.state.month;

        if (month === 2 && day > 28) {
            day = leapYear(this.state.year) ? 29 : 28;
        }
        this.setState({
            year: _.toInteger(e.target.value),
            day
        });
    }

    render() {
        const {day, month, year} = this.state;

        return (
            <form className="form-inline datepicker-form" onSubmit={e => this.props.onSubmit(e)}>
                <div className="form-group-datepicker">
                    <label>Month
                        <select className="form-control" name="month" value={this.state.month} onChange={e => this.handleMonth(e)}>
                            {getMonthOptions()}
                        </select>
                    </label>
                </div>
                <div className="form-group-datepicker">
                    <label>Day
                        <select className="form-control" name="day" value={this.state.day} size="1" onChange={e => this.handleDay(e)}>
                            {getDayOptions(month, year)}
                        </select>
                    </label>
                </div>
                <div className="form-group-datepicker">
                    <label>Year
                        <select className="form-control" name="year" value={this.state.year} onChange={e => this.handleYear(e)}>
                            {getYearOptions(day)}
                        </select>
                    </label>
                </div>
                <button type="submit" className="btn btn-primary">Add date</button>
            </form>
        );
    }
}

export default DatePicker;