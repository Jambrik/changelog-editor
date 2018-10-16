import { Injectable } from '@angular/core';
import { IProgram } from '../models/IProgram';
import { ChangeLogService } from './change-log.service';
import { version } from 'punycode';
import { StringHelpers } from '../helpers/string-helpers';
import { User } from '../models/IUser';
import { IVersionMetaData } from '../models/IVersionMetaData';
import { TagInfo } from '../models/TagInfo';
import { IVersionChangeLog } from '../models/IVersionChangeLog';

@Injectable()
export class ActualService {
  private _actualProgram: IProgram;
  private _actualVersions: IVersionMetaData[];
  private _actualVersion: IVersionMetaData;
  private _actualAction: string;
  private _actualUser: User;
  private _actualTagInfos: TagInfo[];
  private _actualFilter: string;
  private _oriChangeList: IVersionChangeLog;
  private _actualChangeList: IVersionChangeLog; 


  constructor(private changeLogService: ChangeLogService) { 

  }

  get actualProgram(): IProgram {
    return this._actualProgram;
  }

  set actualProgram(value: IProgram) {    
    this._actualProgram = value;    
  }

  get actualVersions(): IVersionMetaData[] {
    return this._actualVersions;
  }

  set actualVersions(value: IVersionMetaData[]){
    this._actualVersions = value;
  }

  get actualVersion(): IVersionMetaData {
    return this._actualVersion;
  } 

  set actualVersion(value: IVersionMetaData){
    this._actualVersion = value;
  }

  get actualAction(): string {
    return this._actualAction;
  }

  set actualAction(value: string) {    
    this._actualAction = value;    
  }

  get actualUser(): User {
    return this._actualUser;
  }

  set actualUser(value: User) {    
    this._actualUser = value;    
  }

  get actualTagInfos(): TagInfo[] {
    return this._actualTagInfos;
  }

  set actualTagInfos(value: TagInfo[]) {    
    this._actualTagInfos = value;    
  }

  get actualFilter(): string {
    return this._actualFilter;
  }

  set actualFilter(value: string) {
    this._actualFilter = value;
  }

  get oriChangeList(): IVersionChangeLog {
    return this._oriChangeList;
  }

  set oriChangeList(value: IVersionChangeLog) {
    this._oriChangeList = value;
  }

  get actualChangeList(): IVersionChangeLog {
    return this._actualChangeList;
  }

  set actualChangeList(value: IVersionChangeLog) {
    this._actualChangeList = value;
  }


}
