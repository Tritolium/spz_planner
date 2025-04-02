const urlBase64ToUint8Array = (base64String) => {
	const padding = "=".repeat((4 - base64String.length % 4) % 4)
	const base64 = (base64String + padding)
		.replace(/-/g, "+")
		.replace(/_/g, "/")

	const rawData = window.atob(base64)
	const outputArray = new Uint8Array(rawData.length)

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i)
	}
	return outputArray
}

export const notificationHelper = {
	isSupported() {
		if (!window.Notification) {
			return false
		}
	    
		if (!("serviceWorker" in navigator)) {
			return false
		}

		if (!("PushManager" in window)) {
			return false
		}		

		return true
	},

	
	
	createNotificationSubscription(pushServerPublicKey) {
		return navigator.serviceWorker.ready.then(serviceWorker => {
			return serviceWorker.pushManager
				.subscribe({
					userVisibleOnly: true,
					applicationServerKey: urlBase64ToUint8Array(pushServerPublicKey)
				})
				.then(function(pushSubscription) {
					var subJSObject = JSON.parse(JSON.stringify(pushSubscription))
					var subscription = {
						"endpoint": subJSObject.endpoint,
						"authToken": subJSObject.keys.auth,
						"publicKey": subJSObject.keys.p256dh
					}

					return subscription
				})
		})
	}
}