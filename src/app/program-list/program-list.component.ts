import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfigHelper } from '../helpers/config-helper';
import { Program } from '../models/Program';
import { ActualService } from '../services/actual.service';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-program-list',
  templateUrl: './program-list.component.html',
  styleUrls: ['./program-list.component.scss']
})
export class ProgramListComponent implements OnInit {
  public programs: Program[];
  constructor(private configService: ConfigService,
    private actualService: ActualService,
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
