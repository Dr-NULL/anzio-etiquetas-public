export class Classes {
  [key: number]: string;

  private ref: HTMLElement[];
  private tmp: string[];
  public get length(): number {
    return this.tmp.length;
  }

  constructor(...src: HTMLElement[]) {
    const data: string[] = [];
    this.ref = src;
    this.getAll();
    this.setIndex();
  }

  private getAll() {
    const data: string[] = [];
    for (const item of this.ref) {
      item.classList.forEach(className => {
        data.push(className);
      });
    }

    this.tmp = data;
  }

  private setAll() {
    for (const item of this.ref) {
      item.classList.value = '';
      item.classList.add(...this.tmp);
    }
    this.setIndex();
  }

  private setIndex() {
    // Borrar anteriores propiedades
    for (let i = 0; i < this.tmp.length; i++) {
      delete this[i];
    }

    // Crear Nuevas propiedades
    for (let i = 0; i < this.tmp.length; i++) {
      Object.defineProperty(this, i, {
        configurable: true,
        enumerable: true,
        get: () => {
          this.getAll();
          return this.tmp[i];
        },
        set: (v: string) => {
          this.getAll();
          this.tmp[i] = v;
          this.setAll();
        }
      });
    }
  }

  forEach(callback: (name?: string, index?: number) => void) {
    this.getAll();
    this.tmp.forEach(callback);
    this.setAll();
  }

  clear() {
    this.tmp = [];
    this.setAll();
  }

  push(v: string) {
    this.getAll();
    this.tmp.push(v);

    for (const item of this.ref) {
      item.classList.add(v);
    }
  }

  remove(v: string) {
    this.getAll();
    let index: number;
    for (let i = 0; i < this.tmp.length; i++) {
      if (this.tmp[i] === v) {
        index = i;
      }
    }

    if (index != null) {
      this.tmp.splice(index, 1);
      this.setAll();
    }
  }
}
