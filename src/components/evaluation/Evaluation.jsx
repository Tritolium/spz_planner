import { useState } from "react"
import EvaluationInput from "./evaluationinput/EvaluationInput"
import HeaderMenu from "../../modules/components/headermenu/HeaderMenu"
import Button from "../../modules/components/button/Button"
import EvaluationOverview from "./overview/EvaluationOverview"
import { StyledEvaluation } from "./Evaluation.styled"

const Evaluation = ({ theme }) => {

    const [view, setView] = useState(0)

    const navigate = (e) => {
        switch (e.target.id) {
        default:
        case 'eval_button_0':
            setView(0)
            break
        case 'eval_button_1':
            setView(1)
            break
        }
    }

    return (
        <StyledEvaluation>
            <HeaderMenu>
                <Button id='eval_button_0' onClick={navigate} theme={theme}>Auswertung</Button>
                <Button id='eval_button_1' onClick={navigate} theme={theme}>Übersicht</Button>
            </HeaderMenu>
            <View view={view} theme={theme} />
        </StyledEvaluation>
    )
}

const View = ({ view, theme }) => {
    switch (view) {
    default:
    case 0:
        return <EvaluationInput theme={theme} />
    case 1:
        return <EvaluationOverview theme={theme} />
    }
}

export default Evaluation