import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { Component, HostBinding, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private isOpen:boolean = false;
  
      @HostBinding('class.open') get opened(){
        return this.isOpen;
      }
      constructor() { }
  
      @HostListener('click')open(){
        this.isOpen = true;
      }
  
      @HostListener('mouseleave')close(){
        this.isOpen = false;
      }
}
