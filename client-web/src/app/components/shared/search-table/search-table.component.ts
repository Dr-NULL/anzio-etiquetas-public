import { Component, OnInit, Input, Output, EventEmitter, Renderer2, ChangeDetectorRef } from '@angular/core';

interface GenericObject {
  [key: string]: any;
}

@Component({
  selector: 'app-search-table',
  templateUrl: './search-table.component.html',
  styleUrls: ['./search-table.component.scss']
})
export class SearchTableComponent implements OnInit {
  @Input()
  placeholder = 'Escriba aquí para realizar la búsqueda...';

  rawiInput: GenericObject[] = [];
  get input(): GenericObject[] {
    return this.rawiInput;
  }
  @Input()
  set input(v: GenericObject[]) {
    this.rawiInput = v;
    this.filter();
  }

  @Input()
  keys: string[] = [];

  @Output()
  output = new EventEmitter<GenericObject[]>();

  txt = '';
  reg: RegExp;

  constructor(
    private render: Renderer2,
    private detector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.filter();
  }

  onChange(input: HTMLInputElement) {
    this.txt = input
      .value
      .replace(/[^a-zÀ-ÖØ-öø-ʔʕ-ʯ0-9-_\s\.,]/gi, '');
    input.value = this.txt;

    const expr = input.value
      .replace(/\s+/gi, '\\s+')
      .replace(/\./gi, '\\.');

    if (expr.length > 0) {
      this.reg = new RegExp(expr, 'gi');
    } else {
      this.reg = null;
    }
    this.filter();
  }

  filter() {
    // Check null Array
    if (this.keys == null) {
      this.keys = [];
    }
    if (this.rawiInput == null) {
      this.rawiInput = [];
    }

    // Use Properties
    const output: GenericObject[] = [];
    for (const item of this.rawiInput) {
      // Get Keys
      if (this.keys.length === 0) {
        this.keys = Object.keys(item);
      }

      // Check Keys
      let found = false;
      if (!this.reg) {
        found = true;
      } else {
        for (const key of this.keys) {
          const comparer = this.getProp(item, key);
          if (comparer.match(this.reg)) {
            found = true;
            break;
          }
        }
      }

      if (found) {
        output.push(item);
      }
    }

    this.output.emit(output);
  }

  getProp(item: any, key: string) {
    const levels = key.split(/\./gi);
    if (levels.length === 0) {
      return item;
    } else if (levels.length === 1) {
      return item[key];
    } else {
      let value: any = item;
      for (const level of levels) {
        if (value[level]) {
          value = value[level];
        } else {
          value = '';
        }
      }

      return `${value}`;
    }
  }
}
