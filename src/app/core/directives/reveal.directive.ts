import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
} from "@angular/core";

/**
 * Adds a subtle fade/rise animation when the host element scrolls into view.
 * Pair with the global `.reveal` / `.reveal-visible` styles.
 */
@Directive({
  standalone: true,
  selector: "[appReveal]",
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  readonly delay = input(0);
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    const el = this.host.nativeElement;
    el.classList.add("reveal");
    if (this.delay() > 0) {
      el.style.transitionDelay = `${this.delay()}ms`;
    }
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            this.observer?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 },
    );
    this.observer.observe(el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
