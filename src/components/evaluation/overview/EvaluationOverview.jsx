import { useCallback, useEffect, useState } from "react";
import { Table } from "../../../modules/components/overview/Table";
import { getOwnUsergroups, host } from "../../../modules/data/DBConnect";
import { StyledEvaluationOverview } from "./EvaluationOverview.styled";
import { EvalButton } from "../evaluationinput/EvaluationInput";

const EvaluationOverview = ({ theme }) => {

    const [usergroups, setUsergroups] = useState(new Array(0))
    const [selectedUsergroupID, setSelectedUsergroupID] = useState(-1)
    const [filterFrom, setFilterFrom] = useState(new Date('2023-11-23').toISOString().split('T')[0])
    const [filterTo, setFilterTo] = useState(new Date().toISOString().split('T')[0])

    const [evaluations, setEvaluations] = useState(new Array(0))

    const fetchUsergroups = useCallback(async () => {
        let _usergroups = await getOwnUsergroups()
        if(_usergroups !== undefined) {
            setUsergroups(_usergroups)
        } else
            setUsergroups(new Array(0))
    }, [])

    const fetchEvaluations = useCallback(async () => {
        if(selectedUsergroupID !== -1){
            fetch(`${host}/api/attendence.php?api_token=${localStorage.getItem("api_token")}&usergroup=${selectedUsergroupID}&eval&all=true`)
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

    const reload = useCallback(() => {
        fetchEvaluations()
    }, [fetchEvaluations])

    useEffect(() => {
        fetchUsergroups()
        reload()
    }, [fetchUsergroups, reload])

    return (
        <StyledEvaluationOverview>
            <div>
                <select name="usergroup" id="usergroup" onChange={onUsergroupChange}>
                    {usergroups.map((usergroup) => <option key={usergroup.Usergroup_ID} value={usergroup.Usergroup_ID}>{usergroup.Title}</option>)}
                </select>
                <input type="date" defaultValue={'2023-11-23'} onChange={(e) => {setFilterFrom(e.target.value)}}/>
                <input type="date" defaultValue={filterTo} onChange={(e) => {setFilterTo(e.target.value)}}/>
            </div>
            <OverviewTable evaluations={evaluations} filterFrom={filterFrom} filterTo={filterTo} theme={theme}/>
        </StyledEvaluationOverview>
    );
};

const OverviewTable = ({ evaluations, filterFrom, filterTo, theme }) => {
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
                .map((evaluation) => {
                    let att = evaluation.Evaluations.filter(evalu => {return evalu.Evaluation === 3 || evalu.Evaluation === 4}).length
                    let all = evaluation.Evaluations.length
                    let date = new Date(evaluation.Date)
                    let datestring = date.getDate() + "." + (date.getMonth()+1) + "." + date.getFullYear()
                    return(
                        <tr key={`evaluation_${evaluation.Type}_${evaluation.Date}`}>
                            <td>{datestring}</td>
                            <td>{evaluation.Type} {evaluation.Location}</td>
                            <td>{evaluation.Evaluations.filter(evalu => {return evalu.Evaluation === 0}).length}</td>
                            <td>{evaluation.Evaluations.filter(evalu => {return evalu.Evaluation === 1}).length}</td>
                            <td>{evaluation.Evaluations.filter(evalu => {return evalu.Evaluation === 2}).length}</td>
                            <td>{evaluation.Evaluations.filter(evalu => {return evalu.Evaluation === 3}).length}</td>
                            <td>{evaluation.Evaluations.filter(evalu => {return evalu.Evaluation === 4}).length}</td>
                            <td>{evaluation.Evaluations.filter(evalu => {return evalu.Evaluation === 3 || evalu.Evaluation === 4}).length}</td>
                            <td>{evaluation.Evaluations.filter(evalu => {return !(evalu.Evaluation === 3 || evalu.Evaluation === 4 || evalu.Evaluation === -1)}).length}</td>
                            <td>{att}/{all} ({Math.round(att/all*100)}%)</td>
                        </tr>
                    )
                })}
            </tbody>
        </Table>
    )
}

export default EvaluationOverview;
