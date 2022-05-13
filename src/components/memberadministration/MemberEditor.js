import { useState, useEffect, useCallback } from "react"
import styled from "styled-components"

import { getMember, getMembers, updateMember } from "../../modules/data/DBConnect"

const MemberEditor = (props) => {

    const [members, setMembers] = useState(new Array(0))
    const [selected, setSelected] = useState(0)

    useEffect(() => {
        const fetchMembers = async () => {
            let _members = await getMembers()
            setMembers(_members)
        }
        fetchMembers()
    }, [])

    const onSelect = useCallback((id) => {
        setSelected(id)
    }, [])

    return(
        <div className={props.className}>
            <StyledMemberSelector onSelect={onSelect} members={members}/>
            <StyledEditor selected={selected}/>
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

    return(
        <div className={props.className}>
            {props.members.map(member => {
                return(<StyledMember onSelect={onSelect} key={member.Member_ID} member={member}/>)
            })}
        </div>
    )
}

const StyledMemberSelector = styled(MemberSelector)`
    display: flex;
    flex-direction: column;
    border: 1px solid black;
    height: 100%;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
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
    &:hover{
        background: lightgrey;
    }
`

const Editor = (props) => {
    
    const [member, setMember] = useState({
        Forename: "",
        Surname: "",

    })

    useEffect(() => {
        const fetchMember = async () => {
            let _member = await getMember(props.selected)
            if(_member !== undefined)
                setMember(_member)
        }
        fetchMember()
    }, [props.selected])

    const onSubmit = (e) => {
        e.preventDefault()
        let _member = {Member_ID: member.Member_ID, Forename: "", Surname: "", Auth_Level: -1, Nicknames: ""}
        _member.Forename = document.getElementById("fname").value
        _member.Surname = document.getElementById("sname").value
        _member.Auth_Level = document.getElementById("auth").value
        _member.Nicknames = document.getElementById("nick").value

        updateMember(_member)
    }

    return(
        <div className={props.className}>
            <form onSubmit={onSubmit}>
                <label htmlFor="fname" >Vorname:</label>
                <input type="text" id="fname" defaultValue={member.Forename}/>
                <label htmlFor="sname">Nachname:</label>
                <input type="text" id="sname" defaultValue={member.Surname}/>
                <label htmlFor="auth">Level:</label>
                <input type="text" id="auth" defaultValue={member.Auth_Level}/>
                <label htmlFor="nick">Kurz:</label>
                <input type="text" id="nick" defaultValue={member.Nicknames}/>
                <button>Speichern</button>
            </form>
        </div>
    )
}

const StyledEditor = styled(Editor)`
    
`

export default StyledMemberEditor