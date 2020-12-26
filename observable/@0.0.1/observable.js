class Observable {
  constructor(value) {
    this._value = value;
    this._subs = {};
  }

  get value() {
    return this._value;
  }

  set value(newValue) {
    const oldValue = this._value;
    this._value = newValue;
    Object.getOwnPropertySymbols(this._subs).forEach(symKey => {
      this._subs[symKey](this._value, oldValue);
    });
  }

  subscribe(cb) {
    const sym = Symbol();
    this._subs[sym] = cb;

    return () => {
      delete this._subs[sym];
    }
  }
}

export default Observable;