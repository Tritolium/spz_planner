import { useState } from "react"
import Selector from "../../../modules/components/form/Selector"
import SelectorItem from "../../../modules/components/form/SelectorItem"
import { StyledScores } from "./Scores.styled"

const Scores = () => {

    const [scores, setScores] = useState(new Array(0))

    return(<StyledScores>
        <ScoreSelector scores={scores}/>
        <ScoreForm />
    </StyledScores>)
}

const ScoreSelector = ({ scores, onSelect }) => {
    return(
        <Selector>
            {scores.map(score => {
                return(<Score onSelect={onSelect} key={score.Score_ID} score={score}/>)
            })}
        </Selector>
    )
}

const Score = ({ onSelect, score }) => {
    <SelectorItem>
        {score.Title}
    </SelectorItem>
}

const ScoreForm = ({ score, reload }) => {
    return(<>ScoreForm</>)
}

export default Scores