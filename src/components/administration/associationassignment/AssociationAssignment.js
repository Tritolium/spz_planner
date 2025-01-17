import { useCallback, useEffect } from "react"
import { useState } from "react"
import Button from "../../../modules/components/button/Button"
import { getAssociationAssignments, getAssociations, host } from "../../../modules/data/DBConnect"
import { StyledAssociationAssignment } from "./AssociationAssignment.styled"
import Selector from "../../../modules/components/form/Selector"
import SelectorItem from "../../../modules/components/form/SelectorItem"
import Form from "../../../modules/components/form/Form"

const AssociationAssignment = () => {

    const [associations, setAssociations] = useState(new Array(0))
    const [members, setMembers] = useState(new Array(0))
    const [selected, setSelected] = useState(-1)

    const [associationassignment, setAssociationassignment] = useState(new Array(0))

    const fetchAssociationassignment = useCallback(async () => {
        getAssociationAssignments().then(assignments => {
            if(assignments !== undefined)
                setAssociationassignment(assignments)
        })
    }, [])

    const fetchAssociations = useCallback(async () => {
        let _associations = await getAssociations()
        if(_associations !== undefined)
            setAssociations(_associations)
        else
            setAssociations(new Array(0))
    }, [])

    const fetchMembers = useCallback(async () => {
        fetch(`${host}/api/v0/member?api_token=${localStorage.getItem('api_token')}`)
            .then(response => response.json())
            .then(data => {
                setMembers(data)
            })
    }, [])

    const onSelect = useCallback((id) => {
        setSelected(id)
    }, [])

    useEffect(() => {
        fetchAssociations()
        fetchAssociationassignment()
        fetchMembers()
    }, [fetchAssociations, fetchAssociationassignment, fetchMembers])

    return(<StyledAssociationAssignment>
        <MemberSelector members={members} onSelect={onSelect} selected={selected} />
        <AssociationAssignEditor associations={associations} member={associationassignment.find(member => member.Member_ID === selected)}/>
    </StyledAssociationAssignment>)
}

const MemberSelector = ({ members, onSelect, selected }) => {
    return (
        <Selector>
            {members.map(member => {
                return (
                    <MemberItem key={member.Member_ID} member={member} onSelect={onSelect} selected={member.Member_ID === selected} />
                )
            })}
        </Selector>
    )
}

const MemberItem = ({ member, onSelect, selected }) => {

    const onClick = useCallback(() => {
        onSelect(member.Member_ID)
    }, [onSelect, member.Member_ID])

    return (
        <SelectorItem className={selected ? "selected" : ""} onClick={onClick}>
            {member.Forename} {member.Surname}
        </SelectorItem>
    )
}

const AssociationAssignEditor = ({ associations, member }) => {

    const save = useCallback((e) => {
        e.preventDefault()

        let assignments = {}

        for (let i = 0; i < associations.length; i++) {
            let assign = document.getElementById(`assign_${associations[i].Association_ID}`).checked
            let instrument = document.getElementById(`instrument_${associations[i].Association_ID}`).value
            assignments[associations[i].Association_ID] = { assign, instrument }
        }

        fetch(`${host}/api/v0/member/${member.Member_ID}/associationassignment?api_token=${localStorage.getItem('api_token')}`, {
            method: 'PUT',
            body: JSON.stringify(assignments)
        })
    }, [associations, member])

    useEffect(() => {
        for (let i = 0; i < associations.length; i++) {
            document.getElementById(`assign_${associations[i].Association_ID}`).checked = member?.Associations.find(assoc => assoc.Association_ID === associations[i].Association_ID).Assigned
            document.getElementById(`instrument_${associations[i].Association_ID}`).value = member?.Associations.find(assoc => assoc.Association_ID === associations[i].Association_ID).Instrument
        }
    }, [associations, member])
            

    return (<>
        <Form onSubmit={() => {}}>
            {associations.map(association => {
                return (<>
                    <label>{association.Title}</label>
                    <input id={`assign_${association.Association_ID}`} type="checkbox" defaultChecked={member?.Associations.find(assoc => assoc.Association_ID === association.Association_ID).Assigned}/>
                    <input id={`instrument_${association.Association_ID}`} type="text" defaultValue={member?.Associations.find(assoc => assoc.Association_ID === association.Association_ID).Instrument}/>
                </>)
            })}
            <Button onClick={save}>Speichern</Button>
        </Form>
    </>)
}

export default AssociationAssignment