const DB_NAME = "planer_db"
const STORE_NAME = "planer_store"
const DB_VERSION = 1

export const openDatabase = async () => {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION)

		request.onupgradeneeded = (event) => {
			const db = event.target.result
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME, { keyPath: "id"})
			}
		}

		request.onsuccess = (event) => {
			resolve(event.target.result)
		}

		request.onerror = (event) => {
			reject(event.target.error)
		}
	})
}

export const setItem = async (key, value) => {
	const db = await openDatabase()
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(STORE_NAME, "readwrite")
		const store = transaction.objectStore(STORE_NAME)
		const request = store.put({ id: key, value })

		request.onsuccess = () => {
			resolve()
		}

		request.onerror = (event) => {
			reject(event.target.error)
		}
	})
}

export const getItem = async (key) => {
	const db = await openDatabase()
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(STORE_NAME, "readonly")
		const store = transaction.objectStore(STORE_NAME)
		const request = store.get(key)

		request.onsuccess = () => {
			resolve(request.result?.value)
		}

		request.onerror = (event) => {
			reject(event.target.error)
		}
	})
}

export const removeItem = async (key) => {
	const db = await openDatabase()
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(STORE_NAME, "readwrite")
		const store = transaction.objectStore(STORE_NAME)
		const request = store.delete(key)

		request.onsuccess = () => {
			resolve()
		}

		request.onerror = (event) => {
			reject(event.target.error)
		}
	})
}