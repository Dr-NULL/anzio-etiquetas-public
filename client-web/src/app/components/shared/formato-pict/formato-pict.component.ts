import { PicturePickerComponent } from 'src/app/components/shared/picture-picker/picture-picker.component';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormatoPict } from 'src/app/models/formato-pict';

@Component({
  selector: 'app-formato-pict',
  templateUrl: './formato-pict.component.html',
  styleUrls: ['./formato-pict.component.scss']
})
export class FormatoPictComponent implements OnInit {
  @Output()
  modelChange = new EventEmitter<FormatoPict>();
  @Input()
  model: FormatoPict;

  @Output()
  selectedChange = new EventEmitter<number>();
  @Input()
  selected: number;

  @Input()
  width: number;

  @Input()
  height: number;

  @Input()
  index: number;

  @Input()
  step = 0.5;

  constructor(
    private modalServ: NzModalService
  ) { }

  ngOnInit(): void {
  }

  onFocus() {
    this.selected = this.index;
    this.selectedChange.emit(this.index);
  }

  onChange() {
    this.modelChange.emit(this.model);
  }

  onBlur() {
    this.selected = null;
  }

  onSelectFile() {
    const inst = this.modalServ.create({
      nzTitle: 'Seleccionar Imagen',
      nzContent: PicturePickerComponent,
      nzWidth: '50vw',
      nzComponentParams: {
        model: this.model.picture
      }
    }).getInstance();

    this.modalServ.afterAllClose.subscribe(() => {
      const ref: PicturePickerComponent = inst.getContentComponentRef().instance;
      this.model.picture = ref.model;
      this.modelChange.emit(this.model);
    });
  }
}
