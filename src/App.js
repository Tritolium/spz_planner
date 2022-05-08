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
    const [auth_level, setAuth_level] = useState(0)

    useEffect(() => {
        let token = cookies.get('api_token')
        if(token !== undefined && token !== "undefined"){
            setApi_Token(token)
            fetch("/api/login.php?mode=update&api_token=" + token, {
                method: "GET"
            }).then((res) => {
                if(res.status === 200){
                    res.json().then((json) => {
                        setFullname(json.Forename + " " + json.Surname)
                        setAuth_level(json.Auth_level)
                        setView(0)
                    })
                }
            })
        } else {
            setView(-1)
        }
    }, [api_token])

    const sendLogin = useCallback((name) => {
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
            setView(1)
            break
        case 'main_button_1':
            setView(2)
            break
        case 'main_button_2':
            setView(3)
            break
        }
    }

    return (
        <div className="App">
            <header className="App-header">
                <div>{fullname}</div>
                <nav>
                    {auth_level > 0 ? <button type='button' id='main_button_0' onClick={navigate}>Terminplaner</button> : <></>}
                    {auth_level > 1 ? <button type='button' id='main_button_1' onClick={navigate}>Mitgliederverwaltung</button> : <></>}
                    {auth_level > 2 ? <button type='button' id='main_button_2' onClick={navigate}>Terminverwaltung</button> : <></>}
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
        return(<>Startseite</>)
    case 1:
        return(<Dateplanner fullname={props.fullname}/>)
    case 2:
        return(<MemberAdministration api_token={props.api_token}/>)
    case 3:
        return(<DateAdministration />)
    }
}

export default App;
