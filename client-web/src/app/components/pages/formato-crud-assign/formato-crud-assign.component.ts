import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ModalGenService } from 'src/app/components/shared/modal-gen/modal-gen.service';
import { Http } from 'src/app/services/http/http.service';

import { FormatoConfig, FormatoService, IRawConfig } from 'src/app/services/formato/formato.service';
import { Pais, PaisService } from 'src/app/services/pais/pais.service';
import { Producto, ProductoService } from 'src/app/services/producto/producto.service';

interface IChk<T> {
  checked: boolean;
  value: T;
}

@Component({
  selector: 'app-formato-crud-assign',
  templateUrl: './formato-crud-assign.component.html',
  styleUrls: ['./formato-crud-assign.component.scss']
})
export class FormatoCrudAssignComponent implements OnInit {
  id: number;
  arrPais: IChk<Pais>[] = [];
  arrProd: IChk<Producto>[] = [];
  arrConf: IChk<FormatoConfig>[] = [];

  arrPaisFilter: IChk<Pais>[] = [];
  arrProdFilter: IChk<Producto>[] = [];
  arrConfFilter: IChk<FormatoConfig>[] = [];

  failed = false;
  chkPais = false;
  chkProd = false;
  chkConf = false;

  constructor(
    private msgServ: NzMessageService,
    private selfRef: NzModalRef,
    private paisServ: PaisService,
    private confServ: FormatoService,
    private prodServ: ProductoService,
    private modalGenServ: ModalGenService
  ) { }

  async ngOnInit() {
    const PROM: Promise<any>[] = [];
    PROM.push(
      this.paisServ.getAll()
      .catch(this.onCatch)
      .then((res: Http<Pais[]>) => {
        this.arrPais = [];
        for (const ITEM of res.data) {
          this.arrPais.push({
            checked: false,
            value: ITEM
          });
        }
      })
    );

    PROM.push(
      this.prodServ.getAll()
      .catch(this.onCatch)
      .then((res: Http<Producto[]>) => {
        this.arrProd = [];
        for (const ITEM of res.data) {
          this.arrProd.push({
            checked: false,
            value: ITEM
          });
        }
      })
    );

    PROM.push(
      this.confServ.getConfig(this.id)
      .catch(this.onCatch)
      .then((res: Http<FormatoConfig[]>) => {
        this.arrConf = [];
        for (const ITEM of res.data) {
          this.arrConf.push({
            checked: false,
            value: ITEM
          });
        }
      })
    );
  }

  onCatch(err: any) {
    if (!this.failed) {
      this.failed = true;

      this.selfRef.destroy();
      this.modalGenServ.danger(
        'Error!',
          `Hubo un problema al obtener los recursos asociados.\n<br />`
        + `<strong>Detalles:</strong><br />`
        + `<code>${err.details}</code>`
      );
    }
  }

  filterPais(data: IChk<Pais>[]) {
    this.arrPaisFilter = [ ...data ];
  }

  filterProd(data: IChk<Producto>[]) {
    this.arrProdFilter = [ ...data ];
  }

  filterConf(data: IChk<FormatoConfig>[]) {
    this.arrConfFilter = [ ...data ];
  }

  onCheck() {
    const PAIS = this.arrPais.find(x => !x.checked);
    this.chkPais = PAIS == null;

    const PROD = this.arrProd.find(x => !x.checked);
    this.chkProd = PROD == null;

    if (this.arrConf.length > 0) {
      const CONF = this.arrConf.find(x => !x.checked);
      this.chkConf = CONF == null;
    } else {
      this.chkConf = false;
    }
  }

  isAddSelected() {
    let paisSel = false;
    for (const ITEM of this.arrPais) {
      if (ITEM.checked) {
        paisSel = true;
        break;
      }
    }

    let prodSel = false;
    for (const ITEM of this.arrProd) {
      if (ITEM.checked) {
        prodSel = true;
        break;
      }
    }

    return (paisSel && prodSel);
  }

  isRemSelected() {
    let conf = false;
    for (const ITEM of this.arrConf) {
      if (ITEM.checked) {
        conf = true;
        break;
      }
    }

    return conf;
  }

  checkAllPais() {
    this.chkPais = !this.chkPais;
    for (const ITEM of this.arrPaisFilter) {
      ITEM.checked = this.chkPais;
    }
  }

  checkAllProd() {
    this.chkProd = !this.chkProd;
    for (const ITEM of this.arrProdFilter) {
      ITEM.checked = this.chkProd;
    }
  }

  checkAllConf() {
    if (this.arrConfFilter.length > 0) {
      this.chkConf = !this.chkConf;
    } else {
      this.chkConf = false;
    }

    for (const ITEM of this.arrConfFilter) {
      ITEM.checked = this.chkConf;
    }
  }

  add() {
    for (const PAIS of this.arrPais) {
      if (!PAIS.checked) {
        continue;
      } else {
        PAIS.checked = false;
      }

      for (const PROD of this.arrProd) {
        if (!PROD.checked) {
          continue;
        }

        const CURR = this.arrConf.find(x => {
          return (
            (x.value.pais.id === PAIS.value.id) &&
            (x.value.producto.id === PROD.value.id)
          );
        });

        if (CURR == null) {
          const CONF = new FormatoConfig();
          CONF.pais = PAIS.value;
          CONF.producto = PROD.value;

          this.arrConf.push({
            checked: false,
            value: CONF
          });
        }
      }
    }

    this.chkPais = false;
    this.chkProd = false;
    this.chkConf = false;

    for (const PROD of this.arrProd) {
      PROD.checked = false;
    }
    this.arrConf = [ ...this.arrConf ];
  }

  remove() {
    let i = 0;
    while (i < this.arrConf.length) {
      if (this.arrConf[i].checked) {
        this.arrConf.splice(i, 1);
      } else {
        i++;
      }
    }

    this.chkConf = false;
    this.arrConf = [ ...this.arrConf ];
  }

  async onSave() {
    try {
      const RAW: IRawConfig[] = [];
      for (const ITEM of this.arrConf) {
        RAW.push({
          id: ITEM.value.id,
          paisId: ITEM.value.pais.id,
          productoId: ITEM.value.producto.id
        });
      }

      await this.confServ.setConfig(this.id, RAW);

      this.selfRef.destroy();
      this.msgServ.success('Cambios Guardados Correctamente!');
    } catch (err) {
      this.onCatch(err);
    }
  }

  onDismiss() {
    this.selfRef.destroy();
  }
}
