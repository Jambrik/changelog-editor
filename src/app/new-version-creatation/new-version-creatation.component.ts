import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../services/navbar.service';
import { IProgram } from '../models/IProgram';
import { ConfigService } from '../services/config.service';
import { ConfigHelper } from '../helpers/config-helper';
import { StringHelpers } from '../helpers/string-helpers';
import { TranslateService } from '@ngx-translate/core';
import { ChangeLogService } from '../services/change-log.service';
import { IVersionMetaData } from '../models/IVersionMetaData';

@Component({
  selector: 'app-new-version-creatation',
  templateUrl: './new-version-creatation.component.html',
  styleUrls: ['./new-version-creatation.component.scss']
})
export class NewVersionCreatationComponent implements OnInit {
  public programId: number;
  public version: IVersionMetaData;
  public smaller: boolean = false;
  constructor(
    private navbarService: NavbarService,
    private route: ActivatedRoute,
    private configService: ConfigService,
    private router: Router,
    private translateService: TranslateService,
    private changeLogService: ChangeLogService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let programId = params['program-id'];
      console.log("program-id", programId);
      let programIdInt = parseInt(programId);
      if (this.programId != programIdInt) {
        this.configService.getConfig()
          .subscribe((config) => {
            this.programId = programIdInt;    
            this.navbarService.actualProgram = ConfigHelper.getProgramById(config.programs, this.programId);          
            this.navbarService.actualProgram.versions.sort(ConfigHelper.versionSorter);
            this.navbarService.actualVersions = this.navbarService.actualProgram.versions;
          });
        }
    });
  }

  public get program(): IProgram{
    return this.navbarService.actualProgram;
  }

  public save(event: Event){
    event.preventDefault();
    if(this.valid()){
      console.log("Valid");
      this.changeLogService.createNewVersion(this.programId, this.version)
      .subscribe((response) => {
        console.log("new version created");
        this.router.navigate(["/change-list", this.program.id, this.version, 'read', 'none'], {queryParams: {lang: this.getActualLang()}});    
      })
    }
  }

  private valid(): boolean {
    let lastVersion: IVersionMetaData = this.getLastVersion();
    this.smaller = this.version.version <= lastVersion.version;
    return !this.smaller;
  }

  public cancel(event: Event) {
    event.preventDefault();
    let lastVersion: IVersionMetaData = this.getLastVersion();
    if(lastVersion != null){
      this.router.navigate(["/change-list", this.program.id, lastVersion, 'read', 'none'], {queryParams: {lang: this.getActualLang()}});    
    }
  }

  private getLastVersion(): IVersionMetaData {
    if(this.navbarService.actualProgram.versions.length > 0) {
      return this.navbarService.actualProgram.versions[0];
    } else 
      return null;
  }

  public getActualLang(): string {
    return this.translateService.currentLang;
  }

}
