import './App.css';
import { useCallback, useEffect, useState } from 'react';
import Dateplanner from './components/dateplanner/Dateplanner'
import AbsenceAdministration from './components/absenceadministration/AbsenceAdministration'
import MemberAdministration from './components/memberadministration/MemberAdministration';
import EventAdministration from './components/dateadministration/EventAdministration';
import Login from './components/login/Login';
import Cookies from 'universal-cookie';
import { login, update_login } from './modules/data/DBConnect';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './global';
import { theme } from './theme';
import Menu from './modules/components/menu/Menu';
import Burger from './modules/components/burger/Burger';
import { StyledApp } from './App.styled';
import Administration from './components/administration/Administration';

import('./App.css')

const cookies = new Cookies()

const App = () => {

    const [view, setView] = useState(0)
    const [open, setOpen] = useState(false)

    const [api_token, setApi_Token] = useState()
    const [fullname, setFullname] = useState("")
    const [auth_level, setAuth_level] = useState(0)

    useEffect(() => {

        const update = async () =>{
            let { _forename, _surname, _auth_level } = await update_login()
            
            if(_auth_level !== undefined) {
                setFullname(_forename + " " + _surname)
                setAuth_level(_auth_level)
                if(_auth_level > 0)
                    setView(1)
                else
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
            cookies.set('api_token', _api_token, {expires: new Date('2022-09-30')})
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
        case 'main_button_3':
            setView(4)
            break
        case 'main_button_4':
            setView(5)
            break
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            <StyledApp className="App">
                <Burger open={open} setOpen={setOpen}/>
                <Menu open={open} setOpen={setOpen} navigate={navigate} auth_level={auth_level} />
                <div className='Namefield'>{fullname}</div>
                <View view={view} sendLogin={sendLogin} fullname={fullname} auth_level={auth_level}/>
            </StyledApp>
        </ThemeProvider>
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
        return(<Dateplanner fullname={props.fullname} auth_level={props.auth_level}/>)
    case 2:
        return(<AbsenceAdministration auth_level={props.auth_level}/>)
    case 3:
        return(<MemberAdministration auth_level={props.auth_level}/>)
    case 4:
        return(<EventAdministration auth_level={props.auth_level}/>)
    case 5:
        return(<Administration auth_level={props.auth_level}/>)
    }
}

export default App;
