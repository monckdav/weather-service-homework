# Homework for candidates - Simple weather service

# Example 1
## backend - simple nodejs server (Express)
  * expose REST endpoint for fetching data for given city - something like /api/weather/cities/:city - (/api/weather/cities/ostrava)
    * source of weather data is attached JSON file, data represents maximum temperature in celsius for the given city for several days in format "dd-mm-yyyy"

## frontend - Angular and/or React frontend
  * dropdown containing available cities + one city that is not included in the data - can be hardcoded
  * after selection from dropdown, call backend and show data for selected city - for example in a chart
    * for charts, use for example http://www.chartjs.org/, or react version: https://github.com/jerairrest/react-chartjs-2

## notes
  * backend does NOT need to support both frontends - can be two separate projects

# Example 2
## backend - extend simple nodejs server
  * expose REST endpoint for creating new city in cities resource
    * it is OK to keep new cities only in memory, no need to store it in JSON file
  * create a validation to check if city already exists

## frontend - extend Angular and/or React frontend
  * create an input field for creating new city with submit button
  * when submitted city already exists display an alert message

# Example 3
## backend - extend simple nodejs server
  * expose REST endpoint for adding max temperature values for given city
    * it is OK to keep new temperature values only in memory, no need to store it in JSON file
  * create a validation to check if temperature value already exists

## frontend - extend Angular and/or React frontend
  * create an input fields for adding new temperature values and submit button
  * when submitted temperature values already exists display an alert message
  * change city selection dropdown to field with autocomplete functionality

# notes for commits
  * have at least 3 commits for Example 1, Example 2 and Example 3
  * if you need more commits, create commits around logical pieces
