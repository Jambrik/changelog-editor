import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SharedModule } from '@progress/kendo-angular-inputs';
import { FormsModule } from '@angular/forms';
import { LeftNavbarComponent } from '@changelog-editor/feature/left-navbar';
import { ConfigHelper } from '@changelog-editor/util/helpers';
import { Program, VersionMetaData } from '@changelog-editor/util/models';
import { ActualService, ConfigService, ChangeLogService } from '@changelog-editor/util/services';

@Component({
  selector: 'app-new-version-creation',
  templateUrl: './new-version-creation.component.html',
  styleUrls: ['./new-version-creation.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    FormsModule,
    LeftNavbarComponent
  ]
})
export class NewVersionCreationComponent implements OnInit {
  public programId: number;
  public versionNumber: string;
  public smaller: Boolean = false;
  constructor(
    private actualService: ActualService,
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
            this.actualService.actualProgram = ConfigHelper.getProgramById(config.programs, this.programId);
            this.actualService.actualProgram.versions.sort(ConfigHelper.versionSorter);
            this.actualService.actualVersions = this.actualService.actualProgram.versions;


          });
      }
    });
  }


  public get program(): Program {
    return this.actualService.actualProgram;

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
    const lastVersion: VersionMetaData = this.getLastVersion();
    if (lastVersion != null) {
      this.smaller = this.versionNumber <= lastVersion.version;
    } else {
      this.smaller = false;
    }

    return !this.smaller;
  }

  public cancel(event: Event) {
    event.preventDefault();
    const lastVersion: VersionMetaData = this.getLastVersion();
    if (lastVersion != null) {
      this.router.navigate(['/change-list', this.program.id, lastVersion.version, 'read', 'none'],
        { queryParams: { lang: this.getActualLang() } });
    }
  }

  private getLastVersion(): VersionMetaData {
    if (this.actualService.actualProgram.versions.length > 0) {
      return this.actualService.actualProgram.versions[0];
    } else {

      return null;
    }
  }

  public getActualLang(): string {
    return this.translateService.currentLang;
  }

}
