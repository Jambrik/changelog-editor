import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../services/navbar.service';
import { ChangeLogService } from '../services/change-log.service';

@Component({
  selector: 'app-left-navbar',
  templateUrl: './left-navbar.component.html',
  styleUrls: ['./left-navbar.component.scss']
})
export class LeftNavbarComponent implements OnInit {

  constructor(private navbarService: NavbarService) { }

  ngOnInit() {
  }

  public get actualProgramName(): string{
    if(this.navbarService.actualProgram)
      return this.navbarService.actualProgram.name
    else  
      return undefined;
  }

  public get actualProgramId(): number{
    if(this.navbarService.actualProgram)
      return this.navbarService.actualProgram.id
    else  
      return undefined;
  }

  public get versions(): string[] {
    return this.navbarService.actualVersions;
  }

  public isReading(): boolean {
    return this.navbarService.actualAction == "read";
  }

  public isActual(version: string): boolean {
    return this.navbarService.actualVersion == version;
  }


}
