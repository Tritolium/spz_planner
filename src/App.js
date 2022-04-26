import './App.css';
import Termineingabe from './Termineingabe';
import Übersicht from './Übersicht'

import check from './check.png'
import alert from './alert.png'
import deny from './delete-button.png'
import { useState } from 'react';

function App() {

    const [view, setView] = useState(0)

    const navigate = (e) => {
        switch(e.target.id){
        default:
        case 'button_0':
            setView(0)
            break
        case 'button_1':
            setView(1)
            break
        }
    }

    return (
        <div className="App">
            <header className="App-header">
                <div><img src={check} alt='Zusage'/> Zusage</div>
                <div><img src={deny} alt='Absage'/> Absage</div>
                <div><img src={alert} alt='Unsicher'/> Unsicher</div>
                <nav>
                    <button id='button_0' onClick={navigate}>Eingabe</button>
                    <button id='button_1' onClick={navigate}>Übersicht</button>
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
        return(<Termineingabe />)
    case 1:
        return(<Übersicht />)
    }
}

export default App;
