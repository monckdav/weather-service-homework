import React from 'react';
import Autosuggest from 'react-autosuggest';
import './Autocomplete.css';

    class Autocomplete extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                value: '',
                suggestions: []
            };    
        }
    
        /* onChange = (event, { newValue, method }) => {
          this.setState({
            value: newValue
          });
        }; */

        onChange = (_, { newValue }) => {
          const { onChange } = this.props;
          
          this.setState({
            value: newValue
          });
          
          onChange(newValue);
        };
    
        onSuggestionsFetchRequested = ({ value }) => {
            this.setState({
            suggestions: this.getSuggestions(value)
            });
        };
    
        onSuggestionsClearRequested = () => {
            this.setState({
            suggestions: []
            });
        };

        escapeRegexCharacters(str) {
            return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }
        
        getSuggestions(value) {
            const escapedValue = this.escapeRegexCharacters(value.trim());
            
            if (escapedValue === '') {
              return [];
            }
          
            const regex = new RegExp('^' + escapedValue, 'i');
            return this.props.inputs.filter(input => regex.test(input.name));
        }
        
        getSuggestionValue(suggestion) {
            return suggestion.name;
        }
        
        renderSuggestion(suggestion) {
          return (
            <span>{suggestion.name}</span>
          );
        }
    
        render() {
          const { placeholder } = this.props;
          const { value, suggestions } = this.state;
          const inputProps = {
              placeholder,
              value,
              onChange: this.onChange
          };
            
          return (
              <Autosuggest 
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                inputProps={inputProps}
              />
          );
        }
    }

export default Autocomplete;