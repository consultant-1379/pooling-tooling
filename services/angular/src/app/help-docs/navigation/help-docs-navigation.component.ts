import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-help-docs-navigation',
  templateUrl: './help-docs-navigation.component.html',
  styleUrls: ['./help-docs-navigation.component.css'],
})
export class HelpDocsNavigationComponent implements OnInit {
  public helpDocsNavigation = 'help-docs-navigation-normal-height';
  public showGoToTopButton = '';
  constructor() { }

  @HostListener('window:scroll', ['$event'])
  public handleScroll(): void {
    const windowScroll = window.pageYOffset;
    if (windowScroll >= 145) {
      this.showGoToTopButton = 'fade-in';
      this.helpDocsNavigation = 'help-docs-navigation-shorter-height';
    } else {
      this.showGoToTopButton = 'fade-out';
      this.helpDocsNavigation = 'help-docs-navigation-normal-height';
    }
  }

  ngOnInit(): void {
  }

  public goToTop(): void {
    window.scroll(0, 0);
  }

}
