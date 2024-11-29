import { Component, HostBinding, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNavbarComponent } from '@changelog-editor/feature/top-navbar';

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


  @HostBinding('class.open') get opened() {
    return this.isOpen;
  }
  constructor() { }

  @HostListener('click') open() {
    this.isOpen = true;
  }

  @HostListener('mouseleave') close() {
    this.isOpen = false;
  }
}
