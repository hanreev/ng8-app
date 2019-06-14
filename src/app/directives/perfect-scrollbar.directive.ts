import PerfectScrollbar from 'perfect-scrollbar';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AfterContentChecked, AfterViewInit, Directive, ElementRef, Input, OnChanges, OnDestroy } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[perfectScrollbar]'
})
export class PerfectScrollbarDirective implements AfterViewInit, AfterContentChecked, OnChanges, OnDestroy {

  private _options: PerfectScrollbar.Options;

  @Input('perfectScrollbar') set options(v: PerfectScrollbar.Options) {
    this._options = v;
    this.update();
  }
  get options() {
    return this._options;
  }

  private _ps: PerfectScrollbar;
  private _element: HTMLElement;
  private _subscriptions = new Subject();

  constructor(private _elementRef: ElementRef<HTMLElement>) { }

  ngAfterViewInit() {
    if (!this._elementRef) return;

    this._element = this._elementRef.nativeElement;

    if (this._element.classList.contains('mat-drawer'))
      this._element = this._element.querySelector('.mat-drawer-inner-container');

    this._element.style.position = 'relative';
    this._ps = new PerfectScrollbar(this._element, this._options);

    fromEvent(window, 'resize')
      .pipe(takeUntil(this._subscriptions))
      .subscribe(() => this.update());
  }

  ngAfterContentChecked() {
    this.update();
  }

  ngOnChanges() {
    this.update();
  }

  ngOnDestroy() {
    this._subscriptions.next();
    this._subscriptions.complete();

    if (this._ps)
      this._ps.destroy();
  }

  update() {
    if (this._ps)
      this._ps.update();
  }

}
