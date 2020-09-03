import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ElementRef, Renderer2, HostListener } from '@angular/core';
import { Formato, Etiqueta } from '../../../models';
import { DomNode } from '../../../utils/dom-node';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class LabelComponent implements OnInit, OnDestroy {
  scale: number;                // Escala de vizualización

  @Input()
  showOriginal = true;

  @Output()
  private modelChange = new EventEmitter<Formato>();
  modelValue: Formato;
  modelView: Formato;

  public get model(): Formato {
    return this.modelValue;
  }
  @Input()
  public set model(v: Formato) {
    if (v == null) {
      this.modelValue = new Formato();
    } else {
      this.modelValue = v;
    }

    this.modelChange.emit(this.modelValue);
    this.onResize();
  }

  @Output()
  private selectionChange = new EventEmitter<number>();
  selectionValue: number;

  public get selection() {
    return this.selectionValue;
  }
  @Input()
  public set selection(v: number) {
    this.selectionValue = v;
    this.selectionChange.emit(v);
  }
  @Output()
  clickText = new EventEmitter<number>();
  @Output()
  clickRect = new EventEmitter<number>();
  @Output()
  clickPict = new EventEmitter<number>();

  constructor(
    private refSelf: ElementRef<HTMLElement>,
    private render: Renderer2
  ) { }

  ngOnInit(): void {
    this.model = null;
    window.addEventListener('resize', this.onResize.bind(this));
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  onResize() {
    this.modelView = new Formato();
    const padding = 32;
    const parent = this.refSelf
      .nativeElement
      .parentElement;

    // Establecer medidas actuales
    const size: { [key: string]: { width: number; height: number; } } = {
      child: {
        width: this.modelValue.width,
        height: this.modelValue.height
      },
      parent: {
        width: parent.offsetWidth - padding,
        height: parent.offsetHeight - padding
      }
    };

    // Calcular escala a aplicar
    if (size.child.width >= size.child.height) {
      this.scale = size.parent.width / size.child.width;
    } else {
      this.scale = size.parent.height / size.child.height;
    }

    // Aplicar Escala
    this.modelView.width = this.modelValue.width * this.scale;
    this.modelView.height = this.modelValue.height * this.scale;

    // Volver a comprobar escala
    if (this.modelView.height >= size.parent.height) {
      const tmp = size.parent.height / this.modelView.height;
      this.scale = this.scale * tmp;

      // Volver a aplicar Escala
      this.modelView.width = this.modelView.width * tmp;
      this.modelView.height = this.modelView.height * tmp;
    } else if (this.modelView.width > size.parent.width) {
      const tmp = size.parent.width / this.modelView.width;
      this.scale = this.scale * tmp;

      // Volver a aplicar Escala
      this.modelView.width = this.modelView.width * tmp;
      this.modelView.height = this.modelView.height * tmp;
    }

    this.render.setStyle(this.refSelf.nativeElement, 'width', `${this.modelView.width}px`);
    this.render.setStyle(this.refSelf.nativeElement, 'height', `${this.modelView.height}px`);
  }

  onClickText(i: number) {
    this.clickText.emit(i);
    this.selection = i;
  }

  onClickRect(i: number) {
    this.clickRect.emit(i);
    this.selection = this.modelValue.formatoText.length + i;
  }

  onClickPict(i: number) {
    this.clickPict.emit(i);
    this.selection = this.modelValue.formatoPict.length + this.modelValue.formatoText.length + i;
  }

  @HostListener('document:click', [ '$event' ])
  onOwnerClick(ev: MouseEvent) {
    const ownr = new DomNode(this.refSelf.nativeElement);
    const targ = new DomNode(ev.target as HTMLElement);
    const pare = ownr.getParents();

    if (
      (targ.isSame(pare).and) ||
      (targ.isSame(ownr).and)
    ) {
      this.selection = null;
    }
  }

  trackByFunc(index: number, node: any) {
    return index;
  }
}
