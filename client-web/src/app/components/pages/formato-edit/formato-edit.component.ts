import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FuenteService, Fuente } from 'src/app/services/fuente/fuente.service';
import { FormatoService, Formato, FormatoText, FormatoRect } from 'src/app/services/formato/formato.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Error } from 'src/app/services/http/http.service';
import { FormatoPict } from 'src/app/models/formato-pict';
import { ModalLoadingService } from 'src/app/components/shared/modal-loading/modal-loading.service';
import { ModalGenService } from 'src/app/components/shared/modal-gen/modal-gen.service';

@Component({
  selector: 'app-label-edit',
  templateUrl: './formato-edit.component.html',
  styleUrls: ['./formato-edit.component.scss']
})
export class FormatoEditComponent implements OnInit {
  fonts: Array<Fuente> = [];
  label = new Formato();
  selected: number;
  tab = 0;

  constructor(
    private fontServ: FuenteService,
    private formatoServ: FormatoService,
    private messageCtrl: NzMessageService,
    private routerCurrServ: ActivatedRoute,
    private routerServ: Router,
    private modalLoadingServ: ModalLoadingService,
    private modalGenServ: ModalGenService
  ) { }

  trackByFunc(index: number, item: any) {
    return index;
  }

  async ngOnInit() {
    this.routerCurrServ.paramMap.subscribe(async params => {
      try {
        const res1 = await this.formatoServ.get(params.get('codigo'));
        this.label = res1.data;

        const res2 = await this.fontServ.getAll();
        this.fonts = res2.data;
      } catch (err) {
        this.modalGenServ.danger(
          'Error!',
          err.details,
          {
            faicon: '',
            text: 'Aceptar',
            callback: () => {
              this.routerServ.navigate(['/formato/crud']);
            }
          }
        );

        setTimeout(() => {
          this.modalGenServ.hide();
          this.routerServ.navigate(['/formato/crud']);
        }, 3000);
      }
    });
  }

  onClickText(i: number) {
    this.tab = 0;
    location.hash = `card-${i}`;
    this.onFocusCard(
      i,
      'textarea'
    );
  }

  onClickRect(i: number) {
    const index = this.label.formatoText.length + i;
    this.tab = 1;

    location.hash = `card-${index}`;
    this.onFocusCard(
      index,
      'input'
    );
  }

  onClickPict(i: number) {
    const index = this.label.formatoRect.length
      + this.label.formatoText.length
      + i;

    this.tab = 2;
    location.hash = `card-${index}`;
    this.onFocusCard(
      index,
      'input'
    );
  }

  onEditContentText(i: number, ev: KeyboardEvent) {
    const target = ev.currentTarget as HTMLInputElement;
    const data = this.label.formatoText;
  }

  onBlur(ev: FocusEvent) {
    if (ev.relatedTarget == null) {
      this.selected = null;
    }
  }

  async onSave() {
    try {
      this.modalLoadingServ.show('Guardando...', 'Espere hasta que los cambios efectuados sean aplicados.');
      await this.formatoServ.updateDeep(this.label);
      this.messageCtrl.success(
        'Cambios guardados correctamente.'
      );

      this.selected = null;
    } catch (err) {
      this.messageCtrl.error(
        (err as Error).details
      );
    } finally {
      this.modalLoadingServ.hide();
    }
  }

  onNewText() {
    const item = new FormatoText();
    item.x = 0;
    item.y = 0;
    item.width = this.label.width;
    item.height = this.label.height;
    item.fontSize = 10;
    item.fuente = this.fonts[0];
    item.align = 'left';
    item.text = 'Ingrese su Texto Aquí.';
    item.printOriginal = true;
    item.printCopy = true;
    this.label.formatoText.push(item);

    this.onFocusCard(
      this.label.formatoText.length - 1,
      'textarea'
    );
  }

  onRemoveText() {
    if (this.selected != null) {
      this.label.formatoText.splice(this.selected, 1);
      this.selected = null;
    }
  }

  onNewRect() {
    const item = new FormatoRect();
    item.x = 0;
    item.y = 0;
    item.width = this.label.width;
    item.height = this.label.height;
    item.cornerRadius = 0;
    item.lineWidth = 1;
    item.color = '#000';
    this.label.formatoRect.push(item);

    this.onFocusCard(
      this.label.formatoText.length
      + this.label.formatoRect.length - 1,
      'input'
    );
  }

  onRemoveRect() {
    if (this.selected != null) {
      const pos = this.selected - this.label.formatoText.length;
      if (pos >= 0) {
        this.label.formatoRect.splice(pos, 1);
        this.selected = null;
      }
    }
  }

  onNewPict() {
    const pict = new FormatoPict();
    pict.x = 0;
    pict.y = 0;
    pict.width = this.label.width;
    pict.height = this.label.height;
    this.label.formatoPict.push(pict);

    this.onFocusCard(
      this.label.formatoText.length
      + this.label.formatoRect.length
      + this.label.formatoPict.length - 1,
      'input'
    );
  }

  onRemovePict() {
    if (this.selected != null) {
      const pos = this.selected
        - this.label.formatoRect.length
        - this.label.formatoText.length;
      if (pos >= 0) {
        this.label.formatoPict.splice(pos, 1);
        this.selected = null;
      }
    }
  }

  onFocusCard(i: number, selector: string) {
    return new Promise(resolve => {
      this.selected = i;
      setTimeout(() => {
        const card = document
          .querySelector(`#card-${i} ${selector}`) as HTMLElement;
        card.focus();
      }, 250);
    });
  }
}
