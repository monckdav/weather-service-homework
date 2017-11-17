import React from 'react';
import {Typeahead} from 'react-bootstrap-typeahead';
import './CitySelector.css'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

class CitySelector extends React.Component {
    render() {
        return (
            <form className="form-inline cityselector-form" onSubmit={e => this.props.onChange(e, this.refs.typeahead)}>
                <div className="form-group">
                    <label>CITY</label>
                    <div className="form-group cityselector-control">
                        <Typeahead 
                            ref="typeahead"
                            name="typeahead"
                            clearButton
                            placeholder="Choose city..."
                            options={this.props.options} />
                    </div>
                <button type="submit" className="btn btn-primary">Show</button>
                </div>
            </form>
        );
    }
}

export default CitySelector;