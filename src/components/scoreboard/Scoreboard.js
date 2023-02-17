import { useCallback, useEffect, useState } from "react"
import Selector from "../../modules/components/form/Selector"
import SelectorItem from "../../modules/components/form/SelectorItem"
import { getScores } from "../../modules/data/DBConnect"
import { StyledScoreboard } from "./Scoreboard.styled"

const Scoreboard = () => {
    const [scores, setScores] = useState(new Array(0))
    const [selected, setSelected] = useState(-1)
    
    const fetchScores = useCallback(async () => {
        let scores = await getScores()
        if(scores !== undefined)
            setScores(scores)
        else
            setScores(new Array(0))
    }, [])

    const onSelect = useCallback((id) => {
        setSelected(id)
    }, [])

    useEffect(() => {
        fetchScores()
    }, [fetchScores])

    return(<StyledScoreboard>
        <ScoreSelector scores={scores} onSelect={onSelect}/>
        <ScoreFrame score={scores.find((score) => score.Score_ID === selected)}/>
    </StyledScoreboard>)
}

const ScoreSelector = ({ scores, onSelect }) => {

    const [search, setSearch] = useState("")

    const searchChanged = (e) => {
        setSearch(e.target.value.toLowerCase())
    }

    return(
        <Selector>
            <input type="text" onChange={searchChanged}></input>
            {scores
            .filter(score => {
                return score.Title.toLowerCase().includes(search)
            })
            .map(score => {
                return(<Score onSelect={onSelect} key={score.Score_ID} score={score}/>)
            })}
        </Selector>
    )
}

const Score = ({ onSelect, score }) => {

    const onClick = useCallback(() => {
        onSelect(score.Score_ID)
    }, [onSelect, score])

    return(<SelectorItem onClick={onClick}>
        {score.Title}
    </SelectorItem>)
}

const ScoreFrame = ({ score }) => {
    return(<div>
        {score?.Link ? <a href={score?.Link} target="_blank" rel="noreferrer">In neuem Fenster anzeigen</a> : <></>}
        {score?.Link ? <iframe title="score_view" src={score.Link}></iframe> : <></>}
    </div>)
}

export default Scoreboard