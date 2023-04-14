import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { login, update_login } from './modules/data/DBConnect';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './global';
import { theme } from './theme';
import preval from 'preval.macro'

import('./App.css')

const AbsenceAdministration = lazy(() => import('./components/absenceadministration/AbsenceAdministration'))
const Administration = lazy(() => import('./components/administration/Administration'))
const Burger = lazy(() => import('./modules/components/burger/Burger'))
const Button = lazy(() => import('./modules/components/button/Button'))
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'))
const Dateplanner = lazy(() => import('./components/dateplanner/Dateplanner'))
const EventAdministration = lazy(() => import('./components/dateadministration/EventAdministration'))
const HelpPage = lazy(() => import('./components/helppage/HelpPage'))
const Login = lazy(() => import('./components/login/Login'))
const MemberAdministration = lazy(() => import('./components/memberadministration/MemberAdministration'))
const Menu = lazy(() => import('./modules/components/menu/Menu'))
const OrderAdministration = lazy(() => import('./components/orderadministration/OrderAdministration'))
const Scoreboard = lazy(() => import('./components/scoreboard/Scoreboard'))
const StyledApp = lazy(() => import('./App.styled'))

// - ${preval`module.exports = new Date().toISOString()`}
const version = `v0.9.1`

const App = () => {

    const [view, setView] = useState(-1)
    const [open, setOpen] = useState(false)

    const loginRevalidated = useRef(false)

    const [fullname, setFullname] = useState("")
    const [auth_level, setAuth_level] = useState(0)

    useEffect(() => {

        const update = async () =>{
            setView(-2)
            let { _forename, _surname, _auth_level } = await update_login(version)
            if(_auth_level !== undefined) {
                setFullname(_forename + " " + _surname)
                setAuth_level(_auth_level)
                setView(0)
            } else {
                setView(-1)
            }
        }

        if(loginRevalidated.current) return
        loginRevalidated.current = true
        update()
    }, [])

    const sendLogin = useCallback(async (name) => {
        setView(-2)
        let { _forename, _surname, _api_token, _auth_level } = await login(name, version)
        if(_api_token !== undefined) {
            setFullname(_forename + " " + _surname)
            setAuth_level(_auth_level)
            setView(0)
        } else {
            setView(-1)
        }
    }, [])

    const logout = () =>{
        localStorage.clear()
        setFullname('')
        window.location.reload()
        setView(-1)
    }

    const navigate = async (e) => {
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
        case 'main_button_3':
            setView(3)
            break
        case 'main_button_4':
            setView(4)
            break
        case 'main_button_5':
            setView(5)
            break
        case 'main_button_6':
            setView(6)
            break
        case 'main_button_7':
            setView(7)
            break
        case 'main_button_8':
            setView(8)
            break
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            <StyledApp className="App">
                <Burger open={open} setOpen={setOpen}/>
                <Menu open={open} setOpen={setOpen} navigate={navigate} auth_level={auth_level} />
                <div className='Namefield'>
                    <div>{fullname}</div>
                    <Button onClick={logout}>Logout</Button>
                </div>
                <Suspense fallback={<div>Lädt...</div>}>
                    <View view={view} sendLogin={sendLogin} fullname={fullname} auth_level={auth_level}/>
                </Suspense>
                <div id="version-tag">{version}</div>
            </StyledApp>
        </ThemeProvider>
    );
}

const View = (props) => {

    const sendLogin = useCallback((name) => {
        props.sendLogin(name)
    }, [props])

    switch(props.view){
    case -2:
        return(<>Login wird überprüft</>)
    default:
    case -1:
        return(<Suspense fallback={<div>Login lädt</div>}>
            <Login sendLogin={sendLogin}/>
        </Suspense>)
    case 0:
        return(<Suspense fallback={<div>Startseite lädt</div>}>
            <Dashboard fullname={props.fullname}/>
        </Suspense>)
    case 1:
        return(<Suspense fallback={<div>Planer lädt</div>}>
            <Dateplanner fullname={props.fullname} auth_level={props.auth_level}/>
        </Suspense>)
    case 2:
        return(<AbsenceAdministration auth_level={props.auth_level}/>)
    case 3:
        return(<MemberAdministration auth_level={props.auth_level}/>)
    case 4:
        return(<EventAdministration auth_level={props.auth_level}/>)
    case 5:
        return(<Scoreboard />)
    case 6:
        return(<Suspense>
            <OrderAdministration />
        </Suspense>)
    case 7:
        return(<Administration auth_level={props.auth_level}/>)
    case 8:
        return(<HelpPage auth_level={props.auth_level}/>)
    }
}

export default App;
