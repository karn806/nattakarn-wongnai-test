class Store {
	constructor(reducer, initialState) {
		this.reducer = reducer
		this.state = initialState
	}

	getState() {}

	dispatch(action) {}

	subscribe(listener) {}

	replaceReducer(nextReducer) {}
}

function createStore(reducer, initialState) {
	return new Store(reducer, initialState)
}

exports.createStore = createStore
