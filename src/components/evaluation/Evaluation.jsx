import { useState } from "react"
import EvaluationInput from "./evaluationinput/EvaluationInput"
import HeaderMenu from "../../modules/components/headermenu/HeaderMenu"
import Button from "../../modules/components/button/Button"
import EvaluationOverview from "./overview/EvaluationOverview"
import { StyledEvaluation } from "./Evaluation.styled"
import EvaluationPersonal from "./personal/EvaluationPersonal"
import { hasPermission } from "../../modules/helper/Permissions"

const Evaluation = ({ theme }) => {

    const [view, setView] = useState(0)

    const buttons = [
        { id: 'evaluation_button_0', label: "Meine Übersicht", permitted: true },
        { id: 'evaluation_button_1', label: "Übersicht", permitted: hasPermission(8) },
        { id: 'evaluation_button_2', label: "Auswertung", permitted: hasPermission(9) }
    ]

    const navigate = (e) => {
        let button_id = e.target.id.split('_')[2]
        setView(parseInt(button_id))
    }

    return (
        <StyledEvaluation>
            <HeaderMenu>
                {buttons.map(({ id, label, permitted }) => {
                    return permitted &&
                        <Button key={id} id={id} onClick={navigate} theme={theme}>{label}</Button>
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