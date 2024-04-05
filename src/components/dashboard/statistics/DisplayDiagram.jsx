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
import { StyledDisplayDiagram } from '../Dashboard.styled'
import { useCallback, useEffect, useState } from 'react'

const DisplayDiagram = ({ displays, theme }) => {

    const [displayData, setDisplayData] = useState(new Array(0))

    const processDisplayData = useCallback(() => {
        let fullscreen = 0;
        let standalone = 0;
        let browser = 0;
        let none = 0;

        for (let display in displays){
            if(display.includes("fullscreen"))
                fullscreen += displays[display]
            else if(display.includes("standalone"))
                standalone += displays[display]
            else if(display.includes("browser"))
                browser += displays[display]
            else
                none += displays[display]
        }

        let datasets = [
            {
                data: [none],
                backgroundColor: theme.blueRGB,
                label: 'none',
            },
            {
                data: [browser],
                backgroundColor: theme.redRGB,
                label: 'browser',
            },
            {
                data: [standalone],
                backgroundColor: theme.greenRGB,
                label: 'standalone',
            },
            {
                data: [fullscreen],
                backgroundColor: theme.lightgreenRGB,
                label: 'fullscreen',
            }
        ]

        setDisplayData(datasets)
    }, [theme, displays])

    useEffect(() => {
        processDisplayData()
    }, [displays, processDisplayData])

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
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                display: false,
                stacked: true
            },
            y: {
                display: false,
                stacked: true
            }
        }
    }

    const labels = ['']

    const data = {
        labels,
        datasets: displayData
    }

    return(
        <StyledDisplayDiagram>
            <Bar options={options} data={data}/>
        </StyledDisplayDiagram>
    )
}

export default DisplayDiagram