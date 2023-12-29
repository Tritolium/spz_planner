import { useCallback, useEffect, useState } from "react"
import VersionDiagram from "./VersionDiagram"
import { host } from "../../modules/data/DBConnect"

const Statistics = ({ theme }) => {

    const [statistics, setStatistics] = useState({})

    const fetchStatistics = useCallback(async () => {
        fetch(`${host}/api/eval.php?api_token=${localStorage.getItem('api_token')}&statistics`)
        .then(res => res.json())
        .then(data => {
            setStatistics(data)
        })
    }, [])

    useEffect(() => {
        fetchStatistics()
    }, [fetchStatistics])

    return(<>
        <VersionDiagram versions={statistics.Versions} theme={theme}/>
    </>)
}

export default Statistics