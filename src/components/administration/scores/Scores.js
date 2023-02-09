import { useCallback, useEffect, useState } from "react"
import Button from "../../../modules/components/button/Button"
import Form from "../../../modules/components/form/Form"
import FormBox from "../../../modules/components/form/FormBox"
import Selector from "../../../modules/components/form/Selector"
import SelectorItem from "../../../modules/components/form/SelectorItem"
import { deleteScore, getScores, newScore, updateScore } from "../../../modules/data/DBConnect"
import { StyledScores } from "./Scores.styled"

const Scores = () => {

    const [scores, setScores] = useState(new Array(0))
    const [selected, setSelected] = useState(-1)
    
    const fetchScores = useCallback(async () => {
        let scores = await getScores()
        if(scores !== undefined)
            setScores(scores)
        else
            setScores(new Array(0))
    }, [])

    const reload = useCallback(() => {
        setSelected(-1)
        fetchScores()
    }, [fetchScores])

    const onSelect = useCallback((id) => {
        setSelected(id)
    }, [])

    useEffect(() => {
        fetchScores()
    }, [fetchScores])

    return(<StyledScores>
        <ScoreSelector scores={scores} onSelect={onSelect}/>
        <ScoreForm score={scores.find((score) => score.Score_ID === selected)} reload={reload}/>
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

    const onClick = useCallback(() => {
        onSelect(score.Score_ID)
    }, [onSelect, score])

    return(<SelectorItem onClick={onClick}>
        {score.Title}
    </SelectorItem>)
}

const ScoreForm = ({ score, reload }) => {

    useEffect(() => {
        document.getElementById('score_form').reset()
    }, [score])

    const cancel = (e) => {
        e.preventDefault()
        reload()
    }

    const update = async (e) => {
        e.preventDefault()

        let title = document.getElementById('title').value
        let link = document.getElementById('link').value

        if(score !== undefined)
            await updateScore(score.Score_ID, title, link)
        else
            newScore(title, link)
        reload()
    }

    const deleteSC = async (e) => {
        e.preventDefault()
        if(score !== undefined)
            await deleteScore(score.Score_ID)
        reload()
    }

    return(<Form id="score_form">
        <FormBox>
            <label htmlFor="title">Name:</label>
            <input type="text" name="title" id="title" defaultValue={score?.Title} />
        </FormBox>
        <FormBox>
            <label htmlFor="link">Link:</label>
            <input type="url" name="link" id="link" defaultValue={score?.Link} />
        </FormBox>
        <iframe title="score_view" src={score?.Link}></iframe>
        <div>
            <Button onClick={cancel}>Abbrechen</Button>
            <Button onClick={update}>Speichern</Button>
            <Button onClick={deleteSC}>Löschen</Button>
        </div>
    </Form>)
}

export default Scores