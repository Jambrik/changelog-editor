import { Component, HostBinding, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNavbarComponent } from '@changelog-editor/feature/top-navbar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [TopNavbarComponent, RouterOutlet]
})
export class AppComponent {
  private isOpen = false;
  public text: string;

  constructor(

    private translateService: TranslateService
  ) {

    this.translateService.setDefaultLang('en');
    this.translateService.use('en');
  }

  @HostBinding('class.open') get opened() {
    return this.isOpen;
  }

  @HostListener('click') open() {
    this.isOpen = true;
  }

  @HostListener('mouseleave') close() {
    this.isOpen = false;
  }
}
