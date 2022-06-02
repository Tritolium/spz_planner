import './App.css';
import { useCallback, useEffect, useState } from 'react';
import Dateplanner from './components/dateplanner/Dateplanner';
import MemberAdministration from './components/memberadministration/MemberAdministration';
import EventAdministration from './components/dateadministration/EventAdministration';
import Login from './components/login/Login';
import Cookies from 'universal-cookie';
import { login, update_login } from './modules/data/DBConnect';

import('./App.css')

const cookies = new Cookies()

const App = () => {

    const [view, setView] = useState(0)
    const [api_token, setApi_Token] = useState()
    const [fullname, setFullname] = useState("")
    const [auth_level, setAuth_level] = useState(0)

    useEffect(() => {

        const update = async () =>{
            let { _forename, _surname, _auth_level } = await update_login()
            
            if(_auth_level !== undefined) {
                setFullname(_forename + " " + _surname)
                setAuth_level(_auth_level)
                setView(0)
            } else {
                setView(-1)
            }
        }

        update()
    }, [api_token])

    const sendLogin = useCallback(async (name) => {

        let { _forename, _surname, _api_token } = await login(name)

        if(_api_token !== undefined) {
            setFullname(_forename + " " + _surname)
            setApi_Token(_api_token)
            cookies.set('api_token', _api_token)
            setView(0)
        }
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
                <div className='Namefield'>{fullname}</div>
                <nav className='MainNavigation'>
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
        return(<EventAdministration api_token={props.api_token}/>)
    }
}

export default App;
