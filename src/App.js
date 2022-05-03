import './App.css';
import { useCallback, useEffect, useState } from 'react';
import Dateplanner from './components/dateplanner/Dateplanner';
import MemberAdministration from './components/memberadministration/MemberAdministration';
import DateAdministration from './components/dateadministration/DateAdministration';
import Login from './components/login/Login';
import Cookies from 'universal-cookie';
/*
if(process.env.NODE_ENV === 'production'){
    import('./App.css')
} else {
    import('./App_dev.css')
}*/import('./App.css')

const cookies = new Cookies()

const App = () => {

    const [view, setView] = useState(0)
    const [api_token, setApi_Token] = useState()
    const [fullname, setFullname] = useState("")

    useEffect(() => {
        let token = cookies.get('api_token')
        if(token !== undefined){
            setApi_Token(token)
            let name = cookies.get('fullname')
            if(name !== undefined){
                setFullname(name)
            }
        } else {
            setView(-1)
        }
    }, [api_token])

    const sendLogin = useCallback((name) => {
        console.log(name)
        fetch("/api/login.php?name=" + name, {
            method: "GET"
        }).then((res) => {
            if(res.status === 200){
                res.json().then((json) => {
                    console.log(json)
                    setFullname(json.Forename + " " + json.Surname)
                    setView(0)
                    setApi_Token(json.api_token)
                    cookies.set('api_token', json.api_token)
                    cookies.set('fullname', json.Forename + " " + json.Surname)
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
            <View view={view} sendLogin={sendLogin} fullname={fullname}/>
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
        return(<MemberAdministration />)
    case 2:
        return(<DateAdministration />)
    }
}

export default App;
