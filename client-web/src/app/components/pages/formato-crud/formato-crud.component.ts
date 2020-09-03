import { Component, OnInit } from '@angular/core';
import { FormatoService, Formato } from 'src/app/services/formato/formato.service';
import { ModalGenService } from 'src/app/components/shared/modal-gen/modal-gen.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { FormatoCrudPrinterComponent } from '../formato-crud-printer/formato-crud-printer.component';
import { FormatoCrudAssignComponent } from '../formato-crud-assign/formato-crud-assign.component';

@Component({
  selector: 'app-formato-crud',
  templateUrl: './formato-crud.component.html',
  styleUrls: ['./formato-crud.component.scss']
})
export class FormatoCrudComponent implements OnInit {
  model: Formato[] = [];
  modelFilter: Formato[] = [];
  id: number = null;

  constructor(
    private modalGenServ: ModalGenService,
    private formatoServ: FormatoService,
    private modalServ: NzModalService,
    private msgServ: NzMessageService
  ) { }

  async ngOnInit() {
    try {
      const res = await this.formatoServ.getAll();
      this.model = res.data;

    } catch (err) {
      this.msgServ.error(
        'Error al obtener lista de usuarios',
        { nzDuration: 2500 }
      );
    }
  }

  onFilter(data: Formato[]) {
    this.modelFilter = [ ...data ];
  }

  checkCodigo(input: HTMLInputElement) {
    const item = this.model.find(x => x.id === this.id);
    input.value = input.value
      .toUpperCase()
      .replace(/\s+/gi, '');

    item.codigo = input.value;
  }

  checkDescripc(input: HTMLInputElement) {
    const item = this.model.find(x => x.id === this.id);
    input.value = input.value
      .replace(/^\s+$/gi, '')
      .replace(/\s+/gi, ' ');

    item.descripc = input.value;
  }

  onBlur() {
    const item = this.model.find(x => x.id === this.id);
    item.codigo = item.codigo.trim();
    item.descripc = item.descripc.trim();
  }

  onEdit(item: Formato) {
    const ref = new Formato();
    this.id = item.id;
    ref.id = item.id;
    ref.codigo = item.codigo;
    ref.descripc = item.descripc;
    ref.width = item.width;
    ref.height = item.height;
    ref.isActive = item.isActive;

    this.model = [ ...this.model.filter(x => x.id != null) ];
  }

  onChangeCodigo(input: HTMLInputElement) {
    const item = this.model.find(x => x.id === this.id);
    if (!item) {
      return;
    }

    item.codigo = input.value
      .replace(/\s+/gi, '')
      .toUpperCase();

    input.value = item.codigo;
  }

  onChangeDescripc(input: HTMLInputElement) {
    const item = this.model.find(x => x.id === this.id);
    if (!item) {
      return;
    }

    item.descripc = input.value
      .toUpperCase()
      .trim();

    input.value = item.descripc;
  }

  onChangeSize(input: HTMLInputElement) {
    const item = this.model.find(x => x.id === this.id);
    if (!item) {
      return;
    }

    item.codigo = input.value
      .replace(/\s+/gi, '')
      .toUpperCase();

    input.value = item.codigo;
  }

  async onSave(item: Formato) {
    const i = this.model.findIndex(x => x.id === item.id);

    try {
      // Save Changes
      if (item.id == null) {
        const res = await this.formatoServ.add(item);
        this.model[i] = res.data;
      } else {
        const res = await this.formatoServ.update(item);
        this.model[i] = res.data;
      }

      this.msgServ.success(
        'Cambio guardado correctamente!',
        { nzDuration: 2500 }
      );

      // Clear Selection
      this.id = null;
      this.model = [ ...this.model ];
    } catch (err) {
      this.modalGenServ.danger('Error!', err.details);
    }
  }

  onCancel() {
    if (this.id == null) {
      const i = this.model.findIndex(x => x.id == null);
      this.model.splice(i, 1);
    }

    this.id = null;
    this.model = [ ...this.model ];
  }

  canAdd() {
    if (this.model == null) {
      return false;
    } else {
      for (const item of this.model) {
        if (item.id == null) {
          return false;
        }
      }
      return true;
    }
  }

  canSave() {
    const item = this.model.find(x => x.id === this.id);

    if (
      (item.codigo.trim().length > 0) &&
      (item.descripc.trim().length > 0) &&
      (item.width > 0) &&
      (item.height > 0)
    ) {
      return true;
    } else {
      return false;
    }
  }

  addNew() {
    const ref = new Formato();
    ref.id = null;
    ref.isActive = true;
    ref.codigo = '';
    ref.descripc = '';
    ref.width = 0;
    ref.height = 0;

    this.id = null;
    this.model = [ ...this.model, ref ];
  }

  remove(item: Formato) {
    this.modalGenServ.danger(
      'Aviso!',
        `Usted está intentando eliminar el elemento <strong>"${item.codigo} - `
      + `${item.descripc}"</strong>. Este proceso es irreversible, ¿Desea continuar?`,
      {
        type: 'danger',
        text: 'Sí, eliminar!',
        faicon: 'far fa-trash-alt',
        callback: async () => {
          try {
            await this.formatoServ.remove(item.id);
            this.model = [
              ...this.model.filter(x => x.id !== item.id)
            ];

            this.msgServ.success('Formato eliminado correctamente');
          } catch (err) {
            this.modalGenServ.danger('Error!', err.details);
          }
        }
      },
      {
        type: 'primary',
        text: 'No, cancelar.',
        faicon: 'fas fa-times',
      }
    );
  }

  check(item: Formato) {
    return (item.id === this.id);
  }

  setPrinters(id: number) {
    this.modalServ.create({
      nzTitle: 'Configurar Impresoras',
      nzContent: FormatoCrudPrinterComponent,
      nzWidth: '80vw',
      nzStyle: {
        height: 'calc(100vh - 10rem)'
      },
      nzComponentParams: {
        id
      }
    });
  }

  setProducts(id: number) {
    this.modalServ.create({
      nzTitle: 'Configurar Impresoras',
      nzContent: FormatoCrudAssignComponent,
      nzWidth: 'calc(100vw - 10rem)',
      nzStyle: {
        height: 'calc(100vh - 10rem)'
      },
      nzComponentParams: {
        id
      }
    });
  }
}
