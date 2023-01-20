import { useEffect, useState } from "react"
import { useCallback } from "react"
import Form from "../../../modules/components/form/Form"
import Selector from "../../../modules/components/form/Selector"
import SelectorItem from "../../../modules/components/form/SelectorItem"
import { getAssociations } from "../../../modules/data/DBConnect"
import { StyledAssociations } from "./Associations.styled"

const Associations = () => {

    const [associations, setAssociations] = useState(new Array(0))
    const [selected, setSelected] = useState(-1)

    const fetchAssociations = useCallback(async () => {
        let _associations = await getAssociations()
        if(_associations !== undefined)
            setAssociations(_associations)
        else
            setAssociations(new Array(0))
    }, [])

    const reload = useCallback(() => {
        setSelected(-1)
        fetchAssociations()
    }, [fetchAssociations])

    const onSelect = useCallback((id) => {
        setSelected(id)
    }, [])

    useEffect(() => {
        fetchAssociations()
    }, [fetchAssociations])

    return (
        <StyledAssociations>
            <AssociationSelector onSelect={onSelect} associations={associations}/>
            <AssociationForm association={associations.find((association) => association.Association_ID === selected)} reload={reload}/>
        </StyledAssociations>
    )
}

const AssociationSelector = ({ associations, onSelect}) => {
    return(
        <Selector>
            {associations.map(association => {
                return(<AssociationItem onSelect={onSelect} key={association.Title} association={association} />)
            })

            }
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

const AssociationForm = () => {
    return(
        <Form id="association_form">

        </Form>
    )
}

export default Associations