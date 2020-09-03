import { Component, OnInit, Renderer2 } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

import { Detail, ProductoService } from 'src/app/services/producto/producto.service';
import { Language, LanguageService } from 'src/app/services/language/language.service';
import { ProductoDet } from 'src/app/models';

interface Chk<T> {
  checked: boolean;
  value: T;
}

@Component({
  selector: 'app-producto-crud-edit',
  templateUrl: './producto-crud-edit.component.html',
  styleUrls: ['./producto-crud-edit.component.scss']
})
export class ProductoCrudEditComponent implements OnInit {
  id: number;

  arrDesc: Chk<ProductoDet>[] = [];
  arrLang: Chk<Language>[] = [];
  arrLangFilter: Chk<Language>[] = [];
  arrDescFilter: Chk<ProductoDet>[] = [];

  chkLang = false;
  chkDesc = false;
  chkSave = false;

  constructor(
    private render: Renderer2,
    private refSelf: NzModalRef,
    private msgServ: NzMessageService,
    private langServ: LanguageService,
    private prodServ: ProductoService
  ) { }

  async ngOnInit() {
    try {
      this.arrDesc = [];
      const resProd = await this.prodServ.get(this.id);
      for (const item of resProd.data.productoDet) {
        this.arrDesc.push({
          checked: false,
          value: item
        });
      }

      const resLang = await this.langServ.getAll();
      this.arrLang = [];
      for (const item of resLang.data) {
        if (this.arrDesc.find(x => x.value.language.id === item.id)) {
          continue;
        }

        this.arrLang.push({
          checked: false,
          value: item
        });
      }

      this.validate();
      this.arrLang = [ ...this.arrLang ];
      this.arrDesc = [ ...this.arrDesc ];
    } catch (err) {
      this.msgServ.error(
        err.details
      );
      this.refSelf.destroy();
    }
  }

  filterLang(data: Chk<Language>[]) {
    this.arrLangFilter = [ ...data ];
  }

  filterDesc(data: Chk<ProductoDet>[]) {
    this.arrDescFilter = [ ...data ];
  }

  selectAllLang() {
    this.arrLang.forEach(x => {
      if (!x.value.default) {
        x.checked = this.chkLang;
      } else {
        x.checked = false;
      }
    });

    this.arrLang = [ ...this.arrLang ];
  }

  selectAllDesc() {
    this.arrDesc.forEach(x => {
      if (!x.value.language.default) {
        x.checked = this.chkDesc;
      } else {
        x.checked = false;
      }
    });

    this.arrDesc = [ ...this.arrDesc ];
  }

  checkSelections() {
    // Chequear Language
    let langTick = true;
    for (const item of this.arrLangFilter) {
      if (!item.checked && !item.value.default) {
        langTick = false;
        break;
      }
    }

    if (this.arrLangFilter.length === 0) {
      this.chkLang = false;
    } else if (this.chkLang !== langTick) {
      this.chkLang = langTick;
    }

    // Chequear Descripción
    let descTick = true;
    for (const item of this.arrDescFilter) {
      if (!item.checked && !item.value.language.default) {
        descTick = false;
        break;
      }
    }

    if (this.arrDesc.length === 0) {
      this.chkDesc = false;
    } else if (this.chkDesc !== descTick) {
      this.chkDesc = descTick;
    }
  }

  canAdd() {
    if (this.arrLang.find(x => x.checked)) {
      return true;
    } else {
      return false;
    }
  }

  canRem() {
    if (this.arrDesc.find(x => x.checked)) {
      return true;
    } else {
      return false;
    }
  }

  addLang() {
    let i = 0;
    while (i < this.arrLang.length) {
      if (this.arrLang[i].checked) {
        const desc = new ProductoDet();
        desc.language = this.arrLang[i].value;
        desc.descripc = '';

        // Agregar a las descripciones
        this.arrDesc.push({
          checked: false,
          value: desc
        });

        // Remover de lenguajes
        this.arrLang.splice(i, 1);
      } else {
        i++;
      }
    }

    // Refrescar Arreglos
    this.validate();
    this.arrLang = [ ...this.arrLang ];
    this.arrDesc = [ ...this.arrDesc ];
    this.chkLang = false;
    this.chkDesc = false;
  }

  delLang() {
    let i = 0;
    while (i < this.arrDesc.length) {
      if (this.arrDesc[i].checked) {
        // Agregar a la lista de Idiomas
        this.arrLang.push({
          checked: false,
          value: this.arrDesc[i].value.language
        });

        // Remover de las descripciones
        this.arrDesc.splice(i, 1);
      } else {
        i++;
      }
    }

    // Refrescar Arreglos
    this.validate();
    this.arrLang = [ ...this.arrLang ];
    this.arrDesc = [ ...this.arrDesc ];
    this.chkLang = false;
    this.chkDesc = false;
  }

  validate(elem: HTMLInputElement = null) {
    if (elem) {
      // Trimear elemento actual
      this.render.setProperty(
        elem,
        'value',
        elem.value.trim()
      );
    }

    let able = true;
    for (const item of this.arrDesc) {
      item.value.descripc = item.value.descripc.trim();
      if (item.value.descripc.length === 0) {
        able = false;
      }
    }

    this.chkSave = able;
  }

  onCancel() {
    this.refSelf.destroy();
  }

  async onSave() {
    const data: Detail[] = [];
    for (const item of this.arrDesc) {
      data.push({
        descripc: item.value.descripc,
        langId: item.value.language.id
      });
    }

    try {
      await this.prodServ.setDetails(this.id, data);
      this.msgServ.success('Cambios guardados correctamente!');
    } catch (err) {
      this.msgServ.error(err.details);
    } finally {
      this.refSelf.destroy();
    }
  }
}
