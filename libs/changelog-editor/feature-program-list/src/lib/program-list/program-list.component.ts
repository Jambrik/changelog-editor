import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ConfigHelper } from '@changelog-editor/util/helpers';
import { Program } from '@changelog-editor/util/models';
import { ConfigService, ActualService } from '@changelog-editor/data-access-core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-program-list',
  templateUrl: './program-list.component.html',
  styleUrls: ['./program-list.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    TranslateModule
  ]
})
export class ProgramListComponent implements OnInit {
  public programs: Program[];
  constructor(@Inject(ConfigService) private configService: ConfigService,
    @Inject(ActualService) private actualService: ActualService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.actualService.actualProgram = null;
    this.actualService.actualVersion = { version: '' };
    this.actualService.actualVersions = [];
    this.configService.getConfig().subscribe(
      (data) => {
        console.log('program list', data);
        this.programs = data.programs;

      },
      (error) => {
        console.log('error', error);
      }
    );
  }

  public getLastVersion(program: Program): string {
    if (program.versions && (program.versions.length > 0)) {
      program.versions.sort(ConfigHelper.versionSorter);
      return program.versions[0].version;
    } else {
      return 'none';
    }

  }

  public getActualLang(): string {
    return this.translateService.currentLang;
  }

}
