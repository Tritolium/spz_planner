import { StyledForm, StyledAbsenceForm, StyledSelector } from "./AbsenceForm.styled"

const AbsenceForm = () => {
    return(
        <StyledAbsenceForm>
            <Selector />
            <Form />
        </StyledAbsenceForm>
    )
}

const Selector = () => {
    return(
        <StyledSelector>Selector</StyledSelector>
    )
}

const Form = () => {
    return(
        <StyledForm>Formular</StyledForm>
    )
}

export default AbsenceForm