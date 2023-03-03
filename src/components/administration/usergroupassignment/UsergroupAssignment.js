import { useCallback, useEffect, useState } from "react"
import { Table } from "../../../modules/components/overview/Table"
import { getUsergroupAssignments, updateUsergroupAssignments } from "../../../modules/data/DBConnect"
import { StyledMobileTableHeader, StyledTableHeader, StyledUsergroupAssignment, StyledUsergroupLegend } from "./UsergroupAssignment.styled"

import Button from "../../../modules/components/button/Button"
import { Check, Deny } from "../../../icons/Icons"

const UsergroupAssignment = () => {

    const [usergroupassignment, setUsergroupassignment] = useState(new Array(0))
    const [changedAssignment, setChangedAssignment] = useState({})

    const fetchUsergroupassignment = useCallback(async () => {
        let _usergroupassignment = await getUsergroupAssignments()
        if(_usergroupassignment !== undefined)
            setUsergroupassignment(_usergroupassignment)
        else
            setUsergroupassignment(new Array(0))
    }, [])

    const onClick = useCallback((member_id, usergroup_id, assigned) => {
        let assign = {...changedAssignment}
        if(assign[`${member_id}`] === undefined)
            assign[`${member_id}`] = {}
        
        assign[`${member_id}`][`${usergroup_id}`] = assigned

        setChangedAssignment(assign)
    }, [changedAssignment])

    const saveChanges = useCallback(() => {
        updateUsergroupAssignments(changedAssignment)
    }, [changedAssignment])

    useEffect(() => {
        fetchUsergroupassignment()
    }, [fetchUsergroupassignment])

    return(
        <StyledUsergroupAssignment>
            <Button onClick={saveChanges}>Speichern</Button>
            <Table>
                <thead>
                    <tr>
                        <th>Name:</th>
                        {usergroupassignment[0]?.Usergroups.map(usergroup => {
                            return(
                                <Header key={`h_${usergroup.Usergroup_ID}`} usergroup={usergroup} />
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {usergroupassignment.map(user => {
                        return (
                            <tr key={user.Member_ID}>
                                <td>{user.Fullname}</td>
                                {user.Usergroups.map(usergroup => {
                                    return(
                                        <Assignment key={`${usergroup.Usergroup_ID}_${user.Member_ID}`} member_id={user.Member_ID} usergroup_id={usergroup.Usergroup_ID} initial={usergroup.Assigned} onClick={onClick}/>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            <UsergroupLegend usergroups={usergroupassignment[0]?.Usergroups}/>
        </StyledUsergroupAssignment>
    )
}

const Header = ({ usergroup }) => {
    return (
        <>
            <StyledTableHeader>{usergroup.Title}</StyledTableHeader>
            <StyledMobileTableHeader>{usergroup.Usergroup_ID}</StyledMobileTableHeader>
        </>
    )
}

const Assignment = ({ member_id, usergroup_id, initial, onClick }) => {

    const [assigned, setAssigned] = useState(initial)

    const callback = useCallback(() => {
        let _assigned = !assigned
        setAssigned(_assigned)
        onClick(member_id, usergroup_id, _assigned)
    }, [assigned, member_id, usergroup_id, onClick])

    return (
        <AssignButton assigned={assigned} callback={callback}/>
    )
}

const AssignButton = ({ assigned, callback }) => {
    return(
        <td onClick={callback}>{assigned ? <Check /> : <Deny />}</td>
    )
}

const UsergroupLegend = ({ usergroups }) => {
    return(
        <StyledUsergroupLegend>
            {usergroups?.map(usergroup => {
                return(<div key={`${usergroup.Usergroup_ID}_legend`}>{usergroup.Usergroup_ID}: {usergroup.Title}</div>)
            })}
        </StyledUsergroupLegend>
    )
}

export default UsergroupAssignment