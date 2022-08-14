import { useCallback, useEffect, useState } from "react"
import Button from "../../../modules/components/button/Button"
import { deleteAbsence, getAbsence, getAbsences, newAbsence, updateAbsence } from "../../../modules/data/DBConnect"
import { StyledForm, StyledAbsenceForm, StyledSelector, StyledAbsence, FormBox } from "./AbsenceForm.styled"

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
            <Selector onSelect={onSelect} absences={absences}/>
            <Form selected={selected} reload={reload}/>
        </StyledAbsenceForm>
    )
}

const Selector = ({absences, onSelect}) => {
    
    return(
        <StyledSelector>
            {absences.map(absence => {
                return(<Absence onSelect={onSelect} key={absence.Absence_ID} absence={absence}/>)
            })}
        </StyledSelector>
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
        <StyledAbsence onClick={onClick}>{formatDate(absence.From)} - {formatDate(absence.Until)}</StyledAbsence>
    )
}

const Form = ({selected, reload}) => {

    const [absence, setAbsence] = useState({
        Absence_ID: -1,
        From: "",
        Until: "",
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
            From: "",
            Until: "",
            Info: ""
        })
    }

    const createNew = async (e) => {
        e.preventDefault()
        
        let from = document.getElementById("from").value
        let until = document.getElementById("until").value
        let info = document.getElementById("info").value
        await newAbsence(from, until, info)

        reload()
        clear(e)
    }

    const update = async (e) => {
        e.preventDefault()

        if(absence.Absence_ID < 0){
            createNew(e)
            return
        }

        let from = document.getElementById("from").value
        let until = document.getElementById("until").value
        let info = document.getElementById("info").value
        await updateAbsence(absence.Absence_ID, absence.Member_ID, from, until, info)

        reload()
        clear(e)
    }

    const delAbsence = async (e) => {
        
        e.preventDefault()
        
        if(absence.Absence_ID > 0)
            await deleteAbsence(absence.Absence_ID)
        
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
                
                
                <div>
                    {/*<Button onClick={clear}>Neu anlegen</Button>*/}
                    {/*<Button onClick={createNew}>Neu anlegen</Button>*/}
                    <Button onClick={clear}>Abbrechen</Button>
                    <Button onClick={update}>Speichern</Button>
                    <Button onClick={delAbsence}>Löschen</Button>
                </div>
            </StyledForm>
        </>
    )
}

export default AbsenceForm