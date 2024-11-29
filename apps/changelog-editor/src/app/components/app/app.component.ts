import { Component, HostBinding, HostListener } from '@angular/core';
import { TopNavbarComponent } from '../../top-navbar/top-navbar.component';
import { RouterOutlet } from '@angular/router';

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
