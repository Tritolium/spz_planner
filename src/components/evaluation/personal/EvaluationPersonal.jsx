import { useCallback, useEffect, useState } from "react"
import { host } from "../../../modules/data/DBConnect"

const EvaluationPersonal = ({ theme }) => {

    const [evaluation, setEvaluation] = useState(new Array(0))
    const [year, setYear] = useState(new Date().getFullYear())

    const changeYear = (e) => {
        setYear(e.target.value)
    }

    const fetchPersonalEvaluation = useCallback(async () => {
        fetch(`${host}/api/v0/p_evaluation?year=${year}&api_token=${localStorage.getItem('api_token')}`)
        .then(res => res.json())
        .then(data => {
            setEvaluation(data)
        })
    }, [year])

    useEffect(() => {
        fetchPersonalEvaluation()
    }, [year, fetchPersonalEvaluation])

    useEffect(() => {
        document.querySelector('select').value = new Date().getFullYear()
    }, [])

    return (
        <div>
            <select onChange={changeYear}>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
            </select>
            {Object.keys(evaluation).map((key) => {
                return (<UsergroupEval key={key} usergroup={key} evaluation={evaluation[key]}/>)
            })}
        </div>
    )
}

const UsergroupEval = ({ usergroup, evaluation }) => {

    let ugroupRating = 0;
    let divider = 0;
    
    const calculateAttendance = (evaluation, type) => {
        const missing = (evaluation[type][0] || 0) + (evaluation[type][1] || 0) + (evaluation[type][2] || 0)
        const attendance = (evaluation[type][3] || 0) + (evaluation[type][4] || 0)
        const wout_notice = (evaluation[type][0] || 0) + (evaluation[type][1] || 0)
        return { missing, attendance, wout_notice }
    }

    const calculateComparrison = (less, equal, more) => 
        Math.round((less + equal) / (less + more + equal) * 100);

    const getColorForRating = (ugroupRating) => {
        const colors = [
            'rgb(255, 0, 0)',    
            'rgb(255, 64, 0)',   
            'rgb(255, 128, 0)',  
            'rgb(255, 192, 0)',  
            'rgb(255, 255, 0)',  
            'rgb(192, 255, 0)',  
            'rgb(128, 255, 0)',  
            'rgb(0, 212, 0)',    
            'rgb(0, 170, 0)',    
            'rgb(0, 128, 0)'     
        ];
        if (ugroupRating < 0) return 'rgb(192, 0, 0)'
        return colors[Math.min(ugroupRating, 9)];
    };
    
    const initializeValues = () => ({
        attendence: 0,
        missing: 0,
        wout_notice: 0,
        percentage: 0,
        wout_percentage: 0,
        rating: 0,
        less: 0,
        more: 0,
        equal: 0,
        comparrison: 0
    });

    useEffect(() => {
        // change color of ugroup_rating_${usergroup} depending on the rating
        const rating = document.getElementById(`ugroup_rating_${usergroup}`.toLocaleLowerCase())
        const eventrating = document.getElementById(`event_rating_${usergroup}`.toLocaleLowerCase())
        const practicerating = document.getElementById(`practice_rating_${usergroup}`.toLocaleLowerCase())
        const otherrating = document.getElementById(`other_rating_${usergroup}`.toLocaleLowerCase())
        if (eventrating) {
            let eventRating = parseInt(eventrating.innerText.split(' ')[8].slice(0, -1))
            eventRating = Math.floor(eventRating / 10)
            eventrating.style.color = getColorForRating(eventRating);
        }
        if (practicerating) {
            let practiceRating = parseInt(practicerating.innerText.split(' ')[8].slice(0, -1))
            practiceRating = Math.floor(practiceRating / 10)
            practicerating.style.color = getColorForRating(practiceRating);
        }
        if (otherrating) {
            let otherRating = parseInt(otherrating.innerText.split(' ')[8].slice(0, -1))
            otherRating = Math.floor(otherRating / 10)
            otherrating.style.color = getColorForRating(otherRating);
        }
        if (rating) {
            let ugroupRating = parseInt(rating.innerText.split(' ')[1].slice(0, -1))
            ugroupRating = Math.floor(ugroupRating / 10)
            rating.style.color = getColorForRating(ugroupRating);              
        }
    }, [usergroup, ugroupRating])
    
    const eventValues = initializeValues();
    const practiceValues = initializeValues();
    const otherValues = initializeValues();
    
    eventValues.less = evaluation['event']['less'];
    practiceValues.less = evaluation['practice']['less'];
    otherValues.less = evaluation['other']['less'];
    
    eventValues.more = evaluation['event']['more'];
    practiceValues.more = evaluation['practice']['more'];
    otherValues.more = evaluation['other']['more'];
    
    eventValues.equal = evaluation['event']['equal'];
    practiceValues.equal = evaluation['practice']['equal'];
    otherValues.equal = evaluation['other']['equal'];
    
    eventValues.comparrison = calculateComparrison(eventValues.less, eventValues.equal, eventValues.more);
    practiceValues.comparrison = calculateComparrison(practiceValues.less, practiceValues.equal, practiceValues.more);
    otherValues.comparrison = calculateComparrison(otherValues.less, otherValues.equal, otherValues.more);
    
    for (let type in evaluation) {
        switch (type) {
            case 'event':
                ({ missing: eventValues.missing, attendance: eventValues.attendence, wout_notice: eventValues.wout_notice } = calculateAttendance(evaluation, type));
                break;
            case 'practice':
                ({ missing: practiceValues.missing, attendance: practiceValues.attendence, wout_notice: practiceValues.wout_notice } = calculateAttendance(evaluation, type));
                break;
            case 'other':
                ({ missing: otherValues.missing, attendance: otherValues.attendence, wout_notice: otherValues.wout_notice } = calculateAttendance(evaluation, type));
                break;
            default:
                break;
        }
    }

    if(eventValues.attendence === 0 && practiceValues.attendence === 0 && otherValues.attendence === 0)
        return

    eventValues.percentage = Math.round(eventValues.attendence / (eventValues.attendence + eventValues.missing) * 100)
    practiceValues.percentage = Math.round(practiceValues.attendence / (practiceValues.attendence + practiceValues.missing) * 100)
    otherValues.percentage = Math.round(otherValues.attendence / (otherValues.attendence + otherValues.missing) * 100)

    eventValues.wout_percentage = Math.round(eventValues.wout_notice / (eventValues.attendence + eventValues.missing) * 100)
    practiceValues.wout_percentage = Math.round(practiceValues.wout_notice / (practiceValues.attendence + practiceValues.missing) * 100)
    otherValues.wout_percentage = Math.round(otherValues.wout_notice / (otherValues.attendence + otherValues.missing) * 100)

    // eventValues.rating = Math.round((4*eventValues.percentage+eventValues.comparrison-eventValues.wout_percentage)/5)
    // practiceValues.rating = Math.round((4*practiceValues.percentage+practiceValues.comparrison-practiceValues.wout_percentage)/5)
    // otherValues.rating = Math.round((4*otherValues.percentage+otherValues.comparrison-otherValues.wout_percentage)/5)

    eventValues.rating = Math.round((4*eventValues.percentage+eventValues.comparrison+20*(10-eventValues.wout_percentage))/7)
    practiceValues.rating = Math.round((4*practiceValues.percentage+practiceValues.comparrison+20*(10-practiceValues.wout_percentage))/7)
    otherValues.rating = Math.round((4*otherValues.percentage+otherValues.comparrison+20*(10-otherValues.wout_percentage))/7)

    // calculate usergroup rating from event, practice and other ratings, e.g.:
    // ugroupRating = Math.round((4*eventValues.rating + 2*practiceValues.rating + 1*otherValues.rating) / 7)
    // but make sure to use only the ratings that are available (attendence > 0)
    // and adjust the weights accordingly
    if (eventValues.attendence > 0) {
        ugroupRating += 4 * eventValues.rating;
        divider += 4;
    }

    if (practiceValues.attendence > 0) {
        ugroupRating += 2 * practiceValues.rating;
        divider += 2;
    }

    if (otherValues.attendence > 0) {
        ugroupRating += 1 * otherValues.rating;
        divider += 1;
    }

    ugroupRating = Math.round(ugroupRating / divider);

    return (
        <div>
            <h1>{usergroup}</h1>
            {eventValues.attendence > 0 && <p id={`event_rating_${usergroup}`.toLocaleLowerCase()}>Auftritte Teilnahme: {eventValues.percentage}%, Unentschuldigt: {eventValues.wout_percentage}% Vergleich: {eventValues.comparrison}%, gesamt: {eventValues.rating}%</p>}
            {practiceValues.attendence > 0 && <p id={`practice_rating_${usergroup}`.toLocaleLowerCase()}>Proben Teilnahme: {practiceValues.percentage}%, Unentschuldigt: {practiceValues.wout_percentage}% Vergleich: {practiceValues.comparrison}%, gesamt: {practiceValues.rating}%</p>}
            {otherValues.attendence > 0 && <p id={`other_rating_${usergroup}`.toLocaleLowerCase()}>Sonstige Teilnahme: {otherValues.percentage}%, Unentschuldigt: {otherValues.wout_percentage}% Vergleich: {otherValues.comparrison}%, gesamt: {otherValues.rating}%</p>}
            <p id={`ugroup_rating_${usergroup}`.toLocaleLowerCase()}>Gesamtbewertung: {ugroupRating}%</p>
        </div>
    )
}

export default EvaluationPersonal