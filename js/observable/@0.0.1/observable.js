class Observable {
  constructor(value) {
    this._value = value;
    this._subs = new Map();
  }

  get value() {
    return this._value;
  }

  set value(newValue) {
    // Skip if value hasn't actually changed
    if (newValue === this._value) return;
    
    const oldValue = this._value;
    this._value = newValue;
    
    // Notify all subscribers with error isolation
    this._subs.forEach(callback => {
      try {
        callback(this._value, oldValue);
      } catch (err) {
        console.error('Observable subscriber error:', err);
      }
    });
  }

  subscribe(callback, immediate = false) {
    const sym = Symbol();
    this._subs.set(sym, callback);
    
    // Optionally invoke callback immediately with current value
    if (immediate) {
      try {
        callback(this._value, this._value);
      } catch (err) {
        console.error('Observable subscriber error:', err);
      }
    }
    
    // Return unsubscribe function
    return () => {
      this._subs.delete(sym);
    };
  }

  dispose() {
    this._subs.clear();
  }
}

export default Observable;
