import { useEffect } from 'react'
import { useState } from 'react'
import { getEvents } from '../../modules/data/DBConnect'
import { StyledDashboard } from './Dashboard.styled'
import polo from '../../icons/polo.png'
import shirt from '../../icons//shirt.png'
import suit from '../../icons//suit.png'

const Dashboard = ({ quickNav }) => {

    const [nextEvent, setNextEvent] = useState()
    const [nextPractice, setNextPractice] = useState()

    let eventDate = new Date(nextEvent?.Date)
    let practiceDate = new Date(nextPractice?.Date)

    const getNextEvent = async () => {
        let events = await getEvents('current')
        let nextAll = events.filter(event => { // sort out past events, if cache contains them
            let attDate = new Date(event.Date)
            attDate.setHours(23,59,59,999)
            let today = new Date()
            return today <= attDate
        })

        let nextEvent = nextAll.filter(event => { // sort out practice
            return !(event.Type === 'Probe' || event.Type === 'Üben')
        })[0]

        let nextPractice = nextAll.filter(event => { // sort out practice
            return event.Type === 'Probe' || event.Type === 'Üben'
        })[0]

        setNextEvent(nextEvent)
        setNextPractice(nextPractice)
    }

    useEffect(() => {
        getNextEvent()
    }, [])

    return(<StyledDashboard>
        <div id='infotext'>Info: die Rückmeldungen sind im Menü auf der linken Seite unter "Anwesenheiten" zu finden</div>
        <div>Nächste Probe:</div>
        <table>
            <tbody>
                <tr>
                    <td>{nextPractice?.Type}</td>
                    <td>{nextPractice?.Location}</td>
                </tr>
                <tr>
                    <td>{practiceDate.getDate()}.{practiceDate.getMonth() + 1}.{practiceDate.getFullYear()}</td>
                    <td>{nextPractice?.Begin}</td>
                </tr>
            </tbody>
        </table>
        <div>Nächster Auftritt:</div>
        <table>
            <tbody>
                <tr>
                    <td>{nextEvent?.Type}</td>
                    <td>{nextEvent?.Location}</td>
                </tr>
                <tr>
                    <td>{eventDate.getDate()}.{eventDate.getMonth() + 1}.{eventDate.getFullYear()}</td>
                    <td>{nextEvent?.Begin}</td>
                </tr>
                <tr>
                    <td>Hin:</td>
                    <td>{nextEvent?.Departure !== "12:34:56" ? nextEvent?.Departure : "-"}</td>
                </tr>
                <tr>
                    <td>Zurück:</td>
                    <td>{nextEvent?.Leave_dep !== "12:34:56" ? nextEvent?.Leave_dep : "-"}</td>
                </tr>
                <Clothing clothing={3} />
            </tbody>
        </table>
    </StyledDashboard>)
}

const Clothing = ({ clothing }) => {

    let icon

    switch(clothing){
    case 1:
        icon = polo
        break
    case 2:
        icon = shirt
        break
    case 3:
        icon = suit
        break
    default:
        break
    }

    //return(icon ? <div>Bekleidung: <img src={icon} alt="Uniform" loading='lazy'/></div> : <></>)

    return(
        <tr>
            <td>Bekleidung:</td>
            <td>{icon ? <img src={icon} alt="Uniform" loading="lazy" /> : <>keine Angabe</>}</td>
        </tr>
    )
}

export default Dashboard