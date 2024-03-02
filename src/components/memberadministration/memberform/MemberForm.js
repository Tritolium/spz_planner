import { useCallback, useEffect, useState } from "react"
import Button from "../../../modules/components/button/Button"
import Form from "../../../modules/components/form/Form"
import FormBox from "../../../modules/components/form/FormBox"
import Selector from "../../../modules/components/form/Selector"
import { host, updateMember } from "../../../modules/data/DBConnect"
import { StyledMember, StyledMemberForm } from "./MemberForm.styled"

const MemberForm = ({ members, reload }) => {
    const [member, setMember] = useState()

    const reloadMembers = useCallback(() => {
        setMember({})
        reload()
    }, [reload])

    const onSelect = useCallback((id) => {
        fetch(`${host}/api/v0/member/${id}?api_token=${localStorage.getItem('api_token')}`)
            .then(response => response.json())
            .then(data => {
                setMember(data)
            })
    }, [])

    return (
        <StyledMemberForm>
            <MemberSelector onSelect={onSelect} members={members}/>
            <DetailForm member={member} reload={reloadMembers}/>
        </StyledMemberForm>
    )
}

const MemberSelector = ({members, onSelect}) => {
    return (
        <Selector>
            {members.map(member => {
                return(<Member onSelect={onSelect} key={member.Member_ID} member={member}/>)
            })}
        </Selector>
    )
}

const Member = ({member, onSelect}) => {

    const onClick = useCallback(() => {
        onSelect(member.Member_ID)
    }, [onSelect, member.Member_ID])

    return (
        <StyledMember onClick={onClick}>
            {member.Surname}, {member.Forename}
        </StyledMember>
    )
}

const DetailForm = ({member, reload}) => {

    const [changedUsergroups, setChangedUsergroups] = useState({})

    useEffect(() => {
        document.getElementById('memberform_form').reset()
        document.getElementById('auth_level').selectedIndex = member?.Auth_level
        setChangedUsergroups({})
    }, [member])

    const update = async (e) => {
        e.preventDefault()

        let forename = document.getElementById('forename').value
        let surname = document.getElementById('surname').value
        let auth_level = document.getElementById('auth_level').options[document.getElementById('auth_level').selectedIndex].value
        let nicknames = document.getElementById('nicknames').value
        let instrument = document.getElementById('instrument').value
        let birthdate = document.getElementById('birthdate').value

        if(member !== undefined)
            await updateMember(member.Member_ID, forename, surname, auth_level, nicknames, instrument, birthdate, changedUsergroups)
        else {
            fetch(`${host}/api/v0/member?api_token=${localStorage.getItem('api_token')}`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        Forename: forename,
                        Surname: surname,
                        Auth_level: auth_level,
                        Nicknames: nicknames,
                        Birthdate: birthdate
                    })
                })
                .then(response => {
                    if(response.status === 201)
                        reload()
                    else {
                        alert('Fehler beim Speichern')
                    }
                })
        }
    }

    const cancel = async (e) => {
        e.preventDefault()
        reload()
    }

    return (
        <Form id="memberform_form">
            <FormBox>
                <label htmlFor="forename">Vorname:</label>
                <input type="text" name="forename" id="forename" defaultValue={member?.Forename}/>
            </FormBox>
            <FormBox>
                <label htmlFor="surname">Nachname:</label>
                <input type="text" name="surname" id="surname" defaultValue={member?.Surname}/>
            </FormBox>
            <FormBox>
                <label htmlFor="auth_level">Zugriffslevel:</label>
                <select name="auth_level" id="auth_level">
                    <option value="0">ohne</option>
                    <option value="1">Mitglied</option>
                    <option value="2">Vorstand</option>
                    <option value="3">Admin</option>
                </select>
            </FormBox>
            <FormBox>
                <label htmlFor="nicknames">Kurz:</label>
                <input type="text" name="nicknames" id="nicknames" defaultValue={member?.Nicknames}/>
            </FormBox>
            <FormBox>
                <label htmlFor="instrument">Instrument:</label>
                <input type="text" name="instrument" id="instrument" defaultValue={member?.Instrument}/>
            </FormBox>
            <FormBox>
                <label htmlFor="birthdate">Geburtstag:</label>
                <input type="date" id="birthdate" defaultValue={member?.Birthdate}/>
            </FormBox>
            <div>
                <Button onClick={cancel}>Abbrechen</Button>
                <Button onClick={update}>Speichern</Button>
            </div>
        </Form>
    )
}

export default MemberForm