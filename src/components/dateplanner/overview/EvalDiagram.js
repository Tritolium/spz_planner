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
import { theme } from '../../../theme';

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
                backgroundColor: theme.greenRGB
            },
            {
                data: [event.Missing],
                backgroundColor: theme.blueRGB
            },
            {
                data: [event.Maybe],
                backgroundColor: theme.yellowRGB
            },
            {
                data: [event.Refusal],
                backgroundColor: theme.redRGB
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