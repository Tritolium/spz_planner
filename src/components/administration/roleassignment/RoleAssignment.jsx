import { useCallback, useEffect, useState } from "react";
import Selector from "../../../modules/components/form/Selector";
import SelectorItem from "../../../modules/components/form/SelectorItem";
import { StyledRoleAssignment, StyledRoleAssignmentForm } from "./RoleAssignment.styled";
import { getAssociations, host } from "../../../modules/data/DBConnect";
import Filter from "../../../modules/components/Filter";
import Button from "../../../modules/components/button/Button";
import { hasPermission } from "../../../modules/helper/Permissions";

const RoleAssignment = () => {

    const [associations, setAssociations] = useState(new Array(0))
    const [members, setMembers] = useState(new Array(0))
    const [selected, setSelected] = useState(-1)

    const fetchAssociations = useCallback(async () => {
        let _associations = await getAssociations()
        if(_associations !== undefined)
            setAssociations(_associations)
        else
            setAssociations(new Array(0))
    }, [])

    const fetchMembers = useCallback(async () => {
        if (selected === -1) {
            return
        }

        fetch(`${host}/api/v0/member?association_id=${selected}&&api_token=${localStorage.getItem('api_token')}`)
            .then(response => response.json())
            .then(data => {
                setMembers(data)
            })
    }, [selected])

    const onSelect = (id) => {
        setSelected(id)
    }


    useEffect(() => {
        fetchAssociations()
        fetchMembers()
    }, [fetchAssociations, fetchMembers])

    return (
        <StyledRoleAssignment>
            <AssociationSelector onSelect={onSelect} associations={associations} />
            <RoleAssignEditor members={members} association={associations.find(assoc => assoc.Association_ID === selected)}/>
        </StyledRoleAssignment>
    )
}

const AssociationSelector = ({ associations, onSelect }) => {
    return (
        <Selector>
            {associations.map(association => {
                if(hasPermission(5, association.Association_ID)) // only show associations where the user has the permission to assign roles
                    return (<AssociationItem key={association.Title} association={association} onSelect={onSelect}/>)
                return (<></>)
            })}
        </Selector>
    )
}

const AssociationItem = ({ association, onSelect }) => {

    const onClick = useCallback(() => {
        onSelect(association.Association_ID)
    }, [onSelect, association.Association_ID])

    return (
        <SelectorItem onClick={onClick}>
            {association.Title}
        </SelectorItem>
    )
}

const RoleAssignEditor = ({ members, association }) => {

    const [selected, setSelected] = useState(-1)
    const [roles, setRoles] = useState(new Array(0))
    const [assignedRoles, setAssignedRoles] = useState(new Array(0))

    const options = [
        {
            value: -1,
            label: association !== undefined ? 'Mitglied auswählen' : "erst Verein auswählen"
        },
        ...members.map(member => {
        return {
            value: member.Member_ID,
            label: member.Forename + ' ' + member.Surname
        }
    })]

    const fetchRoles = useCallback(() => {
        fetch(`${host}/api/v0/roles?api_token=${localStorage.getItem('api_token')}`)
            .then(response => response.json())
            .then(data => {
                setRoles(data)
            })
    }, [])

    const onChange = useCallback((e) => {
        setSelected(parseInt(e.target.value))
        let roles = members.find(member => {
            return member.Member_ID === parseInt(e.target.value)
        })?.Roles

        if(roles !== undefined) {
            let assigned = roles[parseInt(association?.Association_ID)]
            if (assigned !== undefined)
                setAssignedRoles(assigned)
            else
                setAssignedRoles(new Array(0))
        } else
            setAssignedRoles(new Array(0))
    }, [members, association])

    const save = (e) => {
        e.preventDefault()
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked')
        const role_ids = Array.from(checkboxes).map(checkbox => parseInt(checkbox.value))
        fetch(`${host}/api/v0/roleassign/${selected}?api_token=${localStorage.getItem('api_token')}`, {
            method: 'PATCH',
            body: JSON.stringify({
                association_id: association.Association_ID,
                role_ids: role_ids
            })
        })
    }

    useEffect(() => {
        fetchRoles()
    }, [fetchRoles])

    const onRoleSelect = (e) => {
        let role_id = parseInt(e.target.value)
        if(e.target.checked) {
            setAssignedRoles([...assignedRoles, role_id])
        } else {
            setAssignedRoles(assignedRoles.filter(role => role !== role_id))
        }
    }

    return (
        <StyledRoleAssignmentForm>
            <Filter options={options} onChange={onChange}/>
            <h2>{association?.Title}</h2>
            <h3>{members.find(member => {
                return member.Member_ID === selected
            })?.Forename}</h3>
            <RoleSelector roles={roles} assignedRoles={assignedRoles} onSelect={onRoleSelect} />
            <Button onClick={save}>Speichern</Button>
        </StyledRoleAssignmentForm>
    )
}

const RoleSelector = ({ roles, assignedRoles, onSelect }) => {

    useEffect(() => {
        for (let role of roles) {
            document.getElementById(`role_${role.role_id}`).checked = assignedRoles?.includes(role.role_id)
        }
    }, [assignedRoles, roles])

    return (<>
        {roles.map(role => {
            return(<label key={role.role_id}>
                <input type="checkbox" id={`role_${role.role_id}`} value={role.role_id} onChange={onSelect}/>
                {role.role_name}
                </label>)
        })}
    </>)
}

export default RoleAssignment;