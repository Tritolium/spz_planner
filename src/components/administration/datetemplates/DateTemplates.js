import { useCallback, useEffect, useState } from "react"
import Button from "../../../modules/components/button/Button"
import Form from "../../../modules/components/form/Form"
import FormBox from "../../../modules/components/form/FormBox"
import Selector from "../../../modules/components/form/Selector"
import SelectorItem from "../../../modules/components/form/SelectorItem"
import { getDateTemplates, getUsergroups, newDateTemplate, updateDateTemplate } from "../../../modules/data/DBConnect"
import { StyledDateTemplates } from "./DateTemplates.styled"

const DateTemplates = () => {

    const [datetemplates, setDatetemplates] = useState(new Array(0))
    const [usergroups, setUsergroups] = useState(new Array(0))

    const [selected, setSelected] = useState(-1)

    const fetchDatetemplates = useCallback(async () => {
        let _datetemplates = await getDateTemplates()
        if(_datetemplates !== undefined)
            setDatetemplates(_datetemplates)
        else
            setDatetemplates(new Array(0))
    }, [])

    const fetchUsergroups = useCallback(async () => {
        let _usergroups = await getUsergroups()
        if(_usergroups !== undefined)
            setUsergroups(_usergroups)
        else
            setUsergroups(new Array(0))
    }, [])

    const reload = useCallback(() => {
        setSelected(-1)
        fetchDatetemplates()
    }, [fetchDatetemplates])

    const onSelect = useCallback((id) => {
        setSelected(id)
    }, [])

    useEffect(() => {
        fetchDatetemplates()
        fetchUsergroups()
    }, [fetchDatetemplates, fetchUsergroups])

    return (
        <StyledDateTemplates>
            <DateTemplateSelector onSelect={onSelect} datetemplates={datetemplates} />
            <DateTemplateForm datetemplate={datetemplates.find((datetemplate) => datetemplate.DateTemplate_ID === selected)} usergroups={usergroups} reload={reload} />
        </StyledDateTemplates>
    )
}

const DateTemplateSelector = ({ datetemplates, onSelect}) => {
    return (
        <Selector>
            {datetemplates.map(datetemplate => {
                return(<DateTemplate onSelect={onSelect} key={datetemplate.Title} datetemplate={datetemplate}/>)
            })}
        </Selector>
    )
}

const DateTemplate = ({ onSelect, datetemplate }) => {

    const onClick = useCallback(() => {
        onSelect(datetemplate.DateTemplate_ID)
    }, [onSelect, datetemplate.DateTemplate_ID])

    return(
        <SelectorItem onClick={onClick}>
            {datetemplate.Title}
        </SelectorItem>
    )
}

const DateTemplateForm = ({ datetemplate, usergroups, reload }) => {

    const update = async (e) => {
        e.preventDefault()

        let title           = document.getElementById('title').value
        let description     = document.getElementById('description').value
        let type            = document.getElementById('type').value
        let location        = document.getElementById('location').value
        let begin           = document.getElementById('begin').value
        let departure       = document.getElementById('departure').value
        let leave_dep       = document.getElementById('leave_dep').value
        let usergroup_id    = document.getElementById('usergroup').options[document.getElementById('usergroup').selectedIndex].value

        if(datetemplate !== undefined)
            await updateDateTemplate(datetemplate.DateTemplate_ID, title, description, type, location, begin, departure, leave_dep, usergroup_id)
        else
            await newDateTemplate(title, description, type, location, begin, departure, leave_dep, usergroup_id)

        reload()
    }

    const cancel = async (e) => {
        e.preventDefault()
        reload()
    }

    useEffect(() => {
        document.getElementById('datetemplate_form').reset()
        document.getElementById('usergroup').selectedIndex = usergroups?.findIndex(usergroup => usergroup?.Usergroup_ID === datetemplate?.Usergroup_ID)
    }, [datetemplate, usergroups])

    return (
        <Form id="datetemplate_form">
            <FormBox>
                <label htmlFor="title">Bezeichnung:</label>
                <input type="text" name="title" id="title" defaultValue={datetemplate?.Title}/>
            </FormBox>
            <FormBox>
                <label htmlFor="description">Beschreibung</label>
                <textarea name="description" id="description" cols="30" rows="3" defaultValue={datetemplate === undefined ? "" : datetemplate.Description}></textarea>
            </FormBox>
            <FormBox>
                <label htmlFor="type">Art:</label>
                <input type="text" name="type" id="type" defaultValue={datetemplate?.Type}/>
            </FormBox>
            <FormBox>
                <label htmlFor="location">Ort:</label>
                <input type="text" name="location" id="location" defaultValue={datetemplate?.Location}/>
            </FormBox>
            <FormBox>
                <label htmlFor="begin">Startzeit:</label>
                <input type="time" name="begin" id="begin" step="1" defaultValue={datetemplate?.Begin}/>
            </FormBox>
            <FormBox>
                <label htmlFor="departure">Abfahrt:</label>
                <input type="time" name="departure" id="departure" step="1" defaultValue={datetemplate?.Departure}/>
            </FormBox>
            <FormBox>
                <label htmlFor="leave_dep">Rückfahrt:</label>
                <input type="time" name="leave_dep" id="leave_dep" step="1" defaultValue={datetemplate?.Leave_dep}/>
            </FormBox>
            <FormBox>
                <label htmlFor="usergroup">Sichtbarkeit:</label>
                <select name="usergroup" id="usergroup">
                    {usergroups.map(usergroup => {
                        return(<option value={usergroup.Usergroup_ID} key={usergroup.Title}>{usergroup.Title}</option>)
                    })}
                </select>
            </FormBox>
            <div>
                <Button onClick={cancel}>Abbrechen</Button>
                <Button onClick={update}>Speichern</Button>
            </div>
        </Form>
    )
}

export default DateTemplates