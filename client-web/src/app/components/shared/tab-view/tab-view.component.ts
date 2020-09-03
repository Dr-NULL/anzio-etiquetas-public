import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-tab-view',
  templateUrl: './tab-view.component.html',
  styleUrls: ['./tab-view.component.scss']
})
export class TabViewComponent implements OnInit {
  private static index = 0;

  constructor(
    private refSelf: ElementRef<HTMLElement>
  ) { }

  ngOnInit(): void {
    this.refSelf.nativeElement.setAttribute('data-i', TabViewComponent.index.toString());
    TabViewComponent.index++;
  }
}
