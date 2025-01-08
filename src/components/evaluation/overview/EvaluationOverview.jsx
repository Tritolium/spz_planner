import { useCallback, useEffect, useState } from "react";
import { RiBarChartFill } from "react-icons/ri";
import { Table } from "../../../modules/components/overview/Table";
import { getOwnUsergroups, host } from "../../../modules/data/DBConnect";
import { StyledEvaluationOverview } from "./EvaluationOverview.styled";
import { EvalButton } from "../evaluationinput/EvaluationInput";
import { hasPermission } from "../../../modules/helper/Permissions";
import { EVENT_STATE } from "../../dateadministration/eventform/EventForm";

const EvaluationOverview = ({ theme }) => {

    const [usergroups, setUsergroups] = useState(new Array(0))
    const [selectedUsergroupID, setSelectedUsergroupID] = useState(-1)
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [filterFrom, setFilterFrom] = useState(new Date('2023-11-23').toISOString().split('T')[0])
    const [filterTo, setFilterTo] = useState(new Date().toISOString().split('T')[0])

    const [evaluations, setEvaluations] = useState(new Array(0))

    const fetchUsergroups = useCallback(async () => {
        let _usergroups = await getOwnUsergroups()
        if(_usergroups !== undefined) {
            _usergroups = _usergroups.filter(usergroup => hasPermission(8, usergroup.Association_ID))
            setUsergroups(_usergroups)
        } else
            setUsergroups(new Array(0))
    }, [])

    const fetchEvaluations = useCallback(async () => {
        if(selectedUsergroupID !== -1){
            fetch(`${host}/api/v0/attendenceeval?api_token=${localStorage.getItem("api_token")}&usergroup_id=${selectedUsergroupID}`)
                .then((response) => {
                    if(response.status === 200) 
                        return response.json()
                    else
                        return undefined
                }).then((data) => {
                    if(data === undefined)
                        setEvaluations(new Array(0))
                    else
                        setEvaluations(data)
                })
        }
    }, [selectedUsergroupID])

    const onUsergroupChange = useCallback((e) => {
        setSelectedUsergroupID(e.target.value)
    }, [])

    const onCategoryChange = useCallback((e) => {
        setSelectedCategory(e.target.value)
    }, [])

    const reload = useCallback(() => {
        fetchEvaluations()
    }, [fetchEvaluations])

    useEffect(() => {
        fetchUsergroups()
        reload()
    }, [fetchUsergroups, reload])

    useEffect(() => {
        // set filterFrom to today - 1 year, if it is after 23.11.2023
        let today = new Date()
        let limit = new Date('2023-11-23') // evaluation only available from this date on
        let lastYear = new Date(today.getFullYear()-1, today.getMonth(), today.getDate())
        if (lastYear > limit) {
            setFilterFrom(lastYear.toISOString().split('T')[0])
        }
    }, [filterFrom])

    return (
        <StyledEvaluationOverview>
            <div>
                <select name="usergroup" id="usergroup" onChange={onUsergroupChange}>
                    <option value={-1}>Gruppe auswählen</option>
                    {usergroups.map((usergroup) => <option key={usergroup.Usergroup_ID} value={usergroup.Usergroup_ID}>{usergroup.Title}</option>)}
                </select>
                <select name="type" id="type" onChange={onCategoryChange}>
                    <option value="all">Alle</option>
                    <option value="practice">Üben/Probe</option>
                    <option value="event">Auftritt</option>
                    <option value="other">sonstige Termine</option>
                </select>
                <input type="date" defaultValue={filterFrom} onChange={(e) => {setFilterFrom(e.target.value)}}/>
                <input type="date" defaultValue={filterTo} onChange={(e) => {setFilterTo(e.target.value)}}/>
            </div>
            <OverviewTable evaluations={evaluations} filterFrom={filterFrom} filterTo={filterTo} category={selectedCategory} theme={theme}/>
        </StyledEvaluationOverview>
    );
};

const OverviewTable = ({ evaluations, filterFrom, filterTo, category, theme }) => {
    return(
        <Table>
            <thead>
                <tr>
                    <th colSpan={2}>Termin</th>
                    <th><EvalButton attendence={0} callback={() => {}} theme={theme}/></th>
                    <th><EvalButton attendence={1} callback={() => {}} theme={theme}/></th>
                    <th><EvalButton attendence={2} callback={() => {}} theme={theme}/></th>
                    <th><EvalButton attendence={3} callback={() => {}} theme={theme}/></th>
                    <th><EvalButton attendence={4} callback={() => {}} theme={theme}/></th>
                    <th><RiBarChartFill /></th>
                    <th><EvalButton attendence={3} callback={() => {}} theme={theme}/></th>
                    <th><EvalButton attendence={2} callback={() => {}} theme={theme}/></th>
                    <th>%</th>
                </tr>
            </thead>
            <tbody>
                {evaluations
                .filter((evaluation) => {
                    if(filterFrom !== undefined && filterTo !== undefined && filterFrom !== "" && filterTo !== ""){
                        let date = new Date(evaluation.Date)
                        let from = new Date(filterFrom)
                        let to = new Date(filterTo)
                        return date >= from && date <= to
                    }
                    return true
                })
                .filter((evaluation) => evaluation.State !== EVENT_STATE.CANCELED)
                .filter((evaluation) => evaluation.Category === category || category === "all")
                .map((evaluation) => {
                    return <EvaluationRow key={`evaluation_${evaluation.Type}_${evaluation.Date}`} evaluation={evaluation}/>
                })}
            </tbody>
        </Table>
    )
}

const EvaluationRow = ({ evaluation }) => {
    let att = evaluation.Evaluations.filter(evalu => {return evalu.Evaluation === 3 || evalu.Evaluation === 4}).length
    let all = evaluation.Evaluations.filter(evalu => evalu.Evaluation !== -1).length
    let date = new Date(evaluation.Date)
    let datestring = date.getDate() + "." + (date.getMonth()+1) + "." + date.getFullYear()
    return(
        <tr>
            <td>{datestring}</td>
            <td>{evaluation.Type} {evaluation.Location}</td>
            <td>{evaluation.Evaluations.filter(evalu => {return evalu.Evaluation === 0}).length}</td>
            <td>{evaluation.Evaluations.filter(evalu => {return evalu.Evaluation === 1}).length}</td>
            <td>{evaluation.Evaluations.filter(evalu => {return evalu.Evaluation === 2}).length}</td>
            <td>{evaluation.Evaluations.filter(evalu => {return evalu.Evaluation === 3}).length}</td>
            <td>{evaluation.Evaluations.filter(evalu => {return evalu.Evaluation === 4}).length}</td>
            <td>{evaluation.Prediction}</td>
            <td>{evaluation.Evaluations.filter(evalu => {return evalu.Evaluation === 3 || evalu.Evaluation === 4}).length}</td>
            <td>{evaluation.Evaluations.filter(evalu => {return !(evalu.Evaluation === 3 || evalu.Evaluation === 4 || evalu.Evaluation === -1)}).length}</td>
            <td>{att}/{all} ({Math.round(att/all*100)}%)</td>
        </tr>
    )
}

export default EvaluationOverview;
