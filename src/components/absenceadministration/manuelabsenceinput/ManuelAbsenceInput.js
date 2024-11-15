import { useCallback, useEffect, useState } from "react"
import Button from "../../../modules/components/button/Button"
import Form from "../../../modules/components/form/Form"
import FormBox from "../../../modules/components/form/FormBox"
import { host, newManualAbsence } from "../../../modules/data/DBConnect"
import { StyledManuelAbsenceInput } from "./ManuelAbsenceInput.styled"

const ManuelAbsenceInput = () => {

    const [members, setMembers] = useState(new Array(0))

    const fetchMembers = useCallback(async () => {
        fetch(`${host}/api/v0/member?api_token=${localStorage.getItem('api_token')}`)
            .then(response => response.json())
            .then(data => {
                setMembers(data)
            }, () => {
                setMembers(new Array(0))
            })
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
                                return(<option key={`member_${member.Member_ID}`} value={member.Member_ID}>{member.Forename} {member.Surname}</option>)
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