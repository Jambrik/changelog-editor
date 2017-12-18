import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { IProgram } from '../models/IProgram';
import { NavbarService } from '../services/navbar.service';

@Component({
  selector: 'app-program-list',
  templateUrl: './program-list.component.html',
  styleUrls: ['./program-list.component.scss']
})
export class ProgramListComponent implements OnInit {
  public programs: IProgram[];
  constructor(private configService: ConfigService,
  private navbarService: NavbarService) { }

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


}
