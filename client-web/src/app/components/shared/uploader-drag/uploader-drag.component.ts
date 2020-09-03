import { Component, OnInit, OnDestroy, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { PictureService } from 'src/app/services/picture/picture.service';

@Component({
  selector: 'app-uploader-drag',
  templateUrl: './uploader-drag.component.html',
  styleUrls: ['./uploader-drag.component.scss'],
  animations: [
    trigger('insertFile', [
      transition(
        ':enter',
        [
          style({
            opacity: 0,
            height: '0'
          }),
          animate(
            '250ms  ease-out',
            style({
              opacity: 1,
              height: '1.25rem'
            })
          )
        ]
      ),
      transition(
        ':leave',
        [
          style({
            height: '1.25rem'
          }),
          animate(
            '250ms ease-in',
            style({
              opacity: 0,
              height: '0'
            })
          )
        ]
      )
    ])
  ]
})
export class UploaderDragComponent implements OnInit, OnDestroy {
  public static count = 0;
  id: string;

  private dragEvents: Array<keyof HTMLElementEventMap> = [ 'dragenter', 'dragover' ];

  @Output()
  modelChange = new EventEmitter<File[]>();
  @Input()
  model: File[] = [];

  @ViewChild('container', { static: true})
  container: ElementRef<HTMLElement>;

  @Input()
  multiple = true;

  @Input()
  types: string[] = [ ];

  constructor(
    private htmlSelf: ElementRef<HTMLElement>
  ) { }

  ngOnInit(): void {
    this.id = `bin-${UploaderDragComponent.count}`;
    UploaderDragComponent.count++;
    this.model = [];

    // Agregar eventos de Arrastre
    for (const event of this.dragEvents) {
      this.addEvent(this.container, event, this.onMouseDrag.bind(this));
    }
    this.addEvent(this.container, 'dragleave', this.onMouseDrop.bind(this));
    this.addEvent(this.container, 'drop', this.onDropFiles.bind(this));
  }

  ngOnDestroy() {
    // Quitar eventos de Arrastre
    for (const event of this.dragEvents) {
      this.remEvent(this.container, event, this.onMouseDrag.bind(this));
    }
    this.remEvent(this.container, 'dragleave', this.onMouseDrop.bind(this));
    this.remEvent(this.container, 'drop', this.onDropFiles.bind(this));
  }

  addEvent<K extends keyof HTMLElementEventMap>(
    elem: ElementRef<HTMLElement>,
    event: K,
    listener: (
      this: UploaderDragComponent,
      ev: HTMLElementEventMap[K]
    ) => any
  ) {
    elem.nativeElement.addEventListener(event, listener, false);
  }

  remEvent<K extends keyof HTMLElementEventMap>(
    elem: ElementRef<HTMLElement>,
    event: K, listener: (
      this: UploaderDragComponent,
      ev: HTMLElementEventMap[K]
    ) => any
  ) {
    elem.nativeElement.removeEventListener(event, listener, false);
  }

  onChange(ev: HTMLInputElement) {
    if (!this.multiple) {
      this.model = [];
    }

    for (let i = 0; i < ev.files.length; i++) {
      const item = ev.files.item(i);
      const index = this.model.findIndex(x => x.name === item.name);

      // Buscar coincidencias en el Modelo
      if (index >= 0) {
        this.model.splice(index, 1);
      }
      this.model.push(item);

      if (!this.multiple) {
        break;
      }
    }

    this.modelChange.emit(this.model);
  }

  trackByFunc(index: number, item: any) {
    return index;
  }

  getAcceptedExt() {
    let out = '';
    this.types.forEach((ext, i) => {
      if (i === 0) {
        out = ext;
      } else {
        out += ',.' + ext;
      }
    });

    return out;
  }

  onMouseDrag(ev: DragEvent) {
    ev.preventDefault();

  }

  onMouseDrop(ev: DragEvent) {
    ev.preventDefault();
  }

  onDropFiles(ev: DragEvent) {
    ev.preventDefault();
    const files = ev.dataTransfer.files;

    if (this.multiple) {
      for (let i = 0; i < files.length; i++) {
        const item = files.item(i);
        const index = this.model.findIndex(x => x.name === item.name);

        if (index >= 0) {
          this.model.splice(index, 1);
        }

        // Validar Extensión
        if (this.types.length > 0) {
          let found = false;
          for (const type of this.types) {
            if (item.name.toLowerCase().endsWith(type.toLowerCase())) {
              found = true;
              break;
            }
          }
          if (found) {
            this.model.push(item);
          }
        } else {
          this.model.push(item);
        }
      }
    } else if (this.model.length === 0) {
      this.model = [];
      this.model.push(files.item(0));
    }

    this.modelChange.emit(this.model);
  }

  onRemoveItem(i: number) {
    if (i < this.model.length) {
      this.model.splice(i, 1);
      this.modelChange.emit(this.model);
    }
  }
}
