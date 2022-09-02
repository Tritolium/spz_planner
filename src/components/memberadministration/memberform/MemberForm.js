import { useCallback, useEffect, useState } from "react"
import Button from "../../../modules/components/button/Button"
import Form from "../../../modules/components/form/Form"
import FormBox from "../../../modules/components/form/FormBox"
import Selector from "../../../modules/components/form/Selector"
import { getMembers, newMember, updateMember } from "../../../modules/data/DBConnect"
import { StyledMember, StyledMemberForm } from "./MemberForm.styled"

const MemberForm = () => {

    const [members, setMembers] = useState(new Array(0))
    const [selected, setSelected] = useState(-1)

    const fetchMembers = useCallback(async () => {
        let _members = await getMembers()
        if(_members !== undefined)
            setMembers(_members)
        else
            setMembers(new Array(0))
    }, [])

    const reload = useCallback(() => {
        setSelected(-1)
        fetchMembers()
    }, [fetchMembers])

    const onSelect = useCallback((id) => {
        setSelected(id)
    }, [])

    useEffect(() => {
        fetchMembers()
    }, [fetchMembers])

    return (
        <StyledMemberForm>
            <MemberSelector onSelect={onSelect} members={members}/>
            <DetailForm member={members.find((member) => member.Member_ID === selected)} reload={reload}/>
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

    useEffect(() => {
        document.getElementById('memberform_form').reset()
        document.getElementById('auth_level').selectedIndex = member?.Auth_level
    }, [member])

    const update = async (e) => {
        e.preventDefault()

        let forename = document.getElementById('forename').value
        let surname = document.getElementById('surname').value
        let auth_level = document.getElementById('auth_level').options[document.getElementById('auth_level').selectedIndex].value
        let nicknames = document.getElementById('nicknames').value
        let instrument = document.getElementById('instrument').value

        if(member !== undefined)
            updateMember(member.Member_ID, forename, surname, auth_level, nicknames, instrument)
        else
            newMember(forename, surname, auth_level, nicknames, instrument)

        reload()
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
            <div>
                <Button onClick={cancel}>Abbrechen</Button>
                <Button onClick={update}>Speichern</Button>
            </div>
        </Form>
    )
}

export default MemberForm