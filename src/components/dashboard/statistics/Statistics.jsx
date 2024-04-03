import { useCallback, useEffect, useState } from "react"
import VersionDiagram from "./VersionDiagram"
import { host } from "../../../modules/data/DBConnect"
import UserStats from "./UserStats"
import DisplayDiagram from "./DisplayDiagram"

const Statistics = ({ theme, auth_level }) => {

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

    useEffect(() => {
        const interval = setInterval(() => {
            fetchStatistics()
        }, 60000)
        return () => clearInterval(interval)
    }, [fetchStatistics])

    return(<>
        {auth_level > 2 ? <VersionDiagram versions={statistics.Versions} theme={theme}/> : <></>}
        {auth_level > 2 ? <DisplayDiagram displays={statistics.Displays} theme={theme}/> : <></>}
        <UserStats users={statistics.Users} theme={theme}/>
    </>)
}

export default Statistics