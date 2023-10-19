import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '@progress/kendo-angular-notification';
import * as _ from 'lodash';
import { Constants } from '../constants/constants';
import { ConfigHelper } from '../helpers/config-helper';
import { StringHelpers } from '../helpers/string-helpers';
import { ChangeLogItem } from '../models/ChangeLogItem';
import { I18n } from '../models/I18N';
import { LabelValue } from '../models/LableValue';
import { Program } from '../models/Program';
import { TagInfoImpl } from '../models/TagInfoImpl';
import { ITagInfosCheckBox } from '../models/TagInfosCheckBox';
import { VersionChangeLog } from '../models/VersionChangeLog';
import { VersionMetaData } from '../models/VersionMetaData';
import { ActualService } from '../services/actual.service';
import { ChangeLogService } from '../services/change-log.service';
import { ConfigService } from '../services/config.service';
import { ChangeLogAction } from '../types/types';

@Component({
  selector: 'app-change-list',
  templateUrl: './change-list.component.html',
  styleUrls: ['./change-list.component.scss']
})
export class ChangeListComponent implements OnInit, OnChanges {
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

  constructor(
    private route: ActivatedRoute,
    private changeLogService: ChangeLogService,
    private actualService: ActualService,
    private configService: ConfigService,
    private translateService: TranslateService,
    private router: Router,
    private notificationService: NotificationService

  ) { }

  ngOnInit() {

    this.selectedTypes = [Constants.BUGFIX, Constants.FEATURE];
    this.selectedImportances = [Constants.LOW, Constants.NORMAL, Constants.HIGH];

    this.loadTypes();
    this.loadImportance();
    // this.taginfosBox();
    // Because we load always the same component, the init run only once. So we subscribe the router params changes:
    this.route.params.subscribe(params => {
      const programId = params['program-id'];
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
            // First of all we have get the versions
            this.changeLogService.getVersionsForProgramId(programId)
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
              });
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

    this.route.queryParams.subscribe((queryParams) => {
      this.loadImportance();
      this.loadTypes();
      this.loadCaptionTranslations();
      this.filterText = queryParams['filter'];
      if (this.actualService.oriChangeList) {
        this.changeList = this.filter(this.actualService.oriChangeList);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {


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
    console.log('in load types');
    setTimeout(() => {
      this.types = [];

      this.translateService.get([Constants.BUGFIX, Constants.FEATURE])
        .subscribe((t) => {
          console.log('in load types subscribe');
          if (t.bugfix) {
            this.types.push({ value: Constants.BUGFIX, label: t.bugfix });
          }

          if (t.feature) {
            this.types.push({ value: Constants.FEATURE, label: t.feature });
          }
          console.log('types', this.types);

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

  private filter(inputChangeList: VersionChangeLog): VersionChangeLog {
    const changeList = {
      releaseDate: inputChangeList.releaseDate,
      version: inputChangeList.version,
      changes: []
    };

    inputChangeList.changes.forEach(change => {
      console.log('change.importance', change.importance);
      if ((this.selectedTypes.indexOf(change.type) > -1) &&
        ((!change.importance && (this.selectedImportances.indexOf(Constants.NORMAL) > -1)) ||
          (this.selectedImportances.indexOf(change.importance) > -1))) {
        let found = false;
        const newChange: ChangeLogItem = _.cloneDeep(change);
        if (!newChange.importance || (newChange.importance == null)) {
          newChange.importance = 'normal';
        }
        if ((this.filterText) && (this.filterText != null) && (this.filterText !== '')) {
          if (newChange.ticketNumber && (newChange.ticketNumber != null) && (newChange.ticketNumber !== '')) {
            const bs = StringHelpers.findAndGreen(newChange.ticketNumber, this.filterText, true);
            found = bs.bool;

            if (found) {
              newChange.ticketNumber = bs.str;
            }
          }
          if (!found) {
            found = this.filterDescription(newChange);
          }
        } else {
          found = true;
        }

        if (found) {
          changeList.changes.push(newChange);
        }
      }
    });

    return changeList;
  }

  refilter() {
    if (this.action === 'mod') {
      this.changeList.changes.forEach(change => {
        if (change.id === this.id) {
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
              change.descriptions = descriptions;
            }
          });
          this.filterDescription(change);
        }
      });
    } else if (this.action === 'read') {


      this.changeList.changes.forEach(change => {
        if (change.id === this.oldId) {
          this.filterDescription(change);
        }
      });


    }

  }

  filterDescription(change: ChangeLogItem): boolean {
    let found = false;
    if (this.filterText) {
      change.descriptions.forEach(description => {
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

          this.actualService.oriChangeList = changeList;

          this.changeList = this.filter(this.actualService.oriChangeList);
          this.loading = false;
        },
          (error) => {
            console.log('getChanges', error);
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
    this.changeList = this.filter(this.actualService.oriChangeList);
  }

  public selectedImportancesChange(event: string[], importance) {
    console.log('selectedImportancesChange', event, importance);
    if (event) {
      this.selectedImportances.push(importance.value);
    } else {
      this.selectedImportances.splice(this.selectedImportances.indexOf(importance.value, 0), 1);
    }
    this.changeList = this.filter(this.actualService.oriChangeList);
  }

  public selectedLangsChange(event: string[], lang) {
    console.log('selectedLangsChange', event, lang);
    if (event) {
      this.selectedLangs.push(lang.value);
    } else {
      this.selectedLangs.splice(this.selectedLangs.indexOf(lang.value, 0), 1);
    }
    this.changeList = this.filter(this.actualService.oriChangeList);
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
    console.log('this.changeList.releaseDate', this.changeList.releaseDate);
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

  public goCompactView(e: Event) {
    this.actualService.actualChangeList = this.changeList;
    this.router.navigate(['/compact', this.programId, this.versionNumber],
      {
        queryParams: {
          lang: this.getActualLang(),
          filter: this.filterText
        }
      });
  }
}


