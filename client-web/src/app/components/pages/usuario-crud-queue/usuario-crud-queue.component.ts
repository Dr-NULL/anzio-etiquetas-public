import { Component, OnInit } from '@angular/core';
import { UsuarioQueue } from 'src/app/models';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';

import { ModalGenService } from '../../shared/modal-gen/modal-gen.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import * as moment from 'moment';

@Component({
  selector: 'app-usuario-crud-queue',
  templateUrl: './usuario-crud-queue.component.html',
  styleUrls: ['./usuario-crud-queue.component.scss']
})
export class UsuarioCrudQueueComponent implements OnInit {
  data: Data[];
  dataFiltered: Data[];
  filter = [
    'user',
    'mail',
    'usuarioTipo.nombre',
    'createdAtStr',
    'creator.user',
    'creator.usuarioTipo.nombre'
  ];

  constructor(
    private refSelf: NzModalRef,
    private msgServ: NzMessageService,
    private userServ: UsuarioService,
    private mdlGenRef: ModalGenService,
  ) { }

  async ngOnInit() {
    try {
      const resp = await this.userServ.getAllQueue();
      this.data = resp.data.map((x: Data) => {
        x.createdAtStr = moment(x.createdAt).format('DD/MM/YYYY hh:mm:ss');
        x.statusStr = (x.creator.isActive) ? 'Activo' : 'Deshabilitado';
        return x;
      });

    } catch (err) {
      this.error(err);
    }
  }

  error(err: any) {
    this.mdlGenRef.danger(
      'Error!',
      (err.details) ? err.details : err.message
    );
  }

  filterData(data: Data[]) {
    this.dataFiltered = [ ...data ];
  }

  dismiss() {
    this.refSelf.destroy();
  }

  async delete(item: UsuarioQueue) {
    try {
      // Borrar del servidor
      await this.userServ.delQueue(item.id);
      this.msgServ.success('Solicitud pendiente eliminada correctamente.');

      // Borrar del frontend
      this.data = [ ...this.data.filter(x => x.id !== item.id) ];
    } catch (err) {
      this.error(err);
    }
  }
}

interface Data extends UsuarioQueue {
  createdAtStr: string;
  statusStr: string;
}
