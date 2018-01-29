import { StringHelpers } from '../helpers/string-helpers';
import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { IProgram } from '../models/IProgram';
import { ActualService } from '../services/actual.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfigHelper } from '../helpers/config-helper';

@Component({
  selector: 'app-program-list',
  templateUrl: './program-list.component.html',
  styleUrls: ['./program-list.component.scss']
})
export class ProgramListComponent implements OnInit {
  public programs: IProgram[];
  constructor(private configService: ConfigService,
    private actualService: ActualService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.actualService.actualProgram = null;
    this.actualService.actualVersion = {version: ""};
    this.actualService.actualVersions = [];
    this.configService.getConfig().subscribe(
      (data) => {
        console.log("program list", data);
        this.programs = data.programs;

      },
      (error) => {
        console.log("error", error);
      }
    )
  }

  public getLastVersion(program: IProgram): string {
    if (program.versions && (program.versions.length > 0)) {
      program.versions.sort(ConfigHelper.versionSorter);
      return program.versions[0].version;
    }
    else {
      return "none";
    }

  }

  public getActualLang(): string {
    return this.translateService.currentLang;
  }

}
