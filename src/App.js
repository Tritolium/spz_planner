import './App.css';
import { useState } from 'react';
import Dateplanner from './components/dateplanner/Dateplanner';
import MemberAdministration from './components/memberadministration/MemberAdministration';
import DateAdministration from './components/dateadministration/DateAdministration';
/*
if(process.env.NODE_ENV === 'production'){
    import('./App.css')
} else {
    import('./App_dev.css')
}*/import('./App.css')

function App() {

    const [view, setView] = useState(0)

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
                <nav>
                    <button type='button' id='main_button_0' onClick={navigate}>Terminplaner</button>
                    <button type='button' id='main_button_1' onClick={navigate}>Mitgliederverwaltung</button>
                    <button type='button' id='main_button_2' onClick={navigate}>Terminverwaltung</button>
                </nav>
            </header>
            <View view={view}/>
        </div>
    );
}

const View = (props) => {
    switch(props.view){
    default:
    case 0:
        return(<Dateplanner />)
    case 1:
        return(<MemberAdministration />)
    case 2:
        return(<DateAdministration />)
    }
}

export default App;
