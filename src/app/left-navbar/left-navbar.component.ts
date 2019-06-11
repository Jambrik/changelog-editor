import { Component, OnInit, Input } from '@angular/core';
import { ActualService } from '../services/actual.service';
import { TranslateService } from '@ngx-translate/core';
import { IVersionMetaData } from '../models/IVersionMetaData';

@Component({
  selector: 'app-left-navbar',
  templateUrl: './left-navbar.component.html',
  styleUrls: ['./left-navbar.component.scss']
})
export class LeftNavbarComponent implements OnInit {
  @Input() viewMode: 'NORMAL' | 'COMPACT';
  constructor(
    private actualService: ActualService,
    private translateService: TranslateService

  ) { }

  ngOnInit() {
  }

  public get actualProgramName(): string {
    if (this.actualService.actualProgram) {
      return this.actualService.actualProgram.name;
    } else {
      return undefined;
    }
  }

  public get actualProgramId(): number {
    if (this.actualService.actualProgram) {
      return this.actualService.actualProgram.id;
    } else {
      return undefined;
    }
  }

  public get versions(): IVersionMetaData[] {
    return this.actualService.actualVersions;
  }

  public isReading(): boolean {
    return this.actualService.actualAction === 'read';
  }

  public isActual(version: IVersionMetaData): boolean {
    return this.actualService.actualVersion === version;
  }

  public getActualLang(): string {
    return this.translateService.currentLang;
  }

  public openVersionChanges(versionNumber: string) {
    if (this.viewMode === 'NORMAL') {
      return ['/change-list', this.actualProgramId, versionNumber, 'read', 'none'];
    } else {
      return ['/compact', this.actualProgramId, versionNumber];
    }
  }

}
