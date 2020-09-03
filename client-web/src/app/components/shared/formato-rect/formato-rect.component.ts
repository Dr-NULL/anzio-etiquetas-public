import { Component, OnInit, Input, Output, EventEmitter, Renderer2, ElementRef } from '@angular/core';
import { FormatoRect } from 'src/app/models';

@Component({
  selector: 'app-formato-rect',
  templateUrl: './formato-rect.component.html',
  styleUrls: ['./formato-rect.component.scss']
})
export class FormatoRectComponent implements OnInit {
  @Input()
  step = 0.5;

  @Input()
  index: number;

  @Input()
  width: number;

  @Input()
  height: number;

  @Output()
  modelChange = new EventEmitter<FormatoRect>();
  @Input()
  model: FormatoRect;

  @Output()
  selectedChange = new EventEmitter<number>();
  @Input()
  selected: number;

  constructor(
    private htmlSelf: ElementRef<HTMLElement>,
    private renderServ: Renderer2
  ) { }

  ngOnInit(): void { }

  onBlur() {
    this.selected = null;
  }

  onChange() {
    this.selected = this.index;
    this.modelChange.emit(this.model);
  }

  onFocus() {
    this.selected = this.index;
    this.selectedChange.emit(this.selected);
  }
}
