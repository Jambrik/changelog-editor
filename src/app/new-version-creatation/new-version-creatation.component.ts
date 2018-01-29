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
  public versionNumber: string;
  public smaller: Boolean = false;
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
      const programId = params['program-id'];
      console.log('program-id', programId);
      const programIdInt = parseInt(programId, 10);
      if (this.programId !== programIdInt) {
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

  public get program(): IProgram {
    return this.navbarService.actualProgram;
  }

  public save(event: Event) {
    event.preventDefault();
    if (this.valid()) {
      console.log('Valid');
      this.changeLogService.createNewVersion(this.programId, this.versionNumber)
        .subscribe((response) => {
          console.log('new version created');
          this.router.navigate(['/change-list', this.program.id, this.versionNumber, 'read', 'none'],
            { queryParams: { lang: this.getActualLang() } });
        });
    }
  }

  private valid(): boolean {
    const lastVersion: IVersionMetaData = this.getLastVersion();
    if (lastVersion != null) {
      this.smaller = this.versionNumber <= lastVersion.version;
    } else {
      this.smaller = false;
    }

    return !this.smaller;
  }

  public cancel(event: Event) {
    event.preventDefault();
    const lastVersion: IVersionMetaData = this.getLastVersion();
    if (lastVersion != null) {
      this.router.navigate(['/change-list', this.program.id, lastVersion, 'read', 'none'],
        { queryParams: { lang: this.getActualLang() } });
    }
  }

  private getLastVersion(): IVersionMetaData {
    if (this.navbarService.actualProgram.versions.length > 0) {
      return this.navbarService.actualProgram.versions[0];
    } else {
      return null;
    }
  }

  public getActualLang(): string {
    return this.translateService.currentLang;
  }

}
