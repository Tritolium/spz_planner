import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, BarElement, CategoryScale, Legend, LinearScale, Title, Tooltip } from "chart.js"
import { hasPermission } from "../../../modules/helper/Permissions"

const DashboardDiagram = ({ event, theme, association_id }) => {

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    )

    const options = {
        animation: {
            duration: 0
        },
        indexAxis: 'y',
        plugins: {
            title: {
                display: false
            },
            legend: {
                display: false
            },
            tooltip: {
                enabled: hasPermission(7, association_id),
            }
        },
        scales: {
            x: {
                stacked: true,
                display: false
            },
            y: {
                stacked: true,
                display: false
            }
        }
    }

    const labels = ['']

    const data = {
        labels,
        datasets: [
            {
                data: [event?.Consent + event?.PlusOne],
                backgroundColor: theme.greenRGB
            },
            {
                data: [event?.ProbAttending],
                backgroundColor: theme.lightgreenRGB
            },
            {
                data: [event?.Maybe],
                backgroundColor: theme.yellowRGB
            },
            {
                data: [event?.ProbMissing],
                backgroundColor: theme.lightredRGB
            },
            {
                data: [event?.Refusal],
                backgroundColor: theme.redRGB
            },
            {
                data: [event.ProbSignout],
                backgroundColor: theme.darkredRGB
            }
        ]
    }

    return(<Bar height={"30px"} options={options} data={data}/>)
}

export default DashboardDiagram