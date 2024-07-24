import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '@progress/kendo-angular-notification';
import { PageChangeEvent } from '@progress/kendo-angular-pager';
import * as _ from 'lodash';
import { range } from 'rxjs';
import { concatAll, map, switchMap, toArray } from 'rxjs/operators';
import { Constants } from '../constants/constants';
import { ConfigHelper } from '../helpers/config-helper';
import { StringHelpers } from '../helpers/string-helpers';
import { ChangeLogItem } from '../models/ChangeLogItem';
import { I18n } from '../models/I18N';
import { LabelValue } from '../models/LableValue';
import { Program } from '../models/Program';
import { RendezCompact } from '../models/RendezCompact';
import { TagInfoImpl } from '../models/TagInfoImpl';
import { ITagInfosCheckBox } from '../models/TagInfosCheckBox';
import { VersionChangeLog } from '../models/VersionChangeLog';
import { VersionMetaData } from '../models/VersionMetaData';
import { ActualService } from '../services/actual.service';
import { ChangeLogService } from '../services/change-log.service';
import { ConfigService } from '../services/config.service';
import { ChangeLogAction } from '../types/types';

export interface FullViewChangeList {
  version: string;
  changes: ChangeLogItem[];
  releaseDate?: Date;
}

export interface DisplayableSajatTomb {
  change: ChangeLogItem;
  version: string;
}

@Component({
  selector: 'app-full-screen',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss']
})

export class FullComponent implements OnInit {

  public programId: number;
  public program: Program;
  public version: VersionMetaData = { version: '' };
  public changeList: VersionChangeLog;
  public action: ChangeLogAction;
  public id: string;
  public oldId: string;
  public newChangeItem: ChangeLogItem;
  public langs: LabelValue[] = [];
  public selectedLangs: string[] = [];
  public filterText = '';
  public loading = false;
  public types: LabelValue[] = [];
  public selectedTypes: string[] = [];
  public importances: LabelValue[] = [];
  public selectedImportances: string[] = [];
  public isEditor = true;
  private noVersionYetCaption: string;
  public showReleasedVersionWarning = false;
  public iTagInfosCheckBox: ITagInfosCheckBox[];
  public iTagInfosCheckBoxAdd: string[] = [];
  public startDate: Date;
  public vegeDate: Date;
  public pageSzoveg: string;
  public techSzoveg: string;
  public workSzoveg: string;
  public wsSzoveg: string;
  public alrSzoveg: string;
  public page = false;
  public tech = false;
  public work = false;
  public w = false;
  public alr = false;
  public men = false;
  public pageCode: string;
  public techCode: string;
  public workCode: string;
  public wS: string;
  public alrKod: string;
  public menuKod: string;
  public tableAdatok: any[] = [];
  public menuSzoveg: string;
  public text: string;
  public elementNev: string;
  public sortChanges: ChangeLogItem[];
  public tableAdatokRendezes: RendezCompact[];
  public tableAdatokRendezesNelkul: RendezCompact[];
  public elsoProperty: any = '';
  public masodikProperty: any = '';
  public harmadikProperty: any = '';
  public negyedikProperty: any = '';
  public otodikProperty: any = '';
  public hatodikProperty: any = '';
  public hetedikProperty: any = '';
  public elsoRendez: any = false;
  public masodikRendez = false;
  public harmadikRendez = false;
  public negyedikRendez = false;
  public otodikRendez = false;
  public hatodikRendez = false;
  public hetedikRendez = false;
  public sorba: RendezCompact[] = [];
  public rendezVezerles: any[] = [0];
  public rendezKihagy: LabelValue[] = [];
  public sajatTomb: FullViewChangeList[];
  public sajatTomb2: DisplayableSajatTomb[] = [];
  public filteredDisplayedTomb: DisplayableSajatTomb[] = [];
  public pagedSajatTomb2: DisplayableSajatTomb[] = [];
  public contentId = "content-1";
  public total: number;
  public skip = 0;
  public pageSize = 5;

  constructor(
    private route: ActivatedRoute,
    private changeLogService: ChangeLogService,
    private actualService: ActualService,
    private configService: ConfigService,
    private translateService: TranslateService,
    private router: Router,
    private notificationService: NotificationService,
    private datePipe: DatePipe

  ) { }

  ngOnInit() {
    this.selectedTypes = [Constants.BUGFIX, Constants.FEATURE];
    this.selectedImportances = [Constants.LOW, Constants.NORMAL, Constants.HIGH];
    this.loadTypes();
    this.loadImportance();
    this.loadCaptionTranslations();
    // this.taginfosBox();
    // Because we load always the same component, the init run only once. So we subscribe the router params changes:
    this.route.params.subscribe(params => {
      const programId = params['program-id'];

      let localVersions: VersionMetaData[] = [];
      this.changeLogService.getVersionsForProgramId(programId).pipe(
        switchMap((versions) => {
          localVersions = versions;
          return range(0, versions.length);
        }),
        map((i) =>
          this.changeLogService.getChangeLogs(programId, localVersions[i].version),
        ),
        concatAll(),
        toArray(),
      ).subscribe((result) => {
        this.sajatTomb = result;
        this.actualService.oriFullViewList = result;

        let currentVersion: string;
        let displayableSajatTombElem: DisplayableSajatTomb;
        this.sajatTomb.forEach((elem) => {
          elem.changes.forEach((change) => {
            if (currentVersion === elem.version) {
              displayableSajatTombElem = {
                change: change,
                version: null,
              };
              this.sajatTomb2.push(displayableSajatTombElem);
            } else {
              currentVersion = elem.version;
              displayableSajatTombElem = {
                change: change,
                version: elem.version,
              }
            }
            this.sajatTomb2.push(displayableSajatTombElem);
          })
          //a result-ban vannak a szükséges adataid, konzolban látod, hogy hogyan használhatod fel
        });
        this.total = this.sajatTomb2.length;
        this.actualService.oripagedSajatTomb2 = this.sajatTomb2;
        this.filteredDisplayedTomb = this.sajatTomb2;
        this.pageData();
      });

      const versionNumber: string = params['version'];
      const lang = params['lang'];
      const id = params['id'];
      const action = params['action'];
      let wasActionChange = false;
      if (action !== this.action) {
        this.action = action;
        wasActionChange = true;
      }
      this.actualService.actualAction = this.action;
      if (!this.action) {
        this.action = 'read';
      }

      console.log('programId, version, action, id', programId, versionNumber, this.action, id);
      const programIdInt = parseInt(programId, 10);
      this.oldId = this.id;
      if (id === 'null') {
        this.id = null;
      } else {
        this.id = id;
      }

      if (this.programId !== programIdInt) {
        this.configService.getConfig()
          .subscribe((config) => {
            this.programId = programIdInt;
            this.program = ConfigHelper.getProgramById(config.programs, this.programId);
            this.actualService.actualProgram = this.program;
            console.log('New program id', programId);
            this.langs = [];
            this.selectedLangs = [];
            this.program.langs.forEach((l) => {
              this.langs.push({
                label: l,
                value: l
              });
              this.selectedLangs.push(l);
            });
            this.setActualTaginfos();
            /* this.buildCompactChangesText(null); */
            // First of all we have get the versions

            /* this.changeLogService.getVersionsForProgramId(programId)
              .subscribe((versions) => {
                versions.sort(ConfigHelper.versionSorter);
                this.actualService.actualVersions = versions;
                // If version is the latest we have to find that
                if ((versionNumber === 'last') && (versions.length > 0)) {
                  this.version = versions[0];
                } else {
                  this.version = ConfigHelper.getVersion(versions, versionNumber);
                }
                this.actualService.actualVersion = this.version;
                if (this.version != null) {
                  this.getChanges();
                  if (this.action === 'new') {
                    this.newItemCreate();
                  }
                } else {
                  this.actualService.oriChangeList = {
                    version: null,
                    type: null,
                    releaseDate: null,
                    changes: []
                  };
                  this.changeList = this.actualService.oriChangeList;
                }
              }); */
          });
      } else if ((this.version != null) && (versionNumber !== this.version.version)) {
        this.version = ConfigHelper.getVersion(this.actualService.actualVersions, versionNumber);
        this.actualService.actualVersion = this.version;
        this.getChanges();
        if (this.action === 'new') {
          this.newItemCreate();
        }
      } else if (wasActionChange) {
        if (this.action === 'new') {
          this.newItemCreate();
        } else {
          this.refilter();
        }
      }
    });

    /* this.route.queryParams.subscribe((queryParams) => {
      this.loadImportance();
      this.loadTypes();
      this.loadCaptionTranslations();
      this.filterText = queryParams['filter'];
      if (this.actualService.oriChangeList) {
        this.changeList = this.filter(this.actualService.oriChangeList);
      }
    }); */
    if (this.startDate == null) {
      this.startDate = new Date('1990-01-01T00:00:00');
    }

    if (this.vegeDate == null) {
      this.vegeDate = new Date('2099-12-31T00:00:00');
    }
  }

  private loadCaptionTranslations() {
    setTimeout(() => {
      this.translateService.get('NO_VERSION_YET')
        .subscribe((translation) => {
          this.noVersionYetCaption = translation;
        });
    }, 100);
  }

  private loadTypes() {
    /* console.log('in load types'); */
    setTimeout(() => {
      this.types = [];

      this.translateService.get([Constants.BUGFIX, Constants.FEATURE])
        .subscribe((t) => {
          /* console.log('in load types subscribe'); */
          if (t.bugfix) {
            this.types.push({ value: Constants.BUGFIX, label: t.bugfix });
          }

          if (t.feature) {
            this.types.push({ value: Constants.FEATURE, label: t.feature });
          }
          /* console.log('types', this.types); */

          if (t.COMPACT_VIEW) {
            this.types.push({ value: Constants.COMPACT_VIEW, label: t.COMPACT_VIEW });
          }

        });
    }, 100);


  }
  private loadImportance() {
    setTimeout(() => {
      this.importances = [];

      this.translateService.get([Constants.LOW, Constants.NORMAL, Constants.HIGH])
        .subscribe((t) => {
          if (t.low) {
            this.importances.push({ value: Constants.LOW, label: t.low });
          }

          if (t.normal) {
            this.importances.push({ value: Constants.NORMAL, label: t.normal });
          }

          if (t.high) {
            this.importances.push({ value: Constants.HIGH, label: t.high });
          }
        });
    }, 100);

  }

  private filter(inputChangeList: DisplayableSajatTomb[]): DisplayableSajatTomb[] {
    let changes: DisplayableSajatTomb[] = [];

    /*
    inputChangeList: 
      changes[],
      version,
      stb...

    inputChangeList[]:
      change,
      version
    */

    inputChangeList.forEach(change => {
      console.log('change.importance', change.change.importance);
      if ((this.selectedTypes.indexOf(change.change.type) > -1) &&
        ((!change.change.importance && (this.selectedImportances.indexOf(Constants.NORMAL) > -1)) ||
          (this.selectedImportances.indexOf(change.change.importance) > -1))) {
        let found = false;
        const newChange: DisplayableSajatTomb = _.cloneDeep(change);
        if (!newChange.change.importance || (newChange.change.importance == null)) {
          newChange.change.importance = 'normal';
        }
        if ((this.filterText) && (this.filterText != null) && (this.filterText !== '')) {
          if (newChange.change.ticketNumber && (newChange.change.ticketNumber != null) && (newChange.change.ticketNumber !== '')) {
            const bs = StringHelpers.findAndGreen(newChange.change.ticketNumber, this.filterText, true);
            found = bs.bool;

            if (found) {
              newChange.change.ticketNumber = bs.str;
            }
          }
          if (!found) {
            found = this.filterDescription(newChange);
          }
        } else {
          found = true;
        }

        if (found) {
          changes.push(newChange);
        }
      }
    });

    return changes;
  }

  refilter() {
    if (this.action === 'mod') {
      this.sajatTomb2.forEach(change => {
        if (change.change.id === this.id) {
          this.actualService.oriChangeList.changes.forEach(oriChange => {
            if (oriChange.id === this.id) {
              const descriptions = [];
              oriChange.descriptions.forEach(description => {
                descriptions.push(
                  {
                    lang: description.lang,
                    text: description.text
                  }
                );
              });
              change.change.descriptions = descriptions;
            }
          });
          this.filterDescription(change);
        }
      });
    } else if (this.action === 'read') {


      this.sajatTomb2.forEach(change => {
        if (change.change.id === this.oldId) {
          this.filterDescription(change);
        }
      });


    }

  }

  filterDescription(change: DisplayableSajatTomb): boolean {
    let found = false;
    if (this.filterText) {
      change.change.descriptions.forEach(description => {
        if (!found) {
          const bs = StringHelpers.findAndGreen(description.text, this.filterText, this.action === 'read');
          found = bs.bool;
          if (found) {
            description.text = bs.str;
          }
        }
      });
    } else {
      found = true;
    }

    return found;
  }

  public getChanges() {
    if (this.version.version !== 'none') {
      this.loading = true;
      if (this.changeList) {
        this.changeList.changes = [];
      }
      this.changeLogService.getChangeLogs(this.programId, this.version.version)
        .subscribe(changeList => {
          if (changeList.releaseDate) {
            changeList.releaseDate = new Date(changeList.releaseDate);
          }
          changeList.changes.forEach(change => {
            change.date = new Date(change.date);
          });
          changeList.changes.sort((a, b) => {
            if (a.date > b.date) {
              return -1;
            } else if (a.date < b.date) {
              return 1;
            } else {
              return 0;
            }
          });

          this.pagedSajatTomb2 = this.filter(this.actualService.oripagedSajatTomb2);
          this.loading = false;
        },
          (error) => {
            /* console.log('getChanges', error); */
            this.notificationService.show({ type: { style: 'error', icon: true }, content: error.error, closable: true });
            this.loading = false;
          });
    } else {
      this.actualService.oriChangeList = {
        releaseDate: null,
        version: null,
        changes: []
      };
      this.changeList = _.cloneDeep(this.actualService.oriChangeList);
    }
  }


  public isNewEditing(): boolean {
    return (this.action === 'new') && (this.newChangeItem !== undefined);
  }

  public isReading(): boolean {
    return (this.action === 'read');
  }

  private getNewDescriptions(): I18n[] {
    const resultList: I18n[] = [];
    this.program.langs.forEach(lang => {
      resultList.push({
        lang: lang,
        text: ''
      });
    });
    return resultList;
  }

  private newItemCreate() {
    this.newChangeItem = {
      id: null,
      type: 'feature',
      importance: 'normal',
      ticketNumber: null,
      date: new Date(),
      descriptions: this.getNewDescriptions(),
      tags: [],
      cru: null,
      crd: null,
      lmu: null,
      lmd: null
    };
  }

  public getActualLang(): string {
    return this.translateService.currentLang;
  }

  public selectedTypesChange(event: string[], type) {
    console.log('selectedTypesChange', event, type);
    if (event) {
      this.selectedTypes.push(type.value);
    } else {
      this.selectedTypes.splice(this.selectedTypes.indexOf(type.value, 0), 1);
    }
    this.filteredDisplayedTomb = this.filter(this.actualService.oripagedSajatTomb2);
    this.total = this.filteredDisplayedTomb.length;
    this.skip = 0;
    this.pageData();
    /* let tempChangeList: VersionChangeLog[] = [];
    this.actualService.oriFullViewList.forEach((sajatElem) => {
      tempChangeList.push(this.filter(sajatElem));
    });

    this.sajatTomb = tempChangeList; */
  }

  public selectedImportancesChange(event: string[], importance) {
    console.log('selectedImportancesChange', event, importance);
    if (event) {
      this.selectedImportances.push(importance.value);
    } else {
      this.selectedImportances.splice(this.selectedImportances.indexOf(importance.value, 0), 1);
    }
    this.filteredDisplayedTomb = this.filter(this.actualService.oripagedSajatTomb2);
    this.total = this.filteredDisplayedTomb.length;
    this.skip = 0;
    this.pageData();
    /* let tempChangeList: VersionChangeLog[] = [];
    this.actualService.oriFullViewList.forEach((sajatElem) => {
      tempChangeList.push(this.filter(sajatElem));
    });

    this.sajatTomb = tempChangeList; */
  }

  public selectedLangsChange(event: string[], lang) {
    console.log('selectedLangsChange', event, lang);
    if (event) {
      this.selectedLangs.push(lang.value);
    } else {
      this.selectedLangs.splice(this.selectedLangs.indexOf(lang.value, 0), 1);
    }
    this.filteredDisplayedTomb = this.filter(this.actualService.oripagedSajatTomb2);
    this.total = this.filteredDisplayedTomb.length;
    this.skip = 0;
    this.pageData();
    /* let tempChangeList: VersionChangeLog[] = [];
    this.actualService.oriFullViewList.forEach((sajatElem) => {
      tempChangeList.push(this.filter(sajatElem));
    });

    this.sajatTomb = tempChangeList; */
    // changeList: 
    // sajatTomb: changeList[]
    // forEach((sajatElem))  -- sajatElem: 
  }

  public printVersion() {
    if (this.version && (this.version != null) && (this.version.version !== 'none')) {
      return this.version.version;
    } else {
      return this.noVersionYetCaption;
    }
  }

  public get versionNumber() {
    if (this.version && (this.version != null)) {
      return this.version.version;
    } else {
      return '';
    }

  }

  public saveReleaseDate(event: Event) {
    event.preventDefault();
    /* console.log('this.changeList.releaseDate', this.changeList.releaseDate); */
    this.changeLogService.changeLogRelease(this.program.id, this.version.version, this.changeList.releaseDate)
      .subscribe((x) => {
        this.changeLogService.getVersionsForProgramId(this.programId)
          .subscribe((versions) => {
            versions.sort(ConfigHelper.versionSorter);
            this.actualService.actualVersions = versions;
            this.getChanges();
          });
      },
        (error) => {
          this.notificationService.show({ type: { style: 'error', icon: true }, content: error.error, closable: true });
        });
  }

  private setActualTaginfos() {
    const resultList: TagInfoImpl[] = [];
    const program: Program = this.actualService.actualProgram;
    const tagInfos = program.tagInfos;
    if (tagInfos) {
      for (const tagInfo of tagInfos) {
        const tio = new TagInfoImpl(
          tagInfo.code,
          tagInfo.captions,
          tagInfo.fix,
          tagInfo.moreOptionsAllowed,
          tagInfo.mandatory,
          tagInfo.dataType,
          tagInfo.setOfValues,
          this.translateService
        );
        resultList.push(tio);
      }
    }
    this.actualService.actualTagInfos = resultList;
  }

  public getLastVersion(program: Program): string {
    if (program.versions && (program.versions.length > 0)) {
      program.versions.sort(ConfigHelper.versionSorter);
      return program.versions[0].version;
    } else {
      return 'none';
    }

  }

  public buildCompactChangesText(event: string): void {
    this.taginfosBox();
    const lang = this.translateService.currentLang;
    let text = '';
    let szoveg = '';
    let szoveg_ossze = '';
    let elso_date = '';
    let utolso_date = '';
    let tableAdatok: any = '';
    this.tableAdatok = [];
    const importance = '';

    for (const item of this.actualService.actualChangeList.changes) {
      for (const description of item.descriptions) {
        if (description.lang === lang) {
          this.pageCode = '';
          this.techCode = '';
          this.workCode = '';
          this.wS = '';
          this.alrKod = '';
          this.menuKod = '';

          if (item.tags === undefined) {
            item.tags = [];
          }

          if (item.tags) {
            for (let i = 0; i < item.tags.length; i++) {

              if (item.tags[i].code === 'PAGE') {
                this.pageCode = item.tags[i].code;
              }
              if (item.tags[i].code === 'TECHNICAL_CHANGE') {
                this.techCode = item.tags[i].code;
              }
              if (item.tags[i].code === 'WORK_HOURS') {
                this.workCode = item.tags[i].code;
              }
              if (item.tags[i].code === 'WS') {
                this.wS = item.tags[i].code;
              }
              if (item.tags[i].code === 'ALRKOD') {
                this.alrKod = item.tags[i].code;
              }
              if (item.tags[i].code === 'MENUKOD') {
                this.menuKod = item.tags[i].code;
              }
            }
          }

          this.page = false;
          this.tech = false;
          this.work = false;
          this.w = false;
          this.alr = false;
          this.men = false;
          this.pageSzoveg = '';
          this.techSzoveg = '';
          this.workSzoveg = '';
          this.wsSzoveg = '';
          this.alrSzoveg = '';
          this.menuSzoveg = '';

          for (let e = 0; e < this.actualService.iTagInfosCheckBox.length; e++) {
            if (this.actualService.iTagInfosCheckBox[e].code === this.pageCode &&
              (this.actualService.iTagInfosCheckBox[e].selected)) {
              this.page = true;

            }

            if (this.actualService.iTagInfosCheckBox[e].code === this.techCode &&
              (this.actualService.iTagInfosCheckBox[e].selected)) {
              this.tech = true;
            }

            if (this.actualService.iTagInfosCheckBox[e].code === this.workCode &&
              (this.actualService.iTagInfosCheckBox[e].selected)) {
              this.work = true;
            }

            if (this.actualService.iTagInfosCheckBox[e].code === this.wS &&
              (this.actualService.iTagInfosCheckBox[e].selected)) {
              this.w = true;
            }
            if (this.actualService.iTagInfosCheckBox[e].code === this.alrKod &&
              (this.actualService.iTagInfosCheckBox[e].selected)) {
              this.alr = true;
            }
            if (this.actualService.iTagInfosCheckBox[e].code === this.menuKod &&
              (this.actualService.iTagInfosCheckBox[e].selected)) {
              this.men = true;
            }



          }


          if (!this.actualService.actualTagInfos) {
            this.setActualTaginfosAdd();
          }

          this.actualService.actualTagInfos.forEach(change => {
            change.captions.forEach(c => {
              item.tags.forEach(code => {

                if (code.value === undefined) {
                  code.value = '';
                }

                if (code.code === change.code && description.lang === c.lang && code.code === 'PAGE') {
                  for (let index = 0; index < change.setOfValues.length; index++) {
                    const element = change.setOfValues[index].code;
                    for (let codeValuesIndex = 0; codeValuesIndex < code.values.length; codeValuesIndex++) {
                      if (element.toString() === code.values[codeValuesIndex].toString()) {
                        for (let i = 0; i < change.setOfValues.length; i++) {

                          const e = change.setOfValues[i].code;

                          if (e === [element].toString()) {
                            for (let index2 = 0; index2 < change.setOfValues[i].captions.length; index2++) {
                              const element2 = change.setOfValues[i].captions[index2].lang;
                              if (element2 === description.lang) {
                                code.values[codeValuesIndex] = change.setOfValues[i].captions[index2].text;
                              }
                            }
                          }
                        }
                      }
                    }

                  }

                  /* console.log('code.values:' + code.values); */
                  this.pageSzoveg = code.values + '\n';
                }
                if (code.code === change.code && description.lang === c.lang && code.code === 'TECHNICAL_CHANGE') {
                  if (code.value) {
                    code.value = 'Van';
                  } else if (!code.value) {
                    code.value = 'Nincs';
                  }
                  this.techSzoveg = code.value + '\n';
                }

                if (code.code === change.code && description.lang === c.lang && code.code === 'WORK_HOURS') {
                  this.workSzoveg = code.value + '\n';
                }

                if (code.code === change.code && description.lang === c.lang && code.code === 'WS') {
                  for (let index = 0; index < change.setOfValues.length; index++) {
                    const element = change.setOfValues[index].code;
                    if (code.values.toString() === element.toString()) {
                      code.values = [change.setOfValues[index].captions[0].text];
                    }
                  }
                  this.wsSzoveg = code.values + '\n';
                }

                if (code.code === change.code && description.lang === c.lang && code.code === 'ALRKOD') {
                  for (let index = 0; index < change.setOfValues.length; index++) {
                    const element = change.setOfValues[index].code;

                    if (code.values.toString() === element.toString()) {
                      code.values = [change.setOfValues[index].captions[0].text];
                    }
                  }
                  this.alrSzoveg = code.values + '\n';
                }

                if (code.code === change.code && description.lang === c.lang && code.code === 'MENUKOD') {
                  if (change.setOfValues !== undefined) {
                    for (let index = 0; index < change.setOfValues.length; index++) {
                      const element = change.setOfValues[index].code;
                      if (code.values.toString() === element.toString()) {
                        code.values = [change.setOfValues[index].captions[0].text];
                      }
                    }
                  }
                  this.menuSzoveg = code.value + '\n';
                }


              });


            });

          });

          if (!this.page) {
            this.pageSzoveg = '';
          }
          if (!this.tech) {
            this.techSzoveg = '';
          }
          if (!this.work) {
            this.workSzoveg = '';
          }

          if (!this.w) {
            this.wsSzoveg = '';
          }

          if (!this.alr) {
            this.alrSzoveg = '';
          }

          if (!this.men) {
            this.menuSzoveg = '';
          }



          if (item.crd === undefined) {
            item.crd = new Date('1990-01-01T00:00:00');
          }

          elso_date = this.datePipe.transform(item.crd, 'yyyy.MM.dd');

          if (this.startDate == null) {
            this.startDate = new Date('1990-01-01T00:00:00');
          }

          if (this.vegeDate == null) {
            this.vegeDate = new Date('2099-12-31T00:00:00');
          }


          if ((new Date(item.crd) >= new Date(this.startDate)) && (new Date(item.crd) <= new Date(this.vegeDate))) {
            this.types = [];
            this.translateService.get([item.type, item.type])
              .subscribe((t) => {
                if (t.bugfix) {
                  szoveg = t.bugfix;
                }

                if (t.feature) {
                  szoveg = t.feature;
                }

              });


            this.importances = [];
            this.translateService.get([item.importance])
              .subscribe((t) => {
                if (t.low) {
                  this.importances.push({ value: Constants.LOW, label: t.low });
                }

                if (t.normal) {
                  this.importances.push({ value: Constants.NORMAL, label: t.normal });
                }

                if (t.high) {
                  this.importances.push({ value: Constants.HIGH, label: t.high });
                }
              });


            if (item.ticketNumber == null) {
              item.ticketNumber = '';
              szoveg_ossze = szoveg;
            } else {
              szoveg_ossze = szoveg;
            }

            if (item.ticketNumber !== '') {
              item.ticketNumber = item.ticketNumber + '\r';
            } else {
              item.ticketNumber = item.ticketNumber;
            }

            if (elso_date === utolso_date) {
              text = text + item.ticketNumber + this.pageSzoveg + this.techSzoveg + this.workSzoveg + this.wsSzoveg + this.alrSzoveg
                + szoveg_ossze + this.menuSzoveg + '\n' + description.text + '\n' + '\r';
            } else {
              text = text + '----------- ' + this.datePipe.transform(item.crd, 'yyyy.MM.dd') +
                ' -----------' + '\r' + item.ticketNumber + this.pageSzoveg + this.techSzoveg + this.workSzoveg + this.wsSzoveg
                + this.alrSzoveg + this.menuSzoveg
                + szoveg_ossze + '\n' + description.text + '\n' + '\r';
            }


            tableAdatok = {
              date: elso_date,
              ticketNumber: item.ticketNumber.replace(/<[^>]*>/g, ''),
              page: this.pageSzoveg.replace(/<[^>]*>/g, ''),
              technical_change: this.techSzoveg.replace(/<[^>]*>/g, ''),
              work_hours: this.workSzoveg.replace(/<[^>]*>/g, ''),
              ws: this.wsSzoveg.replace(/<[^>]*>/g, ''),
              alrkod: this.alrSzoveg.replace(/<[^>]*>/g, ''),
              type: szoveg_ossze.replace(/<[^>]*>/g, ''),
              menukod: this.menuSzoveg.replace(/<[^>]*>/g, ''),
              text: description.text.replace(/<[^>]*>/g, ''),
              importance: this.importances[0].label.replace(/<[^>]*>/g, ''),

            };
            this.tableAdatok.push(tableAdatok);


            utolso_date = this.datePipe.transform(item.crd, 'yyyy.MM.dd');
          }
        }
      }

      if (item.ticketNumber) {
        item.ticketNumber = item.ticketNumber.replace('\r', '');
      }
    }

    this.text = text;

  }

  public taginfosBox() {
    if (this.actualService.actualProgram.tagInfos === undefined) {
      this.actualService.actualProgram.tagInfos = [];
    }

    if (!this.iTagInfosCheckBox) {
      this.iTagInfosCheckBox = [];
      for (let i = 0; i < this.actualService.actualProgram.tagInfos.length; i++) {

        if (this.actualService.actualProgram.tagInfos[i].code === 'PAGE') {
          this.elementNev = 'Érinett oldalak';
        } else if (this.actualService.actualProgram.tagInfos[i].code === 'TECHNICAL_CHANGE') {
          this.elementNev = 'Technikai változás';
        } else if (this.actualService.actualProgram.tagInfos[i].code === 'WORK_HOURS') {
          this.elementNev = 'Munkaóra';
        } else if (this.actualService.actualProgram.tagInfos[i].code === 'WS') {
          this.elementNev = 'ws';
        } else if (this.actualService.actualProgram.tagInfos[i].code === 'ALRKOD') {
          this.elementNev = 'Alrendszer kód';
        } else if (this.actualService.actualProgram.tagInfos[i].code === 'MENUKOD') {
          this.elementNev = 'Menü kód';
        } else {
          this.elementNev = this.actualService.actualProgram.tagInfos[i].code;
        }


        const iTagInfosCheckBoxConst = {
          code: this.actualService.actualProgram.tagInfos[i].code,
          id: i,
          selected: true,
          nev: this.elementNev

        };
        this.iTagInfosCheckBox.push(iTagInfosCheckBoxConst);
      }

      this.actualService.iTagInfosCheckBox = this.iTagInfosCheckBox;
    }

  }

  private setActualTaginfosAdd() {
    const resultList: TagInfoImpl[] = [];
    const program: Program = this.actualService.actualProgram;
    const tagInfos = program.tagInfos;
    program.tagInfos.forEach((x) => console.log('taginfo:' + x.captions.forEach((y) => console.log('caption:' + y.text))));
    if (tagInfos) {
      for (const tagInfo of tagInfos) {
        const tio = new TagInfoImpl(
          tagInfo.code,
          tagInfo.captions,
          tagInfo.fix,
          tagInfo.moreOptionsAllowed,
          tagInfo.mandatory,
          tagInfo.dataType,
          tagInfo.setOfValues,
          this.translateService
        );
        resultList.push(tio);
      }
    }
    this.actualService.actualTagInfos = resultList;
  }

  public sorrendNelkulOszlopok(kiValaszt: RendezCompact[], megMarad: RendezCompact[]) {
    this.tableAdatokRendezesNelkul = [];

    for (let index = 0; index < megMarad.length; index++) {
      if (this.elsoProperty !== megMarad[index].property && this.masodikProperty !== megMarad[index].property &&
        this.harmadikProperty !== megMarad[index].property && this.negyedikProperty !== megMarad[index].property &&
        this.otodikProperty !== megMarad[index].property && this.hatodikProperty !== megMarad[index].property &&
        this.hetedikProperty !== megMarad[index].property) {
        this.tableAdatokRendezesNelkul.push(megMarad[index]);
      }
    }
  }

  public onPageChange(e: PageChangeEvent): void {
    this.skip = e.skip;
    this.pageSize = e.take;
    this.pageData();
  }

  private pageData(): void {
    this.pagedSajatTomb2 = this.filteredDisplayedTomb.slice(
      this.skip,
      this.skip + this.pageSize
    );
  }
}