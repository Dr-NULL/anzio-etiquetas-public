import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

import { ProductoService, Producto } from 'src/app/services/producto/producto.service';
import { FormatoService, Formato } from 'src/app/services/formato/formato.service';
import { Clipboard } from 'src/app/utils/clipboard';
import { Etiqueta } from 'src/app/models/etiqueta';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-formato-test',
  templateUrl: './formato-test.component.html',
  styleUrls: ['./formato-test.component.scss']
})
export class FormatoTestComponent implements OnInit, OnDestroy {
  public static model = new Etiqueta();
  get model() {
    return FormatoTestComponent.model;
  }

  set model(v: Etiqueta) {
    FormatoTestComponent.model = v;
  }

  subRouter: Subscription;
  label: Formato;
  mdlProdVisible = false;
  productos: Producto[] = [];
  productosFilter: Producto[] = [];

  constructor(
    private msgServ: NzMessageService,
    private prodServ: ProductoService,
    private formatoServ: FormatoService,
    private activeRouter: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.subRouter = this.activeRouter
      .paramMap
      .subscribe(this.onRouterGet.bind(this));
  }

  ngOnDestroy() {
    this.subRouter.unsubscribe();
  }

  async onRouterGet(params: any) {
    // New Model
    this.model = new Etiqueta();
    this.model.barcode = '16516513';
    this.model.codAnimal = 'AF1651616';
    this.model.contrato = 123456;
    this.model.loteCertif = 123456;
    this.model.fechaImpres = new Date();
    this.model.fechaFaena = new Date();
    this.model.fechaProducc = new Date();
    this.model.fechaVencim = new Date();
    this.model.pesoNeto = 99.99;
    this.model.pesoBruto = 99.99;

    try {
      const resp01 = await this.formatoServ.get(params.get('codigo'));
      this.label = resp01.data;

      const resp02 = await this.formatoServ.getConfig(this.label.id);
      const data: Producto[] = [];
      for (const item of resp02.data) {
        data.push(item.producto);
      }

      this.productos = [ ...data ];
    } catch (err) {
      this.msgServ.error(
        'Hubo un problema con el servidor al solicitar datos.'
      );
      console.log(err);
    }
  }

  async onProductChange(value: Producto) {
    // Asign the current product to the model
    const resp = await this.prodServ.get(value.id);
    this.model.producto = resp.data;
    this.mdlProdVisible = false;
  }

  async onProdClick(v: string) {
    await Clipboard.copyText(v);
    this.msgServ.info('Código copiado al portapapeles.');
  }

  onFilterProd(data: Producto[]) {
    this.productosFilter = [ ...data ];
  }

  async prodChange() {
    try {
      const resp02 = await this.formatoServ.getConfig(this.label.id);
      const data: Producto[] = [];
      for (const item of resp02.data) {
        data.push(item.producto);
      }

      this.productos = [ ...data ];
      this.mdlProdVisible = true;
    } catch (err) {
      this.msgServ.error(
        'Hubo un problema con el servidor al solicitar datos.'
      );
      console.error(err);
    }
  }
}
