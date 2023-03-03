import { useCallback, useEffect } from "react"
import { useState } from "react"
import { Check, Deny } from "../../../icons/Icons"
import Button from "../../../modules/components/button/Button"
import { Table } from "../../../modules/components/overview/Table"
import { getAssociationAssignments, updateAssociationAssignments } from "../../../modules/data/DBConnect"
import { StyledAssociationAssignment, StyledMobileTableHeader, StyledTableHeader } from "./AssociationAssignment.styled"

const AssociationAssignment = () => {

    const [associationassignment, setAssociationassignment] = useState(new Array(0))
    const [changedAssignment, setChangedAssignment] = useState({})

    const fetchAssociationassignment = useCallback(async () => {
        getAssociationAssignments().then(assignments => {
            console.log(assignments)
            if(assignments !== undefined)
                setAssociationassignment(assignments)
        })
    }, [])

    const onClick = useCallback((member_id, association_id, assigned) => {
        let assign = {...changedAssignment}
        if(assign[`${member_id}`] === undefined)
            assign[`${member_id}`] = {}
        
        assign[`${member_id}`][`${association_id}`] = assigned

        setChangedAssignment(assign)
    }, [changedAssignment])

    const saveChanges = useCallback(() => {
        updateAssociationAssignments(changedAssignment)
    }, [changedAssignment])

    useEffect(() => {
        fetchAssociationassignment()
    }, [fetchAssociationassignment])

    return(<StyledAssociationAssignment>
        <Button onClick={saveChanges}>Speichern</Button>
        <Table>
            <thead>
                <tr>
                    <th>Name:</th>
                    {associationassignment[0]?.Associations.map(association => {
                        return(
                            <Header key={`h_${association.Association_ID}`} association={association}/>
                        )
                    })}
                </tr>
            </thead>
            <tbody>
                {associationassignment.map(member => {
                    return(
                        <tr key={member.Member_ID}>
                            <td>{member.Fullname}</td>
                            {member.Associations.map(association => {
                                return(
                                    <Assignment key={`${association.Association_ID}_${member.Member_ID}`} member_id={member.Member_ID} association_id={association.Association_ID} initial={association.Assigned} onClick={onClick}/>
                                )
                            })}
                        </tr>
                    )
                })}
            </tbody>
        </Table>
    </StyledAssociationAssignment>)
}

const Header = ({ association }) => {
    return (
        <>
            <StyledTableHeader>{association.Title}</StyledTableHeader>
            <StyledMobileTableHeader>{association.Association_ID}</StyledMobileTableHeader>
        </>
    )
}

const Assignment = ({ member_id, association_id, initial, onClick }) => {

    const [assigned, setAssigned] = useState(initial)

    const callback = useCallback(() => {
        let _assigned = !assigned
        setAssigned(_assigned)
        onClick(member_id, association_id, _assigned)
    }, [assigned, member_id, association_id, onClick])

    return (
        <AssignButton assigned={assigned} callback={callback}/>
    )
}

const AssignButton = ({ assigned, callback }) => {
    return(
        <td onClick={callback}>{assigned ? <Check /> : <Deny />}</td>
    )
}

export default AssociationAssignment