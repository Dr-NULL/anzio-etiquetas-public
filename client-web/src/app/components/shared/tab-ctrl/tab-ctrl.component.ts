import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { DomNode } from 'src/app/utils/dom-node';
import { InputCssPixel } from 'ng-zorro-antd';

type Position = 'left' | 'right' | 'top' | 'bottom';

@Component({
  selector: 'app-tab-ctrl',
  templateUrl: './tab-ctrl.component.html',
  styleUrls: ['./tab-ctrl.component.scss']
})
export class TabCtrlComponent implements OnInit, OnDestroy {
  @ViewChild('htmlElem', { static: true })
  htmlElem: ElementRef<HTMLElement>;

  @ViewChild('htmlView', { static: true })
  htmlView: ElementRef<HTMLElement>;

  @Input()
  triggerWidth = 1024;

  @Input()
  positionHor: Position = 'top';

  @Input()
  positionVer: Position = 'top';

  @Output()
  indexChange = new EventEmitter<number>();
  public get index(): number {
    const nodes = new DomNode(this.htmlElem);
    const index = nodes
      .getChildren()
      .findIndex(x => x.classList.contains('active'));

    if (index == null) {
      return 0;
    } else {
      return index;
    }
  }
  @Input()
  public set index(v: number) {
    const nodeElem = new DomNode(this.htmlElem).getChildren();
    const nodeView = new DomNode(this.htmlView).getChildren();
    nodeElem.classes.remove('active');
    nodeView.classes.remove('active');

    if (
      (v < nodeElem.length) &&
      (v < nodeView.length)
    ) {
      nodeElem[v].classList.add('active');
      nodeView[v].classList.add('active');
      this.indexChange.emit(v);
    }
  }

  observerOutput = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length === 0) {
        this.build();
        break;
      }
    }
  });

  observerInput = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        this.build();
        this.onResize();
        break;
      }
    }
  });

  constructor(
    private htmlSelf: ElementRef<HTMLElement>
  ) { }

  ngOnInit(): void {
    this.build();
    this.observerInput.observe(
      this.htmlView.nativeElement,
      {
        childList: true
      }
    );
    this.observerOutput.observe(
      this.htmlElem.nativeElement,
      {
        childList: true
      }
    );

    window.addEventListener('resize', this.onResize.bind(this));
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  build() {
    // Move nodes
    const tabs = new DomNode(this.htmlElem.nativeElement);
    const view = new DomNode(this.htmlView.nativeElement);

    view.getChildren().forEach((node, i) => {
      if (node.nodeName.toLowerCase() === 'app-tab-elem') {
        tabs[0].appendChild(node);
      }
    });
    this.onResize();

    // Set Active Tab
    const tabsChildren = tabs.getChildren();
    const viewChildren = view.getChildren();

    tabsChildren.classes.remove('active');
    viewChildren.classes.remove('active');

    if (tabsChildren.length > 0) {
      tabsChildren[0].classList.add('active');
    }
    if (viewChildren.length > 0) {
      viewChildren[0].classList.add('active');
    }
  }

  onResize() {
    let position: Position;
    if (window.innerWidth >= this.triggerWidth) {
      position = this.positionHor;
    } else {
      position = this.positionVer;
    }

    const nodeElem = new DomNode(this.htmlElem).getChildren();
    let remove = '';
    let add = '';
    switch (position) {
      case 'top':
      case 'bottom':
        remove = 'vertical';
        add = 'horizontal';
        break;
      case 'left':
      case 'right':
        remove = 'horizontal';
        add = 'vertical';
        break;
    }

    this.setClass(position);
    nodeElem.forEach(node => {
      node.classList.remove(remove);
      node.classList.add(add);
    });
  }

  setClass(v: Position) {
    const nodeMain = new DomNode(this.htmlSelf);
    nodeMain.classes.remove('tab-top');
    nodeMain.classes.remove('tab-bottom');
    nodeMain.classes.remove('tab-left');
    nodeMain.classes.remove('tab-right');
    nodeMain.classes.push(`tab-${v}`);
  }

  @HostListener('click', [ '$event.target' ])
  onClick(elem: HTMLElement) {
    const node = new DomNode(elem);
    if (node.isDescendantOf(this.htmlElem.nativeElement).and) {
      const index = this.index;
      this.indexChange.emit(index);
    }
  }
}
