class Store {
	constructor(reducer, initialState) {
		this.reducer = reducer
		this.state = {
			initialState: initialState,
			isDispatching: false
		}
		this.currentListeners = []
		this.nextListeners = []
	}

	getState() {
		return this.state.initialState
	}

	dispatch(action) {
		switch (action) {
			case undefined:
				throw new Error('action is undefined')
			default:
				const newState = this.reducer(this.state, action)
				this.state = newState
				const listeners = (this.currentListeners = this.nextListeners)
				for (let i = 0; i < listeners.length; i++) {
				  const listener = listeners[i]
					listener(newState)
				}
		}
		return action
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

		if (this.state.isDispatching) {
	    throw new Error('You may not call store.subscribe() while the reducer is executing.')
  	}

		let isSubscribed = true
		let isDispatching = this.isDispatching

	  this.ensureCanMutateNextListeners()
	  this.nextListeners.push(listener)

		return function unsubscribe() {
	    if (!isSubscribed) {
	      return
	    }

	    if (isDispatching) {
	      throw new Error('You may not unsubscribe from a store listener while the reducer is executing.')
	    }

	    isSubscribed = false

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
