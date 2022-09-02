import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js'
import { Bar } from "react-chartjs-2"
import DateField from '../attendenceInput/DateField';
import { StyledEvalDiagram } from './Overview.styled';

const EvalDiagram = ({ event }) => {

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
      )

    const options = {
        indexAxis: 'y',
        plugins: {
          title: {
            display: false,
          },
          legend: {
            display: false
          }
        },
        responsive: false,
        scales: {
          x: {
            stacked: true,
            display: false
          },
          y: {
            stacked: true,
          },
        },
      };

    const labels = ['']

    const data = {
        labels,
        datasets: [
            {
                data: [event.Consent],
                backgroundColor: 'rgb(0, 186, 0)'
            },
            {
                data: [event.Refusal],
                backgroundColor: 'rgb(255, 0, 0)'
            },
            {
                data: [event.Missing],
                backgroundColor: 'rgb(37, 183, 211)'
            },
            {
                data: [event.Maybe],
                backgroundColor: 'rgb(255, 161, 31)'
            }
        ],
    }

    return(
        <StyledEvalDiagram>
            <DateField dateprops={event}/>
            <Bar height={"60px"} options={options} data={data} />
        </StyledEvalDiagram>
    )
}

export default EvalDiagram