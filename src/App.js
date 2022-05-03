import './App.css';
import { useCallback, useEffect, useState } from 'react';
import Dateplanner from './components/dateplanner/Dateplanner';
import MemberAdministration from './components/memberadministration/MemberAdministration';
import DateAdministration from './components/dateadministration/DateAdministration';
import Login from './components/login/Login';
import Cookies from 'universal-cookie';

import('./App.css')

const cookies = new Cookies()

const App = () => {

    const [view, setView] = useState(0)
    const [api_token, setApi_Token] = useState()
    const [fullname, setFullname] = useState("")

    useEffect(() => {
        let token = cookies.get('api_token')
        console.log(typeof(token))
        if(token !== undefined && token !== "undefined"){
            setApi_Token(token)
            fetch("/api/login.php?mode=update&api_token=" + token, {
                method: "GET"
            }).then((res) => {
                if(res.status === 200){
                    res.json().then((json) => {
                        setFullname(json.Forename + " " + json.Surname)
                        setView(0)
                    })
                }
            })
        } else {
            setView(-1)
        }
    }, [api_token])

    const sendLogin = useCallback((name) => {
        console.log(name)
        fetch("/api/login.php?mode=login&name=" + name, {
            method: "GET"
        }).then((res) => {
            if(res.status === 200){
                res.json().then((json) => {
                    setFullname(json.Forename + " " + json.Surname)
                    setApi_Token(json.API_token)
                    setView(0)
                    cookies.set('api_token', json.API_token)
                })
            }
        })
    }, [])

    const navigate = (e) => {
        switch(e.target.id){
        default:
        case 'main_button_0':
            setView(0)
            break
        case 'main_button_1':
            setView(1)
            break
        case 'main_button_2':
            setView(2)
            break
        }
    }

    return (
        <div className="App">
            <header className="App-header">
                <div>{fullname}</div>
                <nav>
                    <button type='button' id='main_button_0' onClick={navigate}>Terminplaner</button>
                    <button type='button' id='main_button_1' onClick={navigate}>Mitgliederverwaltung</button>
                    <button type='button' id='main_button_2' onClick={navigate}>Terminverwaltung</button>
                </nav>
            </header>
            <View view={view} sendLogin={sendLogin} fullname={fullname} api_token={api_token}/>
        </div>
    );
}

const View = (props) => {

    const sendLogin = useCallback((name) => {
        props.sendLogin(name)
    }, [props])

    switch(props.view){
    default:
    case -1:
        return(<Login sendLogin={sendLogin}/>)
    case 0:
        return(<Dateplanner fullname={props.fullname}/>)
    case 1:
        return(<MemberAdministration api_token={props.api_token}/>)
    case 2:
        return(<DateAdministration />)
    }
}

export default App;
