export class ProBoolean {
  private _all: boolean[];
  public get all() {
    return this._all;
  }

  private _and: boolean;
  public get and() {
    return this._and;
  }

  private _or: boolean;
  public get or() {
    return this._or;
  }

  private _xor: boolean;
  public get xor() {
    return this._xor;
  }

  public constructor() {
    this._all = [];
    this._and = true;
    this._or = false;
    this._xor = false;
  }

  public add(v: boolean) {
    this._all.push(v);

    // Comprobar AND
    if (v === false) {
      this._and = false;
    }

    // Comprobar OR
    if (v === true) {
      this._or = true;
      this._xor = true;
    }

    // Comprobar XOR
    if (this._and && this._or) {
      this._xor = false;
    }
  }
}
