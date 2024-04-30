import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { login, sendError, sendPushSubscription, update_login } from './modules/data/DBConnect';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './global';
import { themes } from './theme';
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
const Evaluation = lazy(() => import('./components/evaluation/Evaluation'))
const EventAdministration = lazy(() => import('./components/dateadministration/EventAdministration'))
const HelpPage = lazy(() => import('./components/helppage/HelpPage'))
const Login = lazy(() => import('./components/login/Login'))
const MemberAdministration = lazy(() => import('./components/memberadministration/MemberAdministration'))
const Menu = lazy(() => import('./modules/components/menu/Menu'))
const OrderAdministration = lazy(() => import('./components/orderadministration/OrderAdministration'))
const Scoreboard = lazy(() => import('./components/scoreboard/Scoreboard'))
const StyledApp = lazy(() => import('./App.styled'))

// - ${preval`module.exports = new Date().toISOString()`}
export const version = "v0.13.3"

const App = () => {

    const [view, setView] = useState(-1)
    const [open, setOpen] = useState(false)
    const [notify, setNotify] = useState(window.Notification?.permission === 'granted')

    const loginRevalidated = useRef(false)

    const [fullname, setFullname] = useState("")
    const [auth_level, setAuth_level] = useState(0)

    const [theme, setTheme] = useState(themes[1])

    useEffect(() => {

        const update = async () =>{
            setView(-2)
            update_login(version)
            .then(({ _forename, _surname, _auth_level, _theme }) => {
                if(_auth_level !== undefined) {
                    setFullname(_forename + " " + _surname)
                    setAuth_level(_auth_level)
                    if(_theme !== undefined){
                        setTheme(themes[_theme] || themes[1])
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
            }).catch(err => {
                sendError(err.toString())
                alert("Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.")
                setView(-1)
            })
        }

        if(loginRevalidated.current) return
        loginRevalidated.current = true
        update()
    }, [])

    const sendLogin = useCallback(async (name, pwhash) => {
        setView(-2)
        login(name, pwhash, version)
        .then(({ _forename, _surname, _api_token, _auth_level, _theme }) => {
            if(_api_token !== undefined) {
                setFullname(_forename + " " + _surname)
                setAuth_level(_auth_level)
                if(_theme !== undefined){
                    setTheme(themes[_theme] || themes[1])
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
        }).catch(err => {
            sendError(err.toString())
            alert("Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.")
            setView(-1)
        })
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

    const checkSW = async () => {
        if('serviceWorker' in navigator){
            const registration = await navigator.serviceWorker.getRegistration()
            registration?.update()
            registration?.waiting?.postMessage('SKIP_WAITING')
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            checkSW()
        }, 5000)
        return () => clearInterval(interval)
    }, [])

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

    const components = {
        '-2': <>Login wird überprüft</>,
        '-1': <Login sendLogin={sendLogin}/>,
        '0': <Dashboard fullname={props.fullname} auth_level={props.auth_level} theme={props.theme}/>,
        '1': <Dateplanner fullname={props.fullname} auth_level={props.auth_level} theme={props.theme}/>,
        '2': <AbsenceAdministration auth_level={props.auth_level}/>,
        '3': <Evaluation theme={props.theme}/>,
        '4': <MemberAdministration auth_level={props.auth_level}/>,
        '5': <EventAdministration auth_level={props.auth_level}/>,
        '6': <Scoreboard />,
        '7': <OrderAdministration />,
        '8': <Administration auth_level={props.auth_level}/>,
        '9': <Settings />,
        '10': <HelpPage auth_level={props.auth_level}/>
    };
    
    const fallbacks = {
        '-1': 'Login lädt',
        '0': 'Startseite lädt',
        '1': 'Planer lädt',
        '3': '',
        '7': ''
    };
    
    return (
        <Suspense fallback={<div>{fallbacks[props.view] || ''}</div>}>
            {components[props.view] || <Login sendLogin={sendLogin}/>}
        </Suspense>
    );
}

export default App;
