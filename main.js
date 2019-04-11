class Store {
	constructor(reducer, initialState) {
		this.listeners = []
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
				this.listeners.slice().forEach(listener => listener());
		}
	}

	subscribe(listener) {
		if (typeof listener !== 'function') {
	    throw new Error('Expected the listener to be a function.')
	  } else {
			this.listeners.push(listener);
		  return function unsubscribe() {
		    var index = this.listeners.indexOf(listener);
		    this.listeners.splice(index, 1);
		  }
		}
	}

	replaceReducer(nextReducer) {
		if (typeof nextReducer !== 'function') {
	    throw new Error('Expected the reducer to be a function.')
	  } else {
			this.reducer = nextReducer
		}
	}
}

function createStore(reducer, initialState) {
	if (typeof reducer !== 'function') {
		throw new Error('Expected the reducer to be a function.')
	} else {
			return new Store(reducer, initialState)
	}
}

exports.createStore = createStore
