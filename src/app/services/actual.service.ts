import { Injectable } from '@angular/core';
import { User } from '../models/IUser';
import { IVersionChangeLog } from '../models/IVersionChangeLog';
import { IVersionMetaData } from '../models/IVersionMetaData';
import { LabelValue } from '../models/LableValue';
import { Program } from '../models/Program';
import { RendezCompact } from '../models/RendezCompact';
import { TagInfoImpl } from '../models/TagInfoImpl';
import { ITagInfosCheckBox } from '../models/TagInfosCheckBox';
import { ChangeLogService } from './change-log.service';

@Injectable()
export class ActualService {
  private _actualProgram: Program;
  private _actualVersions: IVersionMetaData[];
  private _actualVersion: IVersionMetaData;
  private _actualAction: string;
  private _actualUser: User;
  private _actualTagInfos: TagInfoImpl[];
  private _actualFilter: string;
  private _oriChangeList: IVersionChangeLog;
  private _actualChangeList: IVersionChangeLog;
  private _iTagInfosCheckBox: ITagInfosCheckBox[];
  private _actualRendezValaszt: RendezCompact[];
  private _actualRendezKihagy: RendezCompact[];
  private _actualRendezValasztKiir: LabelValue[];
  private _actualRendezKihagyKiir: LabelValue[];
  constructor(private changeLogService: ChangeLogService) {

  }

  get actualProgram(): Program {
    return this._actualProgram;
  }

  set actualProgram(value: Program) {
    this._actualProgram = value;
  }

  get actualVersions(): IVersionMetaData[] {
    return this._actualVersions;
  }

  set actualVersions(value: IVersionMetaData[]) {
    this._actualVersions = value;
  }

  get actualVersion(): IVersionMetaData {
    return this._actualVersion;
  }

  set actualVersion(value: IVersionMetaData) {
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

  get actualTagInfos(): TagInfoImpl[] {
    return this._actualTagInfos;
  }

  set actualTagInfos(value: TagInfoImpl[]) {
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


  get iTagInfosCheckBox(): ITagInfosCheckBox[] {
    return this._iTagInfosCheckBox;
  }

  set iTagInfosCheckBox(value: ITagInfosCheckBox[]) {
    this._iTagInfosCheckBox = value;
  }


  get actualRendezValaszt(): RendezCompact[] {
    return this._actualRendezValaszt;
  }

  set actualRendezValaszt(value: RendezCompact[]) {
    this._actualRendezValaszt = value;
  }

  get actualRendezKihagy(): RendezCompact[] {
    return this._actualRendezKihagy;
  }

  set actualRendezKihagy(value: RendezCompact[]) {
    this._actualRendezKihagy = value;
  }

  get actualRendezValasztKiir(): LabelValue[] { // ILabelValue
    return this._actualRendezValasztKiir;
  }

  set actualRendezValasztKiir(value: LabelValue[]) {
    this._actualRendezValasztKiir = value;
  }

  get actualRendezKihagyKiir(): LabelValue[] {
    return this._actualRendezKihagyKiir;
  }

  set actualRendezKihagyKiir(value: LabelValue[]) {
    this._actualRendezKihagyKiir = value;
  }

}
