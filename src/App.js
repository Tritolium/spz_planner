import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { login, sendPushSubscription, update_login } from './modules/data/DBConnect';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './global';
import { theme0, theme1, theme2 } from './theme';
// import preval from 'preval.macro'
import { TbBellFilled, TbBellOff } from 'react-icons/tb';
import Settings from './components/settings/Settings';
import { notificationHelper } from './modules/helper/NotificationHelper';

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
export const version = `v0.10`

const App = () => {

    const [view, setView] = useState(-1)
    const [open, setOpen] = useState(false)
    const [notify, setNotify] = useState(window.Notification?.permission === 'granted')

    const loginRevalidated = useRef(false)

    const [fullname, setFullname] = useState("")
    const [auth_level, setAuth_level] = useState(0)

    const [theme, setTheme] = useState(theme1)

    useEffect(() => {

        const update = async () =>{
            setView(-2)
            let { _forename, _surname, _auth_level, _theme } = await update_login(version)
            if(_auth_level !== undefined) {
                setFullname(_forename + " " + _surname)
                setAuth_level(_auth_level)
                if(_theme !== undefined){
                    setTheme(_theme === 0 ? theme0 : _theme === 1 ? theme1 : theme2)
                }
                setView(0)
                if(window.Notification?.permission === 'granted'){
                    notificationHelper.createNotificationSubscription('BD0AbKmeW7bACNzC9m0XSUddJNx--VoOvU2X0qBF8dODOBhHvFPjrKJEBcL7Yk07l8VpePC1HBT7h2FRK3bS5uA')
                    .then(subscription => {
                        sendPushSubscription(subscription).then(permissions => {
                            setNotify(permissions.Allowed === 1)
                        })
                    })
                }
            } else {
                setView(-1)
            }
        }

        if(loginRevalidated.current) return
        loginRevalidated.current = true
        update()
    }, [])

    const sendLogin = useCallback(async (name, pwhash) => {
        setView(-2)
        let { _forename, _surname, _api_token, _auth_level, _theme } = await login(name, pwhash, version)
        if(_api_token !== undefined) {
            setFullname(_forename + " " + _surname)
            setAuth_level(_auth_level)
            if(_theme !== undefined){
                setTheme(_theme === 0 ? theme0 : _theme === 1 ? theme1 : theme2)
            }
            setView(0)
            if(window.Notification?.permission === 'granted'){
                notificationHelper.createNotificationSubscription('BD0AbKmeW7bACNzC9m0XSUddJNx--VoOvU2X0qBF8dODOBhHvFPjrKJEBcL7Yk07l8VpePC1HBT7h2FRK3bS5uA')
                .then(subscription => {
                    sendPushSubscription(subscription).then(permissions => {
                        setNotify(permissions.Allowed === 1)
                    })
                })
            }
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
        let button_id = e.target.id.split('_')[2]
        setView(parseInt(button_id))
    }

    const ringBell = () => {
        window.Notification?.requestPermission().then(permission => {
            if(permission === 'granted'){
                notificationHelper.createNotificationSubscription('BD0AbKmeW7bACNzC9m0XSUddJNx--VoOvU2X0qBF8dODOBhHvFPjrKJEBcL7Yk07l8VpePC1HBT7h2FRK3bS5uA')
                .then(subscription => {
                    sendPushSubscription(subscription, !notify)
                })
                setNotify(!notify)
            }
        })
    }

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            <StyledApp className="App">
                <Burger open={open} setOpen={setOpen}/>
                <Menu open={open} setOpen={setOpen} navigate={navigate} auth_level={auth_level} />
                {fullname !== "" ? <div id='Namefield'>
                    {notify ? <TbBellFilled onClick={ringBell}/> : <TbBellOff onClick={ringBell} />}
                    <div id='Name'>{fullname}</div>
                    <Button onClick={logout}>Logout</Button>
                </div> : <></>}
                <Suspense fallback={<div>Lädt...</div>}>
                    <View view={view} sendLogin={sendLogin} fullname={fullname} auth_level={auth_level} theme={theme}/>
                </Suspense>
                <div id="version-tag">{version}</div>
            </StyledApp>
        </ThemeProvider>
    );
}

const View = (props) => {

    const sendLogin = useCallback((name, pwhash) => {
        props.sendLogin(name, pwhash)
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
            <Dashboard fullname={props.fullname} auth_level={props.auth_level} theme={props.theme}/>
        </Suspense>)
    case 1:
        return(<Suspense fallback={<div>Planer lädt</div>}>
            <Dateplanner fullname={props.fullname} auth_level={props.auth_level} theme={props.theme}/>
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
        return(<Settings />)
    case 9:
        return(<HelpPage auth_level={props.auth_level}/>)
    }
}

export default App;
