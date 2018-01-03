import { Injectable } from '@angular/core';
import { IProgram } from '../models/IProgram';
import { ChangeLogService } from './change-log.service';
import { version } from 'punycode';
import { StringHelpers } from '../helpers/string-helpers';

@Injectable()
export class NavbarService {
  private _actualProgram: IProgram;
  private _actualVersions: string[];
  private _actualVersion: string;
  private _actualAction: string;

  constructor(private changeLogService: ChangeLogService) { 

  }

  get actualProgram(): IProgram {
    return this._actualProgram;
  }

  set actualProgram(value: IProgram) {    
    this._actualProgram = value;    
  }

  get actualVersions(): string[] {
    return this._actualVersions;
  }

  set actualVersions(value: string[]){
    this._actualVersions = value;
  }

  get actualVersion(): string {
    return this._actualVersion;
  } 

  set actualVersion(value: string){
    this._actualVersion = value;
  }

  get actualAction(): string {
    return this._actualAction;
  }

  set actualAction(value: string) {    
    this._actualAction = value;    
  }
  
}
