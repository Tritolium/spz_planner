import { useEffect, useState } from "react"
import { useCallback } from "react"
import Button from "../../../modules/components/button/Button"
import Form from "../../../modules/components/form/Form"
import FormBox from "../../../modules/components/form/FormBox"
import Selector from "../../../modules/components/form/Selector"
import SelectorItem from "../../../modules/components/form/SelectorItem"
import { getAssociations, getMembers, newAssociation, updateAssociation } from "../../../modules/data/DBConnect"
import { StyledAssociations } from "./Associations.styled"

const Associations = () => {

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
        let _members = await getMembers()
        if(_members !== undefined)
            setMembers(_members)
        else
            setMembers(new Array(0))
    }, [])

    const reload = useCallback(() => {
        setSelected(-1)
        fetchAssociations()
        fetchMembers()
    }, [fetchAssociations, fetchMembers])

    const onSelect = useCallback((id) => {
        setSelected(id)
    }, [])

    useEffect(() => {
        fetchAssociations()
        fetchMembers()
    }, [fetchAssociations, fetchMembers])

    return (
        <StyledAssociations>
            <AssociationSelector onSelect={onSelect} associations={associations}/>
            <AssociationForm association={associations.find((association) => association.Association_ID === selected)} members={members} reload={reload}/>
        </StyledAssociations>
    )
}

const AssociationSelector = ({ associations, onSelect}) => {
    return(
        <Selector>
            {associations.map(association => {
                return(<AssociationItem onSelect={onSelect} key={association.Title} association={association} />)
            })}
        </Selector>
    )
}

const AssociationItem = ({ association, onSelect }) => {

    const onClick = useCallback(() => {
        onSelect(association.Association_ID)
    }, [onSelect, association.Association_ID])

    return(
        <SelectorItem onClick={onClick}>
            {association.title}
        </SelectorItem>
    )
}

const AssociationForm = ({ association, members, reload }) => {

    const update = async (e) => {
        e.preventDefault()

        let title       = document.getElementById('title').value
        let firstchair  = document.getElementById('firstchair').options[document.getElementById('firstchair').selectedIndex].value
        let clerk       = document.getElementById('clerk').options[document.getElementById('clerk').selectedIndex].value
        let treasurer   = document.getElementById('treasurer').options[document.getElementById('treasurer').selectedIndex].value

        if(association !== undefined)
            await updateAssociation(association.Association_ID, title, firstchair, clerk, treasurer)
        else
            await newAssociation(title, firstchair, clerk, treasurer)
        
        reload()
    }

    const cancel = async (e) => {
        e.preventDefault()
        reload()
    }

    return(
        <Form id="association_form">
            <FormBox>
                <label htmlFor="title">Vereinsname:</label>
                <input type="text" name="title" id="title" defaultValue={association?.Title} />
            </FormBox>
            <FormBox>
                <label htmlFor="firstchair">Vorsitz:</label>
                <select id="firstchair">
                    {members.map(member => {
                        return(<option value={member.Member_ID}>{member.Forename} {member.Surname}</option>)
                    })}
                </select>  
            </FormBox>
            <FormBox>
                <label htmlFor="clerk">Schrift-/Geschäftsführer/-in:</label>
                <select id="clerk">
                    {members.map(member => {
                        return(<option value={member.Member_ID}>{member.Forename} {member.Surname}</option>)
                    })}
                </select>  
            </FormBox>
            <FormBox>
                <label htmlFor="treasurer">Kassierer/-in:</label>
                <select id="treasurer">
                    {members.map(member => {
                        return(<option value={member.Member_ID}>{member.Forename} {member.Surname}</option>)
                    })}
                </select>  
            </FormBox>

            <div>
                <Button onClick={cancel}>Abbrechen</Button>
                <Button onClick={update}>Speichern</Button>
            </div>
        </Form>
    )
}

export default Associations