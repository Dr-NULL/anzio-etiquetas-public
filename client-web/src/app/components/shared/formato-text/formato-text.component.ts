import { Component, OnInit, DoCheck, Input, EventEmitter, Output, ElementRef, Renderer2 } from '@angular/core';
import { FormatoText } from '../../../models/formato-text';
import { Fuente } from 'src/app/models';
import { FuenteService } from 'src/app/services/fuente/fuente.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-formato-text',
  templateUrl: './formato-text.component.html',
  styleUrls: ['./formato-text.component.scss']
})
export class FormatoTextComponent implements OnInit {
  private static fuentes: Fuente[] = [];
  public get fuentes(): Fuente[] {
    return FormatoTextComponent.fuentes;
  }

  get lateralus() {
    return Math.sqrt((this.width ** 2) + (this.height ** 2));
  }

  @Input()
  step = 0.5;

  @Input()
  index: number;

  @Input()
  width: number;

  @Input()
  height: number;

  @Output()
  selectedChange = new EventEmitter<number>();
  @Input()
  selected: number;

  @Output()
  modelChange = new EventEmitter<FormatoText>();
  @Input()
  model: FormatoText;

  constructor(
    private htmlSelf: ElementRef<HTMLElement>,
    private fuenteServ: FuenteService,
    private messageServ: NzMessageService,
    private renderServ: Renderer2
  ) { }

  async ngOnInit() {
    try {
      const resp = await this.fuenteServ.getAll();
      FormatoTextComponent.fuentes = resp.data;
    } catch (err) {
      this.messageServ.error('Las fuentes no pudieron cargarse.');
    }
  }

  onBlur() {
    this.selected = null;
  }

  onChange() {
    const font = this.fuentes.find(x => `${x.id}` === `${this.model.fuente.id}`);
    if (font != null) {
      this.model.fuente = new Fuente();
      this.model.fuente.id = font.id;
      this.model.fuente.nombre = font.nombre;
      this.model.fuente.fontFace = font.fontFace;
      this.model.fuente.filename = font.filename;
    }

    this.selected = this.index;
    this.modelChange.emit(this.model);
  }

  onFocus() {
    this.selected = this.index;
    this.selectedChange.emit(this.selected);
  }
}
