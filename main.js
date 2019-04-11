class Store {
	constructor(reducer, initialState) {
		this.reducer = reducer
		this.state = initialState
	}

	getState() {
		return this.state
	}

	dispatch(action) {
		switch (action) {
			case undefined:
				throw new Error('action is undefined')
			default:
				const newState = this.reducer(this.state, action)
				this.state = newState
		}
	}

	subscribe(listener) {
		
	}

	replaceReducer(nextReducer) {
		this.reducer = nextReducer
	}
}

function createStore(reducer, initialState) {
	return new Store(reducer, initialState)
}

exports.createStore = createStore
