import { Fragment, useEffect, useState } from "react";
import Selector from "../../../modules/components/form/Selector";
import SelectorItem from "../../../modules/components/form/SelectorItem";
import { StyledRole, StyledRoleForm } from "./Roles.styled";
import { host } from "../../../modules/data/DBConnect";
import Button from "../../../modules/components/button/Button";

const Roles = () => {

    const [roles, setRoles] = useState(new Array(0))
    const [selected, setSelected] = useState(-1)

    const onReload = () => {
        fetchRoles()
    }

    const onSelect = (id) => {
        setSelected(id)
    }

    const fetchRoles = () => {
        fetch(`${host}/api/v0/roles?api_token=${localStorage.getItem('api_token')}`)
            .then(response => response.json())
            .then(data => {
                setRoles(data)
            })
    }

    useEffect(() => {
        fetchRoles()
    }, [])

    return(<StyledRole>
        <RoleSelector roles={roles} onSelect={onSelect} />
        <RoleForm role={roles.find((role) => role.role_id === selected)} onReload={onReload} />
    </StyledRole>)
}

const RoleSelector = ({ roles, onSelect }) => {
    return(
        <Selector>
            <RoleItem onSelect={onSelect} role={{role_id: -1, role_name: '*Neue Rolle'}} />
            {roles.map(role => {
                return(<RoleItem onSelect={onSelect} key={role.role_name} role={role} />)
            })}
        </Selector>
    )
}

const RoleItem = ({ role, onSelect }) => {
    return(
        <SelectorItem onClick={() => onSelect(role.role_id)}>
            {role.role_name}
        </SelectorItem>
    )
}

const RoleForm = ({ role, onReload }) => {

    const [permissions, setPermissions] = useState(new Array(0))

    const deleteRole = (e) => {
        e.preventDefault()

        if(role === undefined)
            return

        fetch(`${host}/api/v0/roles/${role.role_id}?api_token=${localStorage.getItem('api_token')}`, {
            method: 'DELETE'
        }).then(response => {
            if(response.ok)
                onReload()
            else if (response.status === 409)
                alert('Rolle kann nicht gelöscht werden, da ihr noch Benutzer zugeordnet.')
            else
                alert('Fehler beim Löschen der Rolle')
        })
    }
    
    const save = (e) => {

        let url = ''
        const data = {
            role_name: document.getElementById('roletitle').value,
            description: document.getElementById('roledescription').value,
            permissions: permissions.filter(permission => document.getElementById(permission.permission_name).checked).map(permission => permission.permission_id)
        }

        e.preventDefault()

        if(role === undefined)
            url = `${host}/api/v0/roles?api_token=${localStorage.getItem('api_token')}`
        else
            url = `${host}/api/v0/roles/${role.role_id}?api_token=${localStorage.getItem('api_token')}`
        
        fetch(url, {
            method: (role === undefined) ? 'POST' : 'PUT',
            body: JSON.stringify(data)
        }).then(() => {
            onReload()
        })
    }

    useEffect(() => {
        fetch(`${host}/api/v0/permissions?api_token=${localStorage.getItem('api_token')}`)
            .then(response => response.json())
            .then(data => {
                setPermissions(data)
            })
    }, [])

    useEffect(() => {
        if(role === undefined){
            // reset form
            document.getElementById('roletitle').value = ''
            document.getElementById('roledescription').value = ''
            permissions.forEach(permission => {
                document.getElementById(permission.permission_name).checked = false
            })
        } else {
            document.getElementById('roletitle').value = role.role_name
            document.getElementById('roledescription').value = role.description
            permissions.forEach(permission => {
                document.getElementById(permission.permission_name).checked = role.permissions.includes(permission.permission_id)
            })
        }
    }, [role, permissions])

    return(
        <StyledRoleForm>
            <label>Rolle:</label>
            <input type="text" id="roletitle" />
            <label>Beschreibung:</label>
            <textarea id="roledescription" />
            {permissions.map(permission => {
                return(
                    <Fragment key={permission.permission_name}>
                        <label>{permission.description}</label>
                        <input type="checkbox" id={permission.permission_name} defaultChecked={role?.permissions.includes(permission.permission_id)} />
                    </Fragment>
                )
            })}
            <Button onClick={save}>Speichern</Button>
            <Button onClick={deleteRole}>Löschen</Button>
        </StyledRoleForm>
    )
}

export default Roles;