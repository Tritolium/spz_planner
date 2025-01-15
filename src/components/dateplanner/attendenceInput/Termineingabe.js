import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { getAttendences } from '../../../modules/data/DBConnect'

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
    const [selectedDateFilter, setSelectedDateFilter] = useState('all')
    const [selectedEventFilter, setSelectedEventFilter] = useState('all')

    const fetchEvents = async () => {
        let _attendences = await getAttendences()
        if(_attendences !== undefined){
            setAttendences(_attendences)
        }

        // if there are no attendences with attendence -1, use different event filter
        if(_attendences?.filter(attendence => attendence.Attendence === -1).length === 0){
            setSelectedEventFilter('all')
            document.getElementById('eventSelect').value = 'all'
        }
    }

    const onDateFilterChange = useCallback(e => {
        setSelectedDateFilter(e.target.value)
    }, [setSelectedDateFilter])

    const onEventFilterChange = useCallback(e => {
        setSelectedEventFilter(e.target.value)
        console.log(e.target.value)
    }, [setSelectedEventFilter])

    useEffect(() => {
        fetchEvents()
    }, [])

    return(
        <Form className="DateInput">
            <div className='EventFilter'>
                <select name='eventSelect' id='eventSelect' title='event select' onChange={onEventFilterChange}>
                    <option value='all'>Alle</option>
                    <option value='pending'>Ausstehend</option>
                    <option value='practice'>Üben/Probe</option>
                    <option value='event'>Auftritt</option>
                    <option value='other'>Sonstige Termine</option>
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
                <AttendenceTable attendences={attendences} states={ATTENDENCE_STATES} selectedDateFilter={selectedDateFilter} selectedEventFilter={selectedEventFilter} theme={theme}/>
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

    .EventFilter {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
    }
`

export default Termineingabe