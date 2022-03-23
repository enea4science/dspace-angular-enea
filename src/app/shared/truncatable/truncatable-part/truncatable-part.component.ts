import { Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { TruncatableService } from '../truncatable.service';
import { hasValue } from '../../empty.util';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { NativeWindowRef, NativeWindowService } from 'src/app/core/services/window.service';

@Component({
  selector: 'ds-truncatable-part',
  templateUrl: './truncatable-part.component.html',
  styleUrls: ['./truncatable-part.component.scss']
})

/**
 * Component that truncates/clamps a piece of text
 * It needs a TruncatableComponent parent to identify it's current state
 */
export class TruncatablePartComponent implements OnInit, OnDestroy {
  /**
   * Number of lines shown when the part is collapsed
   */
  @Input() minLines: number;

  /**
   * Number of lines shown when the part is expanded. -1 indicates no limit
   */
  @Input() maxLines = -1;

  /**
   * The identifier of the parent TruncatableComponent
   */
  @Input() id: string;

  /**
   * Type of text, can be a h4 for headers or any other class you want to add
   */
  @Input() type: string;

  /**
   * True if the minimal height of the part should at least be as high as it's minimum amount of lines
   */
  @Input() fixedHeight = false;

  @Input() background = 'default';

  /**
   * Current amount of lines shown of this part
   */
  lines: string;

  /**
   * Subscription to unsubscribe from
   */
  private sub;
  /**
   * store variable used for local to expand collapse
   */
  expand = false;
  /**
   * variable to check if expandable
   */
  expandable = false;
  isBrowser: boolean;

  public constructor(
    private service: TruncatableService,
    @Inject(DOCUMENT) private document: any,
    @Inject(NativeWindowService) private _window: NativeWindowRef,
    @Inject(PLATFORM_ID) platformId: object
    ) {
      this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Initialize lines variable
   */
  ngOnInit() {
    this.setLines();
  }

  /**
   * Subscribe to the current state to determine how much lines should be shown of this part
   */
  private setLines() {
    this.sub = this.service.isCollapsed(this.id).subscribe((collapsed: boolean) => {
      if (collapsed) {
        this.lines = this.minLines.toString();
        this.expand = false;
      } else {
        this.lines = this.maxLines < 0 ? 'none' : this.maxLines.toString();
        this.expand = true;
      }
    });
  }

  ngAfterContentChecked() {
    if (this.isBrowser) {
      let ps;
      let observer;
      [ps, observer] = this.getObserve();

      ps.forEach(p => {
        observer.observe(p);
      });
    }
  }

  /**
   * Function to get data to be observed
   */
  getObserve() {
    const ps = this.document.querySelectorAll('#dontBreakContent');
    const observer = new (this._window.nativeWindow as any).ResizeObserver(entries => {
      // tslint:disable-next-line:prefer-const
      for (let entry of entries) {
        entry.target.classList[entry.target.scrollHeight > entry.contentRect.height ? 'add' : 'remove']('truncated');
      }
    });
    return [ps, observer];
  }

  /**
   * Expands the truncatable when it's collapsed, collapses it when it's expanded
   */
  public toggle() {
    this.service.toggle(this.id);
    this.expandable = !this.expandable;
  }

  /**
   * Unsubscribe from the subscription
   */
  ngOnDestroy(): void {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
    if (this.isBrowser) {
      let ps;
      let observer;
      [ps, observer] = this.getObserve();

      ps.forEach(p => {
        observer.unobserve(p);
      });
    }
  }
}
