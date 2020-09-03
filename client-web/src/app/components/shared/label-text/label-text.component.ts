import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ElementRef, Renderer2, DoCheck } from '@angular/core';
import { FormatoTestComponent } from '../formato-test/formato-test.component';
import { FormatoText } from '../../../models/formato-text';
import { Barcode } from 'src/app/utils/barcode';
import { Fuente } from 'src/app/models';

@Component({
  selector: 'app-label-text',
  templateUrl: './label-text.component.html',
  styleUrls: ['./label-text.component.scss']
})
export class LabelTextComponent implements OnInit, OnDestroy, DoCheck {
  get test() {
    return FormatoTestComponent.model;
  }

  public get model() {
    return this.modelValue;
  }
  @Input()
  public set model(v: FormatoText) {
    if (v == null) {
      this.modelValue = new FormatoText();
    } else {
      this.modelValue = v;
    }

    this.modelChange.emit(this.modelValue);
    this.ngDoCheck();
  }

  public get scale() {
    return this.scaleValue;
  }
  @Input()
  public set scale(v: number) {
    if (v == null) {
      v = 0;
    }

    this.scaleValue = v;
    this.ngDoCheck();
  }

  constructor(
    private refSelf: ElementRef<HTMLElement>,
    private render: Renderer2
  ) { }
  modelView = new FormatoText();
  modelValue = new FormatoText();
  scaleValue = 0;
  marginTop = 0;

  @Output()
  modelChange = new EventEmitter<FormatoText>();
  selected = new EventEmitter<FormatoText>();
  fontOffset = 3.77;

  ngOnInit(): void {
    window.addEventListener('resize', this.ngDoCheck.bind(this));
    this.ngDoCheck();
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.ngDoCheck.bind(this));
  }

  ngDoCheck() {
    this.modelView = new FormatoText();
    this.modelView.printOriginal = this.modelValue.printOriginal;
    this.modelView.printCopy = this.modelValue.printCopy;
    this.modelView.align = this.modelValue.align;
    this.modelView.x = this.modelValue.x * this.scale;
    this.modelView.y = this.modelValue.y * this.scale;
    this.modelView.width = this.modelValue.width * this.scale;
    this.modelView.height = this.modelValue.height * this.scale;
    this.modelView.angle = this.modelValue.angle;
    this.modelView.fontSize = (this.modelValue.fontSize * this.scale / this.fontOffset);

    this.modelView.fuente = new Fuente();
    this.modelView.fuente.id = this.modelValue.fuente.id;
    this.modelView.fuente.nombre = `"${this.modelValue.fuente.nombre}"`;
    this.modelView.fuente.fontFace = `"${this.modelValue.fuente.fontFace}"`;

    if (this.modelValue.fuente.fontFace.toLowerCase() === 'code-128') {
      this.marginTop = this.modelValue.fontSize * 0.5;
    } else {
      this.marginTop = 0;
    }

    // Alter Component
    this.render.setStyle(this.refSelf.nativeElement, 'left', `${this.modelView.x}px`);
    this.render.setStyle(this.refSelf.nativeElement, 'top', `${this.modelView.y}px`);
    this.render.setStyle(this.refSelf.nativeElement, 'width', `${this.modelView.width}px`);
    this.render.setStyle(this.refSelf.nativeElement, 'height', `${this.modelView.height}px`);
    this.render.setStyle(this.refSelf.nativeElement, 'transform-origin', `0 0`);
    this.render.setStyle(this.refSelf.nativeElement, 'transform', `rotate(${this.modelView.angle}deg)`);

    // Change Texts
    this.modelView.text = this.modelValue.text.replace(/\n/gi, '<br />');
    this.modelView.loadData(this.test);

    // Convert to Barcode
    if (this.modelValue.fuente.nombre.toLowerCase() === 'code-128') {
      this.modelView.text = Barcode.to128(this.modelView.text);
    }
  }

  onSelectedEvent() {
    this.selected.emit(this.modelValue);
  }
}
