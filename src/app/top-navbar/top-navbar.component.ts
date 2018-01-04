import { ActivatedRoute, Router } from '@angular/router';
import { StringHelpers } from '../helpers/string-helpers';
import { IProgram } from '../models/IProgram';
import { ConfigService } from '../services/config.service';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NavbarService } from '../services/navbar.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.scss']
})
export class TopNavbarComponent implements OnInit, OnChanges {
  public filterText: string;
  public programs: IProgram[];
  constructor(
    private configService: ConfigService,
    public navbarService: NavbarService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router
  ) { 
    translate.setDefaultLang("hu");
    translate.use("hu");    
  }

  ngOnInit() {
    this.route.queryParams.subscribe(queryParams => {
      let lang = queryParams["lang"];
      console.log("languae from top navbar:", lang);
      this.translate.use(lang);
      let filter = queryParams["filter"];
      if(filter) {
        this.filterText = filter;
      } else {
        this.filterText = "";
      }
    });
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

  ngOnChanges(changes: SimpleChanges){
    
  }

  filterTextChange(event: string) {
    console.log("filterText changed event", event);
    this.filterText = event;
    this.router.navigate(this.route.snapshot.url, {queryParams: {
      lang: this.getActualLang(),
      filter: this.filterText}
    });
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
    this.router.navigate(this.route.snapshot.url, {queryParams: {lang: lang}});
  }

  public getActualLang(): string {
    return this.translate.currentLang;
  }

  public apply(event: Event){
    event.preventDefault();
    console.log("apply");
    this.router.navigate(this.route.snapshot.url, {queryParams: {
      lang: this.getActualLang(),
      filter: this.filterText}
    });
  }

}
