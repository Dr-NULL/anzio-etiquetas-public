import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Clipboard } from 'src/app/utils/clipboard';
import { Parser } from 'src/app/utils/parser';

@Component({
  selector: 'app-cmd-input',
  templateUrl: './cmd-input.component.html',
  styleUrls: ['./cmd-input.component.scss']
})
export class CmdInputComponent implements OnInit {
  @Input()
  isNumeric: boolean;

  @Input()
  maxLength: number;

  @Input()
  min: number;

  @Input()
  max: number;

  @Input()
  precision = 0;

  @Input()
  placeholder: string;

  @Input()
  copy: string;

  @Input()
  readonly: boolean;

  @Input()
  model: string | number;
  @Output()
  modelChange = new EventEmitter<string | number>();

  @ViewChild('input')
  private input: ElementRef<HTMLInputElement>;

  constructor(
    private msgServ: NzMessageService,
    private renderServ: Renderer2
  ) { }

  ngOnInit(): void {
    // Set as text (default)
    if (this.isNumeric == null) {
      this.isNumeric = false;
    }

    // Set Readonly
    if (this.readonly == null) {
      this.readonly = false;
    }

    // Set default Value
    if (
      (this.isNumeric) &&
      (this.model == null)
    ) {
      this.model = 0;
    } else if (this.model == null) {
      this.model = '';
    }
  }

  onChange(ev: KeyboardEvent) {
    const target = ev.currentTarget as HTMLInputElement;

    if (this.isNumeric) {
      // When the field is numeric
      target.value = target.value.replace(/[^0-9\+\-\.,]/gi, '');
      const parsed = new Parser(target.value);

      // Emit parsed Value
      if (target.value.match(/-$/gi) != null) {
        target.value = '-';
        return;

      } else if (!parsed.isNumeric) {
        this.model = 0;
        this.modelChange.emit(this.model);
        target.value = String(this.model);
        return;
      } else {
        this.model = parsed.toFloat(this.precision);
      }

      // Decimal size
      if (
        (
          (this.min != null) &&
          (this.model < this.min)
        ) ||
        (
          (this.max != null) &&
          (this.model > this.max)
        )
      ) {
        this.model = parsed.toFloat(this.precision, this.min, this.max);
        target.value = parsed.toString(this.precision, this.min, this.max);

      } else {
        const match = target.value.split(/(\.|,)/gi);
        if (
          (this.precision > 0) &&
          (match.length === 3)
        ) {
          target.value = match[0]
            + match[1]
            + match[2].substr(0, this.precision);
        } else if (
          (this.precision == null) ||
          (target.value.match(/(\.|,)$/gi) == null)
        ) {
          target.value = match[0];
        }
      }

      this.modelChange.emit(this.model);
    } else {
      // When the field is text
      if (this.maxLength != null) {
        this.model = target.value.substr(0, this.maxLength);
      } else {
        this.model = target.value;
      }
      this.modelChange.emit(this.model);
      target.value = String(this.model);

    }
  }

  onBlur(item: HTMLInputElement) {
    if (this.isNumeric) {
      const parsed = new Parser(item.value);
      this.modelChange.emit(parsed.toFloat(this.precision, this.min, this.max));
      item.value = parsed.toString(this.precision, this.min, this.max);
    }
  }

  async onCopy() {
    if (this.copy == null) {
      return;
    } else {
      await Clipboard.copyText(this.copy);
      this.msgServ.info(
        'Comando copiado al portapapeles.',
        { nzDuration: 2500 }
      );
    }
  }
}
