import React from 'react';
import {Bar} from 'react-chartjs-2';

class Chart extends React.Component {
    render() {
        const data = {
            labels: this.props.labels,
            datasets: [
              {
                label: 'Temperature (°C)',
                backgroundColor: 'rgba(50, 163, 2, 0.750)',//'rgba(255,99,132,0.2)',
                borderColor: 'rgb(161, 241, 0)',//'rgba(255,99,132,1)',
                borderWidth: 3,
                hoverBackgroundColor: 'rgba(99, 122, 255, 0.425)',
                hoverBorderColor: 'rgb(99, 102, 255)',
                data: this.props.values
              }
            ]
        };

        return (
          <div>
            <Bar
              data={data}
              width={20}
              height={400}
              options={{
                maintainAspectRatio: false
              }}
            />
          </div>
        );
    }
}

export default Chart;