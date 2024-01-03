import { Suspense } from "react"
import { Clothing } from "../../../modules/components/icons/Clothing"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, BarElement, CategoryScale, Legend, LinearScale, Title, Tooltip } from "chart.js"
import PlusOne from "../../../modules/components/icons/PlusOne"

export const ClothingData = ({ clothing, onClick }) => {

    return(
        <Suspense>
            {parseInt(clothing) !== 0 ? <>
                <td onClick={onClick}>Bekleidung:</td>
                <td onClick={onClick}><Clothing clothing={parseInt(clothing)} /></td>
            </> : <><td colSpan={2}></td></>}
        </Suspense>
    )
}

export const PlusOneData = ({ attendence, plusOne, callback, theme }) => {

    const onClick = () => {
        if(attendence === 1)
            callback()
    }

    return(<td><PlusOne plusOne={plusOne} active={attendence === 1} onClick={onClick} theme={theme} /></td>)
}

export const DashboardDiagram = ({ event, auth_level, theme }) => {

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
                enabled: auth_level > 1
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
                data: [event?.Consent],
                backgroundColor: theme.greenRGB
            },
            {
                data: [event?.Missing],
                backgroundColor: theme.blueRGB
            },
            {
                data: [event?.Maybe],
                backgroundColor: theme.yellowRGB
            },
            {
                data: [event?.Refusal],
                backgroundColor: theme.redRGB
            }
        ]
    }

    return(<Bar height={"30px"} options={options} data={data}/>)
}