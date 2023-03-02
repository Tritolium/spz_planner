import { useCallback, useEffect } from "react"
import { useState } from "react"
import { getAssociationAssignments, updateAssociationAssignments } from "../../../modules/data/DBConnect"
import { StyledAssociationAssignment } from "./AssociationAssignment.styled"

const AssociationAssignment = () => {

    const [associationassignment, setAssociationassignment] = useState(new Array(0))
    const [changedAssignment, setChangedAssignment] = useState({})

    const fetchAssociationassignment = useCallback(async () => {
        getAssociationAssignments().then(assignments => {
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

    </StyledAssociationAssignment>)
}

export default AssociationAssignment