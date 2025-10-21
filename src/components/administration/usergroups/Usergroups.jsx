import { useCallback, useEffect, useState } from "react"
import Button from "../../../modules/components/button/Button"
import Form from "../../../modules/components/form/Form"
import FormBox from "../../../modules/components/form/FormBox"
import Selector from "../../../modules/components/form/Selector"
import SelectorItem from "../../../modules/components/form/SelectorItem"
import { deleteUsergroup, getAssociations, getUsergroups, newUsergroup, updateUsergroup } from "../../../modules/data/DBConnect"
import { StyledUsergroups } from "./Usergroups.styled"

const Usergroups = () => {

    const [usergroups, setUsergroups] = useState(new Array(0))
    const [associations, setAssociations] = useState(new Array(0))
    const [selected, setSelected] = useState(-1)

    const fetchUsergroups = useCallback(async () => {
        let _usergroups = await getUsergroups()
        if(_usergroups !== undefined)
            setUsergroups(_usergroups)
        else
            setUsergroups(new Array(0))
    }, [])

    const reload = useCallback(() => {
        setSelected(-1)
        fetchUsergroups()
    }, [fetchUsergroups])

    const onSelect = useCallback((id) => {
        setSelected(id)
    }, [])

    useEffect(() => {
        getUsergroups().then((usergroups) => {
            if(usergroups !== undefined)
                setUsergroups(usergroups)
            else
                setUsergroups(new Array(0))
        })
        getAssociations().then((associations) => {
            if(associations !== undefined)
                setAssociations(associations)
            else
                setAssociations(new Array(0))
        })
    }, [fetchUsergroups])

    return(
        <StyledUsergroups>
            <UsergroupSelector onSelect={onSelect} usergroups={usergroups}/>
            <UsergroupForm usergroup={usergroups.find((usergroup) => usergroup.Usergroup_ID === selected)} associations={associations} reload={reload}/>
        </StyledUsergroups>
    )
}

const UsergroupSelector = ({ usergroups, onSelect}) => {
    return(
        <Selector>
            {usergroups.map(usergroup => {
                return(<Usergroup onSelect={onSelect} key={usergroup.Title} usergroup={usergroup} />)
            })}
        </Selector>
    )
}

const Usergroup = ({ onSelect, usergroup}) => {

    const onClick = useCallback(() => {
        onSelect(usergroup.Usergroup_ID)
    }, [onSelect, usergroup.Usergroup_ID])

    return(
        <SelectorItem onClick={onClick}>
            {usergroup.Title}
        </SelectorItem>
    )
}

const UsergroupForm = ({ usergroup, associations, reload }) => {

    useEffect(() => {
        document.getElementById('usergroup_form').reset()
        document.getElementById('association').selectedIndex = associations?.findIndex(association => usergroup?.Association_ID === association.Association_ID)
        document.getElementById('admin').checked = usergroup?.Admin === "1"
        document.getElementById('moderator').checked = usergroup?.Moderator === "1"
    }, [usergroup, associations])

    const cancel = async (e) => {
        e.preventDefault()
        reload()
    }

    const update = async (e) => {
        e.preventDefault()

        let title       = document.getElementById('title').value
        let admin       = document.getElementById('admin').checked
        let moderator   = document.getElementById('moderator').checked
        let info        = document.getElementById('info').value
        let association = document.getElementById('association').options[document.getElementById('association').selectedIndex]?.value

        if (title === "") {
            alert("Bitte gib eine Bezeichnung ein!")
            return
        }

        if (association === undefined) {
            alert("Bitte wähl einen Verein aus!")
            return
        }

        if(usergroup !== undefined)
            await updateUsergroup(usergroup.Usergroup_ID, title, admin, moderator, info, association)
        else
            await newUsergroup(title, admin, moderator, info, association)

        reload()
    }

    const deleteUG = async (e) => {
        e.preventDefault()
        if(usergroup !== undefined)
            await deleteUsergroup(usergroup.Usergroup_ID)
        reload()
    }

    return(
        <Form id="usergroup_form">
            <FormBox>
                <label htmlFor="title">Bezeichnung:</label>
                <input type="text" name="title" id="title" defaultValue={usergroup?.Title}/>
            </FormBox>
            <FormBox>
                <label htmlFor="admin">Admin:</label>
                <input type="checkbox" name="admin" id="admin" defaultChecked={usergroup === undefined ? false : usergroup.Admin}/>
            </FormBox>
            <FormBox>
                <label htmlFor="moderator">Moderator:</label>
                <input type="checkbox" name="moderator" id="moderator" defaultChecked={usergroup === undefined ? false : usergroup.Moderator}/>
            </FormBox>
            <FormBox>
                <label htmlFor="info">Info:</label>
                <textarea name="info" id="info" cols="30" rows="3" defaultValue={usergroup === undefined ? "" : usergroup.Info}></textarea>
            </FormBox>
            <FormBox>
                <label htmlFor="association">Verein:</label>
                <select name="association" id="association">
                    {associations.map(association => {
                        return(<option key={association.Association_ID} value={association.Association_ID}>{association.Title}</option>)
                    })}
                </select>
            </FormBox>

            <div>
                <Button onClick={cancel}>Abbrechen</Button>
                <Button onClick={update}>Speichern</Button>
                <Button onClick={deleteUG}>Löschen</Button>
            </div>
        </Form>
    )
}

export default Usergroups