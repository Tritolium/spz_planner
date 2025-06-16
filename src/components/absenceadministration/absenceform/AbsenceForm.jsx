import { useCallback, useEffect, useState } from "react"
import Button from "../../../modules/components/button/Button"
import Selector from "../../../modules/components/form/Selector"
import SelectorItem from "../../../modules/components/form/SelectorItem"
import { deleteAbsence, getAbsence, getAbsences, newAbsence, updateAbsence } from "../../../modules/data/DBConnect"
import { StyledForm, StyledAbsenceForm, FormBox } from "./AbsenceForm.styled"
import { getWeeknumber, groupConsecutiveDates } from "../../../modules/helper/DateFormat"

const AbsenceForm = () => {

    const [absences, setAbsences] = useState(new Array(0))
    const [selected, setSelected] = useState(-1)

    const fetchAbsences = useCallback(async () => {
        let _absences = await getAbsences('current')
        if(_absences !== undefined)
            setAbsences(_absences)
        else
            setAbsences(new Array(0))
    }, [])

    const reload = useCallback(() => {
        fetchAbsences()
    }, [fetchAbsences])

    const onSelect = useCallback((id) => {
        setSelected(id)
    }, [])

    useEffect(() => {
        fetchAbsences()
    }, [fetchAbsences])
    
    return(
        <StyledAbsenceForm>
            <AbsenceSelector onSelect={onSelect} absences={absences}/>
            <Form selected={selected} reload={reload}/>
        </StyledAbsenceForm>
    )
}

const AbsenceSelector = ({absences, onSelect}) => {
    
    return(
        <Selector>
            {absences.map(absence => {
                return(<Absence onSelect={onSelect} key={absence.Absence_ID} absence={absence}/>)
            })}
        </Selector>
    )
}

const Absence = ({absence, onSelect}) => {

    const onClick = useCallback(() => {
        onSelect(absence.Absence_ID)
    }, [onSelect, absence.Absence_ID])

    const formatDate = (date) => {
        date = date.split('-')
        return `${date[2]}.${date[1]}.${date[0]}`
    } 

    return(
        <SelectorItem onClick={onClick}>{formatDate(absence.From)} - {formatDate(absence.Until)}</SelectorItem>
    )
}

const Form = ({selected, reload}) => {

    const today = new Date().toISOString().split('T')[0]

    const [absence, setAbsence] = useState({
        Absence_ID: -1,
        From: today,
        Until: today,
        Info: ""
    })

    useEffect(() => {
        const fetchAbsence = async () => {
            let _absence = await getAbsence(selected)
            if(_absence !== undefined)
                setAbsence(_absence)
        }
        fetchAbsence()
    }, [selected])

    useEffect(() => {
        document.getElementById("absenceeditor").reset()
    }, [absence])

    const clear = (e) => {

        e.preventDefault()

        setAbsence({
            Absence_ID: -1,
            From: today,
            Until: today,
            Info: ""
        })
    }

    const createNew = async (e) => {
        e.preventDefault()
        
        let until
        let from = document.getElementById("from").value
        let _until = document.getElementById("until").value
        let info = document.getElementById("info").value
        let weeks = document.getElementById("weeks").value

        //create an array with the selected weekdays
        let weekdays = []
        let weekselect = document.getElementsByClassName("weekselect")[0]
        for(let i = 0; i < weekselect.children.length; i++){
            if(weekselect.children[i].checked){
                weekdays.push((i - 6)%7)
            }
        }

        _until === '' ? until = from : until = _until

        // prevent that the beginning date is after the end date
        if(from > until){
            alert("Das Startdatum darf nicht nach dem Enddatum liegen.")
            return
        }

        // create a list of selected dates, from the beginning date to the end date
        let dates = []
        for(let i = new Date(from); i <= new Date(until); i.setDate(i.getDate() + 1)){
            switch(weeks){
            default:
            case "0":
                if(weekdays.includes(i.getDay()))
                    dates.push(new Date(i))
                break
            case "1":
                if(weekdays.includes(i.getDay()) && getWeeknumber(i) % 2 === 0)
                    dates.push(new Date(i))
                break
            case "2":
                if(weekdays.includes(i.getDay()) && getWeeknumber(i) % 2 === 1)
                    dates.push(new Date(i))
                break
            }
        }

        if (dates.length === 0){
            alert("In der Auswahl sind keine Tage enthalten.")
            return
        }
        
        // create arrays with adjurning dates
        dates = groupConsecutiveDates(dates)

        for(let i = 0; i < dates.length; i++){
            let from = dates[i][0].toISOString().split('T')[0]
            let until = dates[i][dates[i].length - 1].toISOString().split('T')[0]
            await newAbsence(from, until, info)
        }

        reload()
        clear(e)
    }

    const update = async (e) => {
        e.preventDefault()

        if(absence.Absence_ID < 0){
            createNew(e)
            return
        }
        
        let until
        let from = document.getElementById("from").value
        let _until = document.getElementById("until").value
        let info = document.getElementById("info").value

        _until === '' ? until = from : until = _until

        // prevent that the beginning date is after the end date
        if(from > until){
            alert("Das Startdatum darf nicht nach dem Enddatum liegen.")
            return
        }

        await updateAbsence(absence.Absence_ID, absence.Member_ID, from, until, info)

        reload()
        clear(e)
    }

    const delAbsence = async (e) => {

        e.preventDefault()

        if(absence.Absence_ID > 0){
            await deleteAbsence(absence.Absence_ID)
        }

        reload()
        clear(e)
    }

    return(
        <>
            <StyledForm id="absenceeditor">
                <FormBox>
                    <label htmlFor="from">Von:</label>
                    <input type="date" name="from" id="from" defaultValue={absence.From}/>
                </FormBox>
                <FormBox>
                    <label htmlFor="until">Bis:</label>
                    <input type="date" name="until" id="until" defaultValue={absence.Until}/>
                </FormBox>
                <FormBox>
                    <label htmlFor="info">Bemerkung:</label>
                    <textarea name="info" id="info" cols="30" rows="3" defaultValue={absence.Info}></textarea>
                </FormBox>
                {absence.Absence_ID < 0 && <><FormBox>
                    <label htmlFor="days">Wochentage:</label>
                    <div className="weekselect">
                        <label htmlFor="monday">Mo</label>
                        <label htmlFor="tuesday">Di</label>
                        <label htmlFor="wednesday">Mi</label>
                        <label htmlFor="thursday">Do</label>
                        <label htmlFor="friday">Fr</label>
                        <label htmlFor="saturday">Sa</label>
                        <label htmlFor="sunday">So</label>
                        <input type="checkbox" name="monday" id="monday" defaultChecked="true"/>
                        <input type="checkbox" name="tuesday" id="tuesday" defaultChecked="true"/>
                        <input type="checkbox" name="wednesday" id="wednesday" defaultChecked="true"/>
                        <input type="checkbox" name="thursday" id="thursday" defaultChecked="true"/>
                        <input type="checkbox" name="friday" id="friday" defaultChecked="true"/>
                        <input type="checkbox" name="saturday" id="saturday" defaultChecked="false"/>
                        <input type="checkbox" name="sunday" id="sunday" defaultChecked="false"/>
                    </div>
                </FormBox>
                <FormBox>
                    <label htmlFor="weeks">Wochen:</label>
                    <select name="weeks" id="weeks">
                        <option value="0">alle</option>
                        <option value="1">gerade</option>
                        <option value="2">ungerade</option>
                    </select>
                </FormBox></>}
                
                <div>
                    <Button onClick={clear}>Abbrechen</Button>
                    <Button onClick={update}>Speichern</Button>
                    <Button onClick={delAbsence}>Löschen</Button>
                </div>
            </StyledForm>
        </>
    )
}

export default AbsenceForm
