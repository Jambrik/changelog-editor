import { Injectable } from '@angular/core';
import { DisplayableSajatTomb, FullViewChangeList } from '../full/full.component';
import { LabelValue } from '../models/LableValue';
import { Program } from '../models/Program';
import { RendezCompact } from '../models/RendezCompact';
import { TagInfoImpl } from '../models/TagInfoImpl';
import { ITagInfosCheckBox } from '../models/TagInfosCheckBox';
import { User } from '../models/User';
import { VersionChangeLog } from '../models/VersionChangeLog';
import { VersionMetaData } from '../models/VersionMetaData';
import { ChangeLogService } from './change-log.service';

@Injectable()
export class ActualService {
  private _actualProgram: Program;
  private _actualVersions: VersionMetaData[];
  private _actualVersion: VersionMetaData;
  private _actualAction: string;
  private _actualUser: User;
  private _actualTagInfos: TagInfoImpl[];
  private _actualFilter: string;
  private _oriChangeList: VersionChangeLog;
  private _actualChangeList: VersionChangeLog;
  private _iTagInfosCheckBox: ITagInfosCheckBox[];
  private _actualRendezValaszt: RendezCompact[];
  private _actualRendezKihagy: RendezCompact[];
  private _actualRendezValasztKiir: LabelValue[];
  private _actualRendezKihagyKiir: LabelValue[];
  private _oriFullViewList: FullViewChangeList[];
  private _oripagedSajatTomb2: DisplayableSajatTomb[];
  constructor(private changeLogService: ChangeLogService) {

  }

  get actualProgram(): Program {
    return this._actualProgram;
  }

  set actualProgram(value: Program) {
    this._actualProgram = value;
  }

  get actualVersions(): VersionMetaData[] {
    return this._actualVersions;
  }

  set actualVersions(value: VersionMetaData[]) {
    this._actualVersions = value;
  }

  get actualVersion(): VersionMetaData {
    return this._actualVersion;
  }

  set actualVersion(value: VersionMetaData) {
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

  get oriChangeList(): VersionChangeLog {
    return this._oriChangeList;
  }

  set oriChangeList(value: VersionChangeLog) {
    this._oriChangeList = value;
  }

  get actualChangeList(): VersionChangeLog {
    return this._actualChangeList;
  }

  set actualChangeList(value: VersionChangeLog) {
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

  get oriFullViewList(): FullViewChangeList[] {
    return this._oriFullViewList;
  }

  set oriFullViewList(value: FullViewChangeList[]) {
    this._oriFullViewList = value;
  }

  get oripagedSajatTomb2(): DisplayableSajatTomb[] {
    return this._oripagedSajatTomb2;
  }

  set oripagedSajatTomb2(value: DisplayableSajatTomb[]) {
    this._oripagedSajatTomb2 = value;
  }

}
