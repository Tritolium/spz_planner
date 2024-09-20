import { useState } from "react"
import EvaluationInput from "./evaluationinput/EvaluationInput"
import HeaderMenu from "../../modules/components/headermenu/HeaderMenu"
import Button from "../../modules/components/button/Button"
import EvaluationOverview from "./overview/EvaluationOverview"
import { StyledEvaluation } from "./Evaluation.styled"
import EvaluationPersonal from "./personal/EvaluationPersonal"

const Evaluation = ({ theme }) => {

    const [view, setView] = useState(0)

    const labels = [
        "Meine Übersicht",
        "Übersicht",
        "Auswertung"
    ]

    const navigate = (e) => {
        let button_id = e.target.id.split('_')[2]
        setView(parseInt(button_id))
    }

    return (
        <StyledEvaluation>
            <HeaderMenu>
                {labels.map((label, index) => {
                    return <Button key={index} id={`evaluation_button_${index}`} onClick={navigate} theme={theme}>{label}</Button>
                })}
            </HeaderMenu>
            <View view={view} theme={theme} />
        </StyledEvaluation>
    )
}

const View = ({ view, theme }) => {

    const components = {
        0: <EvaluationPersonal theme={theme} />,
        1: <EvaluationOverview theme={theme} />,
        2: <EvaluationInput theme={theme} />
    }

    return components[view] || <EvaluationInput theme={theme} />
}

export default Evaluation