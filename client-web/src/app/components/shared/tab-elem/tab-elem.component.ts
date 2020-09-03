import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { DomNode } from 'src/app/utils/dom-node';

@Component({
  selector: 'app-tab-elem',
  templateUrl: './tab-elem.component.html',
  styleUrls: ['./tab-elem.component.scss']
})
export class TabElemComponent implements OnInit {
  private static index = 0;

  constructor(
    private refSelf: ElementRef<HTMLElement>
  ) { }

  ngOnInit(): void {
    this.refSelf.nativeElement.setAttribute('data-i', TabElemComponent.index.toString());
    TabElemComponent.index++;
  }

  @HostListener('click', [ '$event' ])
  onClick(ev: MouseEvent) {
    const cont = new DomNode(this.refSelf)
      .getParents()
      .getParents();

    const index = (ev.currentTarget as HTMLElement).getAttribute('data-i');
    const view = cont.querySelectorAll(`.content-view > app-tab-view`);
    const tabs = new DomNode(this.refSelf).getParents().getChildren();

    view.forEach(node => {
      if (node.getAttribute('data-i') === index) {
        node.classList.add('active');
      } else {
        node.classList.remove('active');
      }
    });

    tabs.forEach(node => {
      if (node.getAttribute('data-i') === index) {
        node.classList.add('active');
      } else {
        node.classList.remove('active');
      }
    });
  }
}
