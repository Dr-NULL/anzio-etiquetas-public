import { ElementRef } from '@angular/core';
import { CSSProperties } from './css-properties';
import { ProBoolean } from './pro-boolean';
import { Classes } from './classes';

export class DomNode {
  [key: number]: HTMLElement;
  public classes: Classes;
  private ref: HTMLElement[] = [];
  public get length(): number {
    return this.ref.length;
  }

  constructor(...ref: Array<ElementRef<any> | HTMLElement | Node>) {
    for (let i = 0; i < ref.length; i++) {
      if ((ref[i] as ElementRef<any>).nativeElement != null) {
        this.ref.push((ref[i] as ElementRef<any>).nativeElement as HTMLElement);
      } else {
        this.ref.push(ref[i] as HTMLElement);
      }

      Object.defineProperty(this, i, {
        configurable: true,
        enumerable: true,
        get: () => {
          return this.ref[i];
        },
        set: (v: HTMLElement) => {
          this.ref[i] = v;
        }
      });
    }

    this.classes = new Classes(...this.ref);
  }

  private getElem(ref: DomNode | HTMLElement) {
    if ((ref as DomNode).ref != null) {
      return (ref as DomNode).ref;
    } else {
      return [ref as HTMLElement];
    }
  }

  setCss(css: CSSProperties) {
    for (const item of this.ref) {
      for (const key of Object.keys(css)) {
        item.style[key] = css[key];
      }
    }
  }

  getClasses() {
    const data: string[] = [];
    for (const item of this.ref) {
      item.classList.forEach(className => {
        data.push(className);
      });
    }

    return data;
  }

  bindEvent<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any) {
    for (const item of this.ref) {
      item.addEventListener(type, listener, false);
    }
  }

  unbindEvent<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any) {
    for (const item of this.ref) {
      item.removeEventListener(type, listener, false);
    }
  }

  isSame(ref: HTMLElement | DomNode) {
    const res = new ProBoolean();

    for (const item of this.ref) {
      const boo = item.isSameNode(this.getElem(ref)[0]);
      res.add(boo);
    }

    return res;
  }

  isDescendantOf(ref: HTMLElement | DomNode) {
    const imp = this.getElem(ref)[0];
    const res = new ProBoolean();

    for (const item of this.ref) {
      let tmp = item;
      let value = false;

      while (tmp != null) {
        if (tmp.isSameNode(imp)) {
          value = true;
          break;
        } else {
          tmp = tmp.parentElement;
        }
      }

      res.add(value);
    }

    return res;
  }

  getParents() {
    const data: Array<HTMLElement> = [];
    for (const item of this.ref) {
      data.push(item.parentElement);
    }

    return new DomNode(...data);
  }

  getChildren() {
    const data: HTMLElement[] = [];
    for (const item of this.ref) {
      const they = item.children;
      for (let i = 0; i < they.length; i++) {
        data.push(they.item(i) as HTMLElement);
      }
    }

    return new DomNode(...data);
  }

  querySelectorAll(query: string) {
    const nodes: HTMLElement[] = [];
    for (const item of this.ref) {
      item
        .querySelectorAll(query)
        .forEach((node: HTMLElement) => {
          nodes.push(node);
        });
    }

    return new DomNode(...nodes);
  }

  forEach(callback: (node?: HTMLElement, i?: number) => void) {
    this.ref.forEach(callback);
  }

  findIndex(test: (elem: HTMLElement) => boolean) {
    for (let i = 0; i < this.ref.length; i++) {
      if (test(this.ref[i])) {
        return i;
      }
    }

    return null;
  }
}
