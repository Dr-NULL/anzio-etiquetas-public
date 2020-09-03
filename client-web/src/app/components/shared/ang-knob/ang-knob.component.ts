import {
  Component, OnInit, ViewChild, ElementRef,
  HostListener, Input, Output, EventEmitter, Renderer2
} from '@angular/core';

import { Parser } from 'src/app/utils/parser';
import { Regex } from 'src/app/utils/regex';

interface Dot {
  x: number;
  y: number;
}

@Component({
  selector: 'app-ang-knob',
  templateUrl: './ang-knob.component.html',
  styleUrls: ['./ang-knob.component.scss']
})
export class AngKnobComponent implements OnInit {
  @Input()
  public set model(v: number) {
    const parsed = new Parser(v);
    this.angle = parsed.toFloat(this.precision, 0, 360);
    this.value = parsed.toString(this.precision, 0, 360);
  }
  angle = 0;
  @Output()
  modelChange = new EventEmitter<number>();

  @Input()
  title: string;

  @Input()
  knobSize = '8.62rem';

  @Input()
  precision = 0;

  @Input()
  readOnly = false;

  @ViewChild('refKnob')
  refKnob: ElementRef<HTMLElement>;

  @ViewChild('refInput')
  refInput: ElementRef<HTMLInputElement>;

  value = '';
  active = false;
  constructor(
    private renderServ: Renderer2
  ) { }

  ngOnInit(): void {
    const parsed = new Parser(this.angle);
    this.angle = parsed.toFloat(this.precision);
    this.value = parsed.toString(this.precision);
  }

  onMouseDown(ev: MouseEvent) {
    ev.preventDefault();
    ev.stopImmediatePropagation();
    this.active = true;

    this.onMouseMove(ev);
  }

  @HostListener('document:mouseup', [ '$event' ])
  onMouseUp(ev: MouseEvent) {
    this.active = false;
  }

  @HostListener('document:mousemove', [ '$event' ])
  onMouseMove(ev: MouseEvent) {
    if (!this.active) {
      return;
    } else if (this.readOnly) {
      return;
    }

    const absCore: Dot = this.getCenter();
    const absMove: Dot = {
      x: ev.pageX,
      y: ev.pageY
    };

    const mouse: Dot = {
      x: absCore.x - absMove.x,
      y: absCore.y - absMove.y
    };

    let atan = Math.atan(mouse.y / mouse.x);
    atan = (360 * atan) / (2 * Math.PI);

    if (
      (mouse.x < 0) &&
      (mouse.y >= 0)
    ) {
      // Cuadrante 2
      atan += 180;
    } else if (
      (mouse.x < 0) &&
      (mouse.y < 0)
    ) {
      // cuadrante 3
      atan += 180;
    } else if (
      (mouse.x >= 0) &&
      (mouse.y < 0)
    ) {
      // cuadrante 4
      atan += 360;
    }

    const parsed = new Parser(atan);
    this.value = parsed.toString(this.precision);
    this.angle = parsed.toFloat(this.precision);
    this.modelChange.emit(this.angle);
  }

  getCenter(): Dot {
    const ref = this.refKnob.nativeElement.getBoundingClientRect();
    return {
      x: ref.x + (ref.width / 2),
      y: ref.y + (ref.height / 2)
    };
  }

  onChange(input: HTMLInputElement) {
    const value = input.value.trim();
    if (value.length === 0) {
      return;
    } else if (
      (this.precision > 0) &&
      value.match(/^[0-9]+(\.|,)$/gi)
    ) {
      return;
    }

    let parsed = new Parser(value);
    if (!parsed.isNumeric) {
      parsed = new Parser(this.angle);
    } else {}

    this.angle = parsed.toFloat(this.precision, 0, 360);
    this.value = this.angle.toString();

    // Input Update
    input.value = this.value;
    this.modelChange.emit(this.angle);
  }

  onBlur(input: HTMLInputElement) {
    const parsed = new Parser(this.angle);

    this.angle = parsed.toFloat(this.precision, 0, 360);
    this.value = parsed.toString(this.precision, 0, 360);

    // Input Update
    input.value = this.value;
    this.modelChange.emit(this.angle);
  }
}
