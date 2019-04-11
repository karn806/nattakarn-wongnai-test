class Store {
	constructor(reducer, initialState) {
		this.reducer = reducer
		this.state = initialState
		this.isDispatching = false
		this.currentListeners = []
		this.nextListeners = []
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
				const listeners = (this.currentListeners = this.nextListeners)
				console.log('currentLis:', this.currentListeners);
				for (let i = 0; i < listeners.length; i++) {
				  const listener = listeners[i]
				  listener()
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
		// console.log('listen:', listener);
		if (typeof listener !== 'function') {
	    throw new Error('Expected the listener to be a function.')
	  }

		if (this.isDispatching) {
	    throw new Error('You may not call store.subscribe() while the reducer is executing.')
  	}

		let isSubscribed = true

	  this.ensureCanMutateNextListeners()
	  this.nextListeners.push(listener)

		return function unsubscribe() {
	    if (!isSubscribed) {
	      return
	    }

	    if (this.isDispatching) {
	      throw new Error('You may not unsubscribe from a store listener while the reducer is executing.')
	    }

	    isSubscribed = false

	    this.ensureCanMutateNextListeners()
	    const index = this.nextListeners.indexOf(listener)
	    this.nextListeners.splice(index, 1)
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
