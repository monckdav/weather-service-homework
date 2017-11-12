import React from 'react';
import './AddCity.css'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

class AddCity extends React.Component {
    render() {
        return (
            <form className="form-inline addcity-form" onSubmit={(e) => this.props.cityHandler(e)}>
                <div className="form-group">
                    <input type="text" name="newCity" className="form-control addcity-control" placeholder="Enter city name" />
                </div>
                <button type="submit" className="btn btn-primary">Add city</button>
            </form>
        );
    }
}

export default AddCity;