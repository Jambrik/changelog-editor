import { StringHelpers } from '../helpers/string-helpers';
import { IProgram } from '../models/IProgram';
import { ConfigService } from '../services/config.service';
import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../services/navbar.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.scss']
})
export class TopNavbarComponent implements OnInit {
  public programs: IProgram[];
  constructor(
    private configService: ConfigService,
    private navbarService: NavbarService,
    private translate: TranslateService
  ) { 
    translate.setDefaultLang("hu");
    translate.use("hu");    
  }

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

  public getLastVersion(program: IProgram): string {
    if (program.versions && (program.versions.length > 0)) {
      program.versions.sort(StringHelpers.sortDesc);
      return program.versions[0];
    }
    else {
      return "last";
    }

  }

  public isSelected(lang: string): boolean {
    return this.translate.currentLang == lang;
  }

  public changeLang(event: Event, lang: string){
    event.preventDefault();
    this.translate.use(lang);        
  }

}
