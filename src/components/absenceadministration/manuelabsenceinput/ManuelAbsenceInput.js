import { useCallback, useEffect, useState } from "react"
import Button from "../../../modules/components/button/Button"
import Form from "../../../modules/components/form/Form"
import FormBox from "../../../modules/components/form/FormBox"
import { getMembers, newManualAbsence } from "../../../modules/data/DBConnect"
import { StyledManuelAbsenceInput } from "./ManuelAbsenceInput.styled"

const ManuelAbsenceInput = () => {

    const [members, setMembers] = useState(new Array(0))

    const fetchMembers = useCallback(async () => {
        let _members = await getMembers()
        setMembers(_members)
    }, [])

    const clear = (e) => {
        e.preventDefault()
        document.getElementById('absence_form').reset()
    }

    const save = async (e) => {
        e.preventDefault()
        
        let memberSelector = document.getElementById("member_select")
        
        let member_id = memberSelector.options[memberSelector.selectedIndex].value
        let from = document.getElementById("from").value
        let until = document.getElementById("until").value
        let info = document.getElementById("info").value

        await newManualAbsence(member_id, from, until, info)

        clear(e)
    }

    useEffect(() => {
        fetchMembers()
    }, [fetchMembers])

    return (
        <StyledManuelAbsenceInput>
            <Form id="absence_form">
                <FormBox>
                    <label htmlFor="member_select">Name:</label>
                    <select id="member_select">
                        {
                            members.map(member => {
                                return(<option value={member.Member_ID}>{member.Forename} {member.Surname}</option>)
                            })
                        }
                    </select>
                </FormBox>
                <FormBox>
                    <label htmlFor="from">Von:</label>
                    <input type="date" name="from" id="from"/>
                </FormBox>
                <FormBox>
                    <label htmlFor="until">Bis:</label>
                    <input type="date" name="until" id="until"/>
                </FormBox>
                <FormBox>
                    <label htmlFor="info">Bemerkung:</label>
                    <textarea name="info" id="info" cols="30" rows="3"></textarea>
                </FormBox>
                
                <div>
                    <Button onClick={clear}>Abbrechen</Button>
                    <Button onClick={save}>Speichern</Button>
                </div>
            </Form>
        </StyledManuelAbsenceInput>
    )
}

export default ManuelAbsenceInput