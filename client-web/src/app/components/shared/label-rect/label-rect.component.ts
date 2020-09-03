import { Component, OnInit, Input, Output, EventEmitter, DoCheck, ElementRef } from '@angular/core';
import { FormatoRect } from '../../../models/formato-rect';
import { DomNode } from 'src/app/utils/dom-node';

@Component({
  selector: 'app-label-rect',
  templateUrl: './label-rect.component.html',
  styleUrls: ['./label-rect.component.scss']
})
export class LabelRectComponent implements OnInit, DoCheck {
  @Output()
  modelChange = new EventEmitter<FormatoRect>();
  modelValue: FormatoRect;
  modelView: FormatoRect;
  public get model(): FormatoRect {
    return this.modelValue;
  }
  @Input()
  public set model(v: FormatoRect) {
    this.modelValue = v;
    this.ngDoCheck();
    this.modelChange.emit(v);
  }

  @Output()
  scaleChange = new EventEmitter<number>();
  scaleValue = 0;
  public get scale(): number {
    return this.scaleValue;
  }
  @Input()
  public set scale(v: number) {
    this.scaleValue = v;
  }

  constructor(
    private refSelf: ElementRef<HTMLElement>
  ) { }

  ngOnInit(): void {
    if (this.model == null) {
      this.model = new FormatoRect();
    }

    this.ngDoCheck();
  }

  ngDoCheck() {
    if (this.modelValue == null) {
      return;
    }

    this.modelView = new FormatoRect();
    this.modelView.x = this.modelValue.x * this.scale;
    this.modelView.y = this.modelValue.y * this.scale;
    this.modelView.width = this.modelValue.width * this.scale;
    this.modelView.height = this.modelValue.height * this.scale;
    this.modelView.lineWidth = this.modelValue.lineWidth * this.scale;
    this.modelView.cornerRadius = this.modelValue.cornerRadius * this.scale;

    const node = new DomNode(this.refSelf);
    node.setCss({
      left: `${this.modelView.x}px`,
      top: `${this.modelView.y}px`,
      width: `${this.modelView.width}px`,
      height: `${this.modelView.height}px`,
      borderWidth: `${this.modelView.lineWidth}px`,
      borderRadius: `${this.modelView.cornerRadius}px`
    });
  }
}
