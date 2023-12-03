import { useCallback, useEffect, useState } from "react"
import { host } from "../../modules/data/DBConnect"
import { version } from "../../App"

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js'
import { StyledVersionDiagramm } from "./Dashboard.styled"
import { Bar } from "react-chartjs-2"

const VersionDiagram = ({ theme }) => {

    const [versionData, setVersionData] = useState(new Array(0))

    const fetchVersionEval = useCallback(async () => {
        let token = localStorage.getItem('api_token')

        let res = await fetch(`${host}/api/eval.php?api_token=${token}&version`)
        let versionEval = await res.json()

        let sortable = []

        for(let version in versionEval){
            sortable.push([version, versionEval[version]])
        }

        sortable.sort((versA, versB) => {
            if(versA[0] === "")
                return -1
            if(versB[0] === "")
                return 1

            let aSplit = versA[0].split(".")
            let bSplit = versB[0].split(".")

            let aMaj = parseInt(aSplit[0].substring(1))
            let bMaj = parseInt(bSplit[0].substring(1))

            if(aMaj !== bMaj)
                return aMaj - bMaj

            let aMin = parseInt(aSplit[1])
            let bMin = parseInt(bSplit[1])

            if(aMin !== bMin)
                return aMin - bMin

            let aPatch = parseInt(aSplit[2])
            let bPatch = parseInt(bSplit[2])

            return aPatch - bPatch
        })

        let datasets = []
        for(let vers in sortable){

            let aSplit = sortable[vers][0].split(".")
            let bSplit = version.split(".")

            let aMaj = parseInt(aSplit[0].substring(1))
            let bMaj = parseInt(bSplit[0].substring(1))

            let aMin = parseInt(aSplit[1])
            let bMin = parseInt(bSplit[1])

            let aPatch = parseInt(aSplit[2])
            let bPatch = parseInt(bSplit[2])

            let backgroundColor

            if(aMaj === bMaj){
                if(aMin === bMin && (aPatch === bPatch || (isNaN(aPatch) && isNaN(bPatch))))
                    backgroundColor = theme.greenRGB
                else if (aMin === bMin)
                    backgroundColor = theme.yellowRGB
                else
                    backgroundColor = theme.redRGB
            } else if (isNaN(aMaj)) {
                backgroundColor = theme.blueRGB
            } else {
                backgroundColor = theme.redRGB
            }

            datasets.push({
                label: sortable[vers][0],
                data: [sortable[vers][1]],
                backgroundColor: backgroundColor
            })
        }

        setVersionData(datasets)
    }, [theme])

    useEffect(() => {
        fetchVersionEval()
    }, [fetchVersionEval])

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    )

    const options = {
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                display: false
            },
            y: {
                display: false
            }
        }
    }

    const labels = ['']

    const data = {
        labels,
        datasets: versionData
    }

    return(
        <StyledVersionDiagramm>
            <Bar options={options} data={data}/>
        </StyledVersionDiagramm>
    )
}

export default VersionDiagram