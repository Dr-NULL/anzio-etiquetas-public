import { Component, OnInit, NgZone } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ModalGenService } from 'src/app/components/shared/modal-gen/modal-gen.service';

import { Http } from 'src/app/services/http/http.service';
import { ProductoCrudEditComponent } from '../producto-crud-edit/producto-crud-edit.component';

import { Language, LanguageService } from 'src/app/services/language/language.service';
import { Producto, ProductoService } from 'src/app/services/producto/producto.service';

@Component({
  selector: 'app-producto-crud',
  templateUrl: './producto-crud.component.html',
  styleUrls: ['./producto-crud.component.scss']
})
export class ProductoCrudComponent implements OnInit {
  arrProd: Producto[] = [];
  arrProdFilter: Producto[] = [];
  arrLang: Language[] = [];
  arrLangFilter: Language[] = [];
  selLang: Language;

  constructor(
    private msgServ: NzMessageService,
    private langServ: LanguageService,
    private prodServ: ProductoService,
    private modalServ: NzModalService,
    private modalGenServ: ModalGenService,
  ) { }

  ngOnInit() {
    this.langServ
      .getAll()
      .catch(this.onError)
      .then((res: Http<Language[]>) => {
        this.arrLang = res.data;
      });

    this.prodServ
      .getAll()
      .catch(this.onError)
      .then((res: Http<Producto[]>) => {
        this.arrProd = res.data;
      });
  }

  filterProd(data: Producto[]) {
    this.arrProdFilter = [ ...data ];
  }

  filterLang(data: Language[]) {
    this.arrLangFilter = [ ...data ];
  }

  onKeyUpCodigo(input: HTMLInputElement) {
    input.value = input.value
      .replace(/[^a-z0-9-_]/gi, '');

    this.selLang.codigo = input.value;
  }

  onKeyUpDescripc(input: HTMLInputElement) {
    input.value = input.value
      .replace(/[^a-zÀ-ÖØ-öø-ʔʕ-ʯ0-9\s-_]/gi, '')
      .replace(/\s+/gi, ' ');

    this.selLang.descripc = input.value;
  }

  checkLang(item: Language) {
    if (!this.selLang) {
      return false;
    } else  {
      return item.id === this.selLang.id;
    }
  }

  checkValidation() {
    return (
      (this.selLang.codigo.length === 0) ||
      (this.selLang.descripc.length === 0)
    );
  }

  onError(err: any) {
    this.modalGenServ.danger(
      'Error:',
      err.details,
      {
        text: 'Aceptar',
        faicon: 'far fa-thumbs-up',
        dissmiss: true,
        callback: () => {

        }
      }
    );
  }

  onAddLang() {
    if (this.arrLang.find(x => x.id == null)) {
      return;
    }

    this.selLang = new Language();
    this.selLang.codigo = '';
    this.selLang.descripc = '';

    this.arrLang = [
      ...this.arrLang,
      this.selLang
    ];
  }

  onEditProd(item: Producto) {
    const ref = this.modalServ.create({
      nzContent: ProductoCrudEditComponent,
      nzClosable: false,
      nzTitle: `Editar "${item.descripc}"`,
      nzWidth: 'calc(100vw - 15rem)',
      nzFooter: null,
      nzComponentParams: {
        id: item.id
      }
    });

    const obs = ref.afterClose.subscribe(async () => {
      // Releer data desde DB
      const resp = await this.prodServ.get(item.id);
      const elem = new Producto();
      elem.id = resp.data.id;
      elem.codigo = resp.data.codigo;
      elem.descripc = resp.data.descripc;
      elem.familia = resp.data.familia;

      const i = this.arrLang.findIndex(x => x.id === elem.id);
      this.arrProd[i] = elem;
      obs.unsubscribe();
    });
  }

  onEditLang(item: Language) {
    this.selLang = new Language();
    this.selLang.id = item.id;
    this.selLang.codigo = item.codigo;
    this.selLang.descripc = item.descripc;

    this.arrLang = [ ...this.arrLang.filter(x => x.id != null) ];
  }

  onDeleteLang(item: Language) {
    this.modalGenServ.info(
      'Aviso!',
        `Si usted borra el idioma <strong>"${item.descripc}"</strong> se eliminarán todas `
      + 'las traducciones asociadas a éste. Además cabe destacar que este proceso <strong>'
      + 'NO SE PUEDE DESHACER</strong>. ¿Desea continuar?',
      {
        type: 'primary',
        text: 'No, Cancelar!',
        faicon: 'fas fa-times',
        dissmiss: true
      },
      {
        type: 'danger',
        text: 'Sí, Eliminar!',
        faicon: 'fas fa-trash-alt',
        dissmiss: true,
        callback: async () => {
          try {
            await this.langServ.delete(item.id);
            this.arrLang = [ ...this.arrLang.filter(x => x.id !== item.id) ];

            this.msgServ.success(
              'El idioma se ha quitado correctamente de todos los productos.'
            );
          } catch (err) {
            this.onError(err);
          }
        }
      }
    );
  }

  onCancelLang() {
    if (!this.selLang.id) {
      const i = this.arrLang.findIndex(x => x.id == null);
      this.arrLang.splice(i, 1);
    }

    this.selLang = null;
    this.arrLang = [ ...this.arrLang ];
  }

  async onSaveLang() {
    const i = this.arrLang.findIndex(x => x.id === this.selLang.id);
    const obj = new Language();
    let res: Http<Language>;

    try {
      obj.id = this.selLang.id;
      obj.codigo = this.selLang.codigo.trim();
      obj.descripc = this.selLang.descripc.trim();

      if (obj.id == null) {
        res = await this.langServ.add(obj);
        this.msgServ.success('Lenguaje agregado correctamente!');
      } else {
        res = await this.langServ.set(obj);
        this.msgServ.success('Lenguaje modificado correctamente!');
      }

      this.arrLang[i].id = res.data.id;
      this.arrLang[i].codigo = res.data.codigo;
      this.arrLang[i].descripc = res.data.descripc;
    } catch (err) {
      this.onError(err);
    } finally {
      if (this.selLang.id) {
        this.selLang = null;
      }
    }
  }
}
