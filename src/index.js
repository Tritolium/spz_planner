import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
