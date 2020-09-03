import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Clipboard } from 'src/app/utils/clipboard';

@Component({
  selector: 'app-cmd-datepicker',
  templateUrl: './cmd-datepicker.component.html',
  styleUrls: ['./cmd-datepicker.component.scss']
})
export class CmdDatepickerComponent implements OnInit {
  @Input()
  copyYear: string;
  @Input()
  copyMonth: string;
  @Input()
  copyDay: string;

  @Input()
  model: Date;
  @Output()
  modelChange = new EventEmitter<Date>();

  constructor(
    private msgServ: NzMessageService
  ) { }

  ngOnInit(): void {
  }

  onChange(value: Date) {
    this.model = value;
    this.modelChange.emit(this.model);
  }

  async onCopy(text: string) {
    if (text == null) {
      return;
    } else {
      await Clipboard.copyText(text);
      this.msgServ.info(
        'Comando copiado al portapapeles.',
        { nzDuration: 2500 }
      );
    }
  }
}
