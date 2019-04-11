class Store {
	constructor(reducer, initialState) {
		this.reducer = reducer
		this.state = initialState
	}

	getState() {
		return this.state
	}

	dispatch(action) {
		if (action !== undefined){
			//
		}
	}

	subscribe(listener) {}

	replaceReducer(nextReducer) {
		this.reducer = nextReducer
	}
}

function createStore(reducer, initialState) {
	return new Store(reducer, initialState)
}

exports.createStore = createStore
