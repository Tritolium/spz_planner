import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { getItem } from './modules/helper/IndexedDB';
import { host } from './modules/data/DBConnect';

const root = ReactDOM.createRoot(document.getElementById('root'));

export let beforeInstallPrompt

window.addEventListener('beforeinstallprompt', (e) => {
	e.preventDefault()
	beforeInstallPrompt = e
})

document.addEventListener('visibilitychange', async () => {
	let device_id, button_analytics
	if (document.visibilityState === 'hidden') {
		// send analytics to server
		device_id = await getItem('device_id')
		button_analytics = await getItem('button_analytics')

		fetch(`${host}/api/v0/analytics/${device_id}?api_token=${localStorage.getItem('api_token')}`, {
			method: 'POST',
			body: JSON.stringify({
				analytics: button_analytics
			})
		})

	}
})

root.render(
  	<React.StrictMode>
    	<App />
  	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
