class Store {
	constructor(reducer, initialState) {
		this.reducer = reducer
		this.state = initialState
		this.isDispatching = false
		this.currentListeners = []
		this.nextListeners = this.currentListeners
		this.isSubscribed = false
		this.prevListener = function () {}
	}

	getState() {
		if (this.isDispatching) {
      throw new Error('You may not call store.getState() while the reducer is executing.')
    }
		return this.state
	}

	dispatch(action) {
		if (typeof action === 'undefined') {
			throw new Error('action is undefined')
		}
		if (this.isDispatching) {
			throw new Error('Reducers may not dispatch actions.')
		}

		let currentState = this.getState()

		try {
	    this.isDispatching = true
			currentState = this.reducer(currentState, action)
	  } finally {
	    this.isDispatching = false
	  }

		this.state = currentState

		const listeners = this.currentListeners = this.nextListeners
		listeners.forEach(listener => listener(currentState))
	}

	ensureCanMutateNextListeners() {
		if (this.nextListeners === this.currentListeners) {
			this.nextListeners = this.currentListeners.slice();
		}
	}

	subscribe(listener) {
		if (typeof listener !== 'function') {
	    throw new Error('Expected the listener to be a function.')
	  }
		if (this.isDispatching) {
	    throw new Error('You may not call store.subscribe() while the reducer is executing.')
  	}

		this.isSubscribed = true
		let currentListener = listener

		if (currentListener !== this.prevListener){
				this.nextListeners.push(currentListener)
		}

		this.prevListener = currentListener

		return function unsubscribe() {
	    if (!this.isSubscribed) {
	      return
	    }
	    if (this.isDispatching) {
	      throw new Error('You may not unsubscribe from a store listener while the reducer is executing.')
	    }

	    this.isSubscribed = false

			this.ensureCanMutateNextListeners()
	    const index = this.nextListeners.indexOf(listener)
	    this.nextListeners.splice(index, 1)
	  }.bind(this)
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
