import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

import { PrinterService, Printer } from 'src/app/services/printer/printer.service';
import { ModalGenService } from 'src/app/components/shared/modal-gen/modal-gen.service';
import { Http } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-formato-crud-printer',
  templateUrl: './formato-crud-printer.component.html',
  styleUrls: ['./formato-crud-printer.component.scss']
})
export class FormatoCrudPrinterComponent implements OnInit {
  id: number;
  prtAvailable: Printer[] = [];
  prtAssigned: Printer[] = [];


  constructor(
    private refSelf: NzModalRef,
    private msgServ: NzMessageService,
    private printServ: PrinterService,
    private modalGenServ: ModalGenService
  ) { }

  async ngOnInit() {
    let failed = false;
    const FAIL = (err: any) => {
      if (!failed) {
        failed = true;
        this.refSelf.destroy();
        this.modalGenServ.danger(
          'Error!',
            `No se pudo cargar la información de las impresoras.\n<br />`
          + `<code>${err.details}</code>`
        );
      }
    };

    this.printServ.getAll()
      .catch(FAIL)
      .then(res => {
        this.prtAvailable = (res as Http<Printer[]>).data;
      });

    this.printServ.getByFormatoId(this.id)
      .catch(FAIL)
      .then(res => {
        this.prtAssigned = (res as Http<Printer[]>).data;
      });
  }

  onDismiss() {
    this.refSelf.destroy();
  }

  onAdd(item: Printer) {
    const found = this.prtAssigned.find(x => {
      return item.name === x.name;
    });

    if (found == null) {
      this.prtAssigned.push(item);
    }
  }

  onRemove(i: number) {
    this.prtAssigned.splice(i, 1);
  }

  async onSave() {
    this.refSelf.destroy();

    try {
      await this.printServ.setByFormatoId(
        this.id,
        this.prtAssigned
      );

      this.msgServ.success('Impresoras asignadas correctamente.');
    } catch (err) {
      if (err.details == null) {
        err.details = '';
      }

      this.modalGenServ.danger(
        'Error!',
          'Error al guardar las impresoras seleccionadas. '
        + err.details
      );
    }
  }
}
