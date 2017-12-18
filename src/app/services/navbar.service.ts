import { Injectable } from '@angular/core';
import { IProgram } from '../models/IProgram';
import { ChangeLogService } from './change-log.service';
import { version } from 'punycode';
import { StringHelpers } from '../helpers/string-helpers';

@Injectable()
export class NavbarService {
  private _actualProgram: IProgram;
  private _actualVersions: string[];
  constructor(private changeLogService: ChangeLogService) { 

  }

  get actualProgram(): IProgram {
    return this._actualProgram;
  }

  set actualProgram(value: IProgram) {    
    this._actualProgram = value;
    this.changeLogService.getVersionsForProgramId(value.id)
    .subscribe((versions) => {
      versions.sort(StringHelpers.sortDesc);
      this.actualVersions = versions;
    })
    
  }

  get actualVersions(): string[] {
    return this._actualVersions;
  }

  set actualVersions(value: string[]){
    this._actualVersions = value;
  }

}
