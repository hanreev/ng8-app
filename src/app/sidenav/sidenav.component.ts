import { distinctUntilChanged, take } from 'rxjs/operators';

import { animate, AnimationMetadata, state, style, transition, trigger } from '@angular/animations';
import { FocusMonitor, FocusOrigin, FocusTrapFactory } from '@angular/cdk/a11y';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { ScrollDispatcher } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  NgZone,
  Output,
  QueryList,
  ViewEncapsulation
} from '@angular/core';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';

let isCollapsible = false;

@Component({
  selector: 'app-sidenav-content',
  template: '<ng-content></ng-content>',
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    class: 'mat-drawer-content mat-sidenav-content',
    '[style.margin-left.px]': '_container._contentMargins.left',
    '[style.margin-right.px]': '_container._contentMargins.right',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SidenavContentComponent extends MatSidenavContent {

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    // tslint:disable-next-line: no-use-before-declare
    @Inject(forwardRef(() => SidenavContainerComponent)) container: any,
    elementRef: ElementRef,
    scrollDispatcher: ScrollDispatcher,
    ngZone: NgZone
  ) {
    super(changeDetectorRef, container, elementRef, scrollDispatcher, ngZone);
  }

}

@Component({
  selector: 'app-sidenav',
  exportAs: 'appSidenav',
  template: '<div class="mat-drawer-inner-container"><ng-content></ng-content></div>',
  animations: [
    trigger('transform', [
      state('open, open-instant', style({
        transform: 'none',
        visibility: 'visible',
      })),
      transition((_, toState) => toState === 'void' && isCollapsible, [
        style({
          transform: 'none',
          visibility: 'visible',
        }),
        animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)'),
      ]),
      transition((_, toState) => toState === 'void' && !isCollapsible, [
        style({
          'box-shadow': 'none',
          visibility: 'hidden',
        }),
        animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)'),
      ]),
      transition('void => open-instant', animate('0ms')),
      transition(
        'void => open, open-instant => void',
        animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')
      ),
    ])
  ],
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    class: 'mat-drawer mat-sidenav',
    tabIndex: '-1',
    // must prevent the browser from aligning text based on value
    '[attr.align]': 'null',
    '[class.mat-drawer-end]': 'position === "end"',
    '[class.mat-drawer-over]': 'mode === "over"',
    '[class.mat-drawer-push]': 'mode === "push"',
    '[class.mat-drawer-side]': 'mode === "side"',
    '[class.mat-sidenav-fixed]': 'fixedInViewport',
    '[class.mat-drawer-collapsible]': 'collapsible',
    '[class.mat-drawer-collapsed]': 'collapsible && collapsed',
    '[style.top.px]': 'fixedInViewport ? fixedTopGap : null',
    '[style.bottom.px]': 'fixedInViewport ? fixedBottomGap : null',
    '[style.width.px]': 'collapsed ? collapsedWidth : null',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SidenavComponent extends MatSidenav {

  @Output() collapsedChange = new EventEmitter<boolean>(true);

  private _collapsible = false;
  @Input() set collapsible(v: boolean) {
    isCollapsible = true;
    this._collapsible = coerceBooleanProperty(v);
    this.toggle(this._collapsible);
  }
  get collapsible() {
    return this._collapsible;
  }

  private _collapsedWidth: number;
  @Input() set collapsedWidth(v: number) {
    this._collapsedWidth = coerceNumberProperty(v);
  }
  get collapsedWidth() {
    return this._collapsedWidth;
  }

  private _collapsed = false;
  set collapsed(v: boolean) {
    this.toggle(coerceBooleanProperty(v));
  }
  get collapsed() {
    return this._collapsed;
  }

  expand = this.open;
  collapse = this.close;

  private _container: SidenavContainerComponent;

  constructor(
    // tslint:disable-next-line: no-use-before-declare
    @Inject(forwardRef(() => SidenavContainerComponent)) container: any,
    elementRef: ElementRef,
    focusTrapFactory: FocusTrapFactory,
    focusMonitor: FocusMonitor,
    platform: Platform,
    ngZone: NgZone,
    @Inject(DOCUMENT) doc: Document,
  ) {
    super(elementRef, focusTrapFactory, focusMonitor, platform, ngZone, doc);

    this._container = container;

    this.openedChange.asObservable().subscribe(opened => {
      this._collapsed = !opened;
    });
  }

}

@Component({
  selector: 'app-sidenav-container',
  exportAs: 'appSidenavContainer',
  templateUrl: './sidenav-container.component.html',
  styleUrls: ['./sidenav-container.component.scss'],
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    class: 'mat-drawer-container mat-sidenav-container',
    '[class.mat-drawer-container-explicit-backdrop]': '_backdropOverride',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SidenavContainerComponent extends MatSidenavContainer {

  @ContentChildren(SidenavComponent) _drawers: QueryList<SidenavComponent>;
  @ContentChild(SidenavContentComponent, { static: false }) _content: SidenavContentComponent;

  updateContentMargins() {
    const _left = (this as any)._left as SidenavComponent;
    const _right = (this as any)._right as SidenavComponent;
    const _ngZone = (this as any)._ngZone as NgZone;

    let left = 0;
    let right = 0;

    if (_left && _left.opened)
      if (_left.mode === 'side')
        left += _left._width;
      else if (_left.mode === 'push') {
        const width = _left._width;
        left += width;
        right -= width;
      }

    if (_right && _right.opened)
      if (_right.mode === 'side')
        right += _right._width;
      else if (_right.mode === 'push') {
        const width = _right._width;
        right += width;
        left -= width;
      }

    left = left || null;
    right = right || null;

    if (_left && _left.collapsible && _left.collapsedWidth && !_left.opened)
      left = _left.collapsedWidth;

    if (left !== this._contentMargins.left || right !== this._contentMargins.right) {
      this._contentMargins = { left, right };
      _ngZone.run(() => this._contentMarginChanges.next(this._contentMargins));
    }
  }

}
