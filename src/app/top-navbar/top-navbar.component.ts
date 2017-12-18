import { IProgram } from '../models/IProgram';
import { ConfigService } from '../services/config.service';
import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../services/navbar.service';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.scss']
})
export class TopNavbarComponent implements OnInit {
  public programs: IProgram[];
  constructor(
    private configService: ConfigService,
    private navbarService: NavbarService
  ) { }

  ngOnInit() {
    this.configService.getConfig().subscribe(
      (data) => {
        console.log("program list", data);
        this.programs = data.programs;
        
      },
      (error) => {
        console.log("error",error);
      }
    )
  }

  public openProgram(program: IProgram) {
    this.navbarService.actualProgram = program;

  }

  public get actualProgram(): string{
    if(this.navbarService.actualProgram)
      return this.navbarService.actualProgram.name
    else  
      return "";
  }

}
