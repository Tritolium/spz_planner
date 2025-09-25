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

const EvalDiagram = ({ event, theme }) => {

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
        animation: {
            duration: 0
        }
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
                data: [event.ProbAttending],
                backgroundColor: theme.lightgreenRGB
            },
            {
                data: [event.Maybe],
                backgroundColor: theme.orangeRGB
            },
            {
                data: [event.ProbMissing],
                backgroundColor: theme.lightredRGB
            },
            {
                data: [event.Refusal],
                backgroundColor: theme.redRGB
            },
            {
                data: [event.ProbSignout],
                backgroundColor: theme.darkredRGB
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