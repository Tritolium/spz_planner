import { useState, useEffect, useCallback } from "react"
import styled from "styled-components"

import { getMember, getMembers, newMember, updateMember } from "../../modules/data/DBConnect"
import { formtheme } from "../Themes"

const MemberEditor = (props) => {

    const [members, setMembers] = useState(new Array(0))
    const [selected, setSelected] = useState(-1)
    
    const fetchMembers = async () => {
        let _members = await getMembers()
        setMembers(_members)
    }

    useEffect(() => {
        fetchMembers()
    }, [])

    const onSelect = useCallback((id) => {
        setSelected(id)
    }, [])

    const reload = useCallback(() => {
        fetchMembers()
    }, [])

    return(
        <div className={props.className}>
            <StyledMemberSelector onSelect={onSelect} members={members}/>
            <StyledEditor selected={selected} reload={reload}/>
        </div>
    )
}

const StyledMemberEditor = styled(MemberEditor)`
    position: relative;
    width: 100%;
    display: flex;
`

const MemberSelector = (props) => {

    const onSelect = useCallback((id) => {
        props.onSelect(id)
    }, [props])

    const background = [
        "White",
        "Chartreuse",
        "ForestGreen",
        "DarkGreen"
    ]

    return(
        <div className={props.className}>
            {props.members.map(member => {
                return(<StyledMember background={background[member.Auth_level]} onSelect={onSelect} key={member.Member_ID} member={member}/>)
            })}
        </div>
    )
}

const StyledMemberSelector = styled(MemberSelector)`
    display: flex;
    flex-direction: column;
    border: 1px solid black;
    max-height: 100%;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    overflow-y: scroll;
    white-space: nowrap;
    overflow-x: none;
    width: auto;
    min-width: fit-content;
`

const Member = (props) => {

    let Forename = props.member.Forename
    let Surname = props.member.Surname

    const onSelect = useCallback(() => {
        props.onSelect(props.member.Member_ID)
    }, [props])

    return (
        <div onClick={onSelect} className={props.className}>{Surname}, {Forename}</div>
    )
}

const StyledMember = styled(Member)`
    background: ${props => props.background};
    wrap: no-wrap;
    &:hover{
        background: lightgrey;
    }
`

const Editor = (props) => {
    
    const [member, setMember] = useState({
        Member_ID: -1,
        Forename: "",
        Surname: "",
        Auth_level: 0
    })

    useEffect(() => {
        const fetchMember = async () => {
            let _member = await getMember(props.selected)
            if(_member !== undefined)
                setMember(_member)
        }
        fetchMember()
    }, [props.selected])

    useEffect(() => {
        document.getElementById("membereditor").reset()
        document.getElementById("auth").selectedIndex = member.Auth_level
    }, [member])

    const onSubmit = async(e) => {
        e.preventDefault()
        let _member = {Member_ID: member.Member_ID, Forename: "", Surname: "", Auth_level: -1, Nicknames: ""}
        _member.Forename = document.getElementById("fname").value
        _member.Surname = document.getElementById("sname").value
        _member.Auth_level = document.getElementById("auth").options[document.getElementById("auth").selectedIndex].value
        _member.Nicknames = document.getElementById("nick").value

        if(_member.Member_ID > 0){
            await updateMember(_member)    
        }

        props.reload()        
    }

    const createNew = async(e) => {
        e.preventDefault()
        let _member = {
            Forename: document.getElementById("fname").value,
            Surname: document.getElementById("sname").value,
            Auth_level: document.getElementById("auth").options[document.getElementById("auth").selectedIndex].value,
            Nicknames: document.getElementById("nick").value
        }
        await newMember(_member)
        props.reload()
    }

    const clear = () => {
        setMember({
            Member_ID: -1,
            Forename: "",
            Surname: "",
            Auth_level: 0,
            Nicknames: ""
        })
    }

    return(
        <EditorWrapper>
            <Navigation>
                <div>Stammdaten</div>
                <div>Stimmen</div>
            </Navigation>
            <Form theme={formtheme} onSubmit={onSubmit} id="membereditor">
                <FormBox>
                    <Label>
                        <label htmlFor="fname" >Vorname:</label>
                    </Label>
                    <InputContainer>
                        <input type="text" id="fname" defaultValue={member.Forename}/>
                    </InputContainer>
                </FormBox>
                <FormBox>
                    <Label>
                        <label htmlFor="sname">Nachname:</label>
                    </Label>
                    <InputContainer>
                        <input type="text" id="sname" defaultValue={member.Surname}/>
                    </InputContainer>
                </FormBox>
                <FormBox>
                    <Label>
                        <label htmlFor="auth">Level:</label>
                    </Label>
                    <InputContainer>
                        <select name="auth" id="auth">
                            <option value="0">ohne</option>
                            <option value="1">Mitglied</option>
                            <option value="2">Moderator</option>
                            <option value="3">Admin</option>
                        </select>
                    </InputContainer>
                </FormBox>
                <FormBox>
                    <Label>
                        <label htmlFor="nick">Kurz:</label>
                    </Label>
                    <InputContainer>
                        <input type="text" id="nick" defaultValue={member.Nicknames}/>
                    </InputContainer>
                </FormBox>
                <FormBox>
                    <InputContainer>
                        <button type="submit">Speichern</button>
                        <button onClick={createNew}>Neu anlegen</button>
                        <button onClick={clear}>Felder leeren</button>
                    </InputContainer>
                </FormBox>
            </Form>
        </EditorWrapper>
    )
}

const EditorWrapper = styled.div`
    width: 100%;
`

const Navigation = styled.nav`
    position: relative;
`

const StyledEditor = styled(Editor)`
    
`

const Label = styled.div``
const InputContainer = styled.div``
const FormBox = styled.div``

const Form = styled.form`

    margin: ${props => props.theme.margin};
    width: 100%;

    input[type=submit], button {
        background-color: ${props => props.theme.secondary};
        color: ${props => props.theme.main};
        padding: ${props => props.theme.padding};
        margin: ${props => props.theme.input_margin};
        border: none;
        border-radius: 3px;
        cursor: pointer;
        float: right;
    }

    input[type=text], select {
        color: ${props => props.theme.main};
        width: 100%;
        padding: ${props => props.theme.padding};
        border: 1px solid ${props => props.theme.secondary};
        border-radius: 3px;
        box-sizing: border-box;
        resize: vertical;
        margin: 1px 1px 1px 1px;
    }

    label {
        color: ${props => props.theme.main};
        padding: ${props => props.theme.padding};
        display: inline-block;
    }

    ${Label}{
        float: left;
        width: 25%;
        min-width: 80px;
        margin-top: 3px;
    }

    ${InputContainer}{
        float: left;
        width: 75%;
        margin-top: 3px;
    }

    ${FormBox}:after{
        content: "";
        display: table;
        clear: both;
    }
`

export default StyledMemberEditor