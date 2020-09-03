import { Component, OnInit, DoCheck, Input, Output, EventEmitter, ElementRef, Renderer2 } from '@angular/core';
import { FormatoPict } from 'src/app/models/formato-pict';

@Component({
  selector: 'app-label-pict',
  templateUrl: './label-pict.component.html',
  styleUrls: ['./label-pict.component.scss']
})
export class LabelPictComponent implements OnInit, DoCheck {
  @Output()
  modelchange = new EventEmitter<FormatoPict>();
  modelValue: FormatoPict;
  public get model(): FormatoPict {
    return this.modelValue;
  }
  @Input()
  public set model(v: FormatoPict) {
    this.modelValue = v;
    this.ngDoCheck();
  }

  @Input()
  scale: number;

  constructor(
    private htmlSelf: ElementRef<HTMLElement>,
    private renderServ: Renderer2
  ) { }

  ngOnInit(): void {
  }

  ngDoCheck(): void {
    this.renderServ.setStyle(
      this.htmlSelf.nativeElement,
      'left',
      `${this.modelValue.x * this.scale}px`
    );
    this.renderServ.setStyle(
      this.htmlSelf.nativeElement,
      'top',
      `${this.modelValue.y * this.scale}px`
    );
    this.renderServ.setStyle(
      this.htmlSelf.nativeElement,
      'width',
      `${this.modelValue.width * this.scale}px`
    );
    this.renderServ.setStyle(
      this.htmlSelf.nativeElement,
      'height',
      `${this.modelValue.height * this.scale}px`
    );

    if (this.modelValue.picture != null) {
      this.renderServ.setStyle(
        this.htmlSelf.nativeElement,
        'background-image',
        `url('/api/picture/file/${this.modelValue.picture.id}')`
      );
    }
  }
}
