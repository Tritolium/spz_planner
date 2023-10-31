import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import SubmitButton from '../../../modules/components/SubmitButton'
import { getAttendences, updateAttendences } from '../../../modules/data/DBConnect'

const AttendenceTable = lazy(() => import('./AttendenceTable'))

const Termineingabe = ({fullname, theme}) => {

    /**
     * constant, maybe switch to fetch from server
     */
    const ATTENDENCE_STATES = 3

    /**
     * fetched from server
     */
    const [attendences, setAttendences] = useState(new Array(0))

    /**
     * local states
     */
    const [changedAttendences, setChangedAttendences] = useState({})
    const [selectedDateFilter, setSelectedDateFilter] = useState('all')
    const [selectedEventFilter, setSelectedEventFilter] = useState('all')

    const fetchEvents = async () => {
        let _attendences = await getAttendences()
        if(_attendences !== undefined){
            setAttendences(_attendences)
        }
    }

    const onClick = useCallback((event_id, attendence) => {
        let att = {...changedAttendences}
        att['' + event_id] = attendence
        setChangedAttendences(att)
    }, [changedAttendences])

    const onDateFilterChange = useCallback(e => {
        setSelectedDateFilter(e.target.value)
    }, [setSelectedDateFilter])

    const onEventFilterChange = useCallback(e => {
        setSelectedEventFilter(e.target.value)
    }, [setSelectedEventFilter])

    const sendForm = (e) => {
        e.preventDefault()
        updateAttendences(changedAttendences)
        fetchEvents()
    }

    useEffect(() => {
        fetchEvents()
    }, [])

    return(
        <Form onSubmit={sendForm} className="DateInput">
            <div>
                <SubmitButton onClick={sendForm}>Speichern</SubmitButton>
                <select name='eventSelect' id='eventSelect' title='event select' onChange={onEventFilterChange}>
                    <option value='all'>Alle</option>
                    <option value='practice'>Üben/Probe</option>
                    <option value='else'>Auftritte etc.</option>
                </select>
                <select name="dateSelect" id="dateSelect" title='date select' onChange={onDateFilterChange}>
                    <option value="all">Alle</option>
                    <option value="one">1 Woche</option>
                    <option value="two">2 Wochen</option>
                    <option value="four">4 Wochen</option>
                    <option value="eight">8 Wochen</option>
                </select>
            </div>
            <Suspense fallback={<div>Tabelle lädt.</div>}>
                <AttendenceTable attendences={attendences} fullname={fullname} states={ATTENDENCE_STATES} selectedDateFilter={selectedDateFilter} selectedEventFilter={selectedEventFilter} onClick={onClick} theme={theme}/>
            </Suspense>
        </Form>
    )
}

const Form = styled.form`

    flex-direction: column;

    @media (max-width: ${({theme}) => theme.mobile}) {
        padding-bottom: 2rem;
    }
    
    box-sizing: border-box;

    select {
        padding: 2px;
        margin: 2px;
        border-radius: 5px;
    }

    > div {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
    }
`

export default Termineingabe