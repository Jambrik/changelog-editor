import { I18n } from '../models/I18N';
import { StringHelpers } from '../helpers/string-helpers';
import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnChanges, OnInit, SimpleChanges, transition } from '@angular/core';
import { ChangeLogService } from '../services/change-log.service';
import { IVersionChangeLog } from '../models/IVersionChangeLog';
import { ActualService } from '../services/actual.service';
import { ConfigService } from '../services/config.service';
import { IProgram } from '../models/IProgram';
import { ConfigHelper } from '../helpers/config-helper';
import { IChangeLogItem } from '../models/IChangeLogItem';
import { TranslateService } from '@ngx-translate/core';
import { ILabelValue } from '../models/ILableValue';
import * as _ from 'lodash';
import { Constants } from '../constants/constants';
import { Subscription } from 'rxjs/Subscription';
import { Message } from 'primeng/components/common/message';
import { IVersionMetaData } from '../models/IVersionMetaData';
import { ChangeLogAction } from '../types/types';


@Component({
  selector: 'app-change-list',
  templateUrl: './change-list.component.html',
  styleUrls: ['./change-list.component.scss']
})
export class ChangeListComponent implements OnInit, OnChanges {
  public programId: number;
  public program: IProgram;
  public version: IVersionMetaData = {version: ""};
  public changeList: IVersionChangeLog;
  public oriChangeList: IVersionChangeLog;
  public action: ChangeLogAction;
  public id: string;
  public newChangeItem: IChangeLogItem;
  public langs: ILabelValue[] = [];
  public selectedLangs: string[] = [];
  public filterText: string = "";
  public loading: boolean = false;
  public types: ILabelValue[] = [];
  public selectedTypes: string[] = [];
  public importances: ILabelValue[] = [];
  public selectedImportances: string[] = [];
  private typesSubscribe: Subscription;;
  private importanceSubscribe: Subscription;
  msgs: Message[] = [];
  private noVersionYetCaption: string;
  public showReleasedVersionWarning: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private changeLogService: ChangeLogService,
    private actualService: ActualService,
    private configService: ConfigService,
    private translateService: TranslateService) { }

  ngOnInit() {

    this.selectedTypes = [Constants.BUGFIX, Constants.FEATURE];
    this.selectedImportances = [Constants.LOW, Constants.NORMAL, Constants.HIGH];
    console.log("CurrentLang", this.translateService.currentLang);
    this.loadTypes();
    this.loadImportance();
    console.log("change-list init");
    //Because we load always the same component, the init run only once. So we subscribe the router params changes:
    this.route.params.subscribe(params => {
      let programId = params['program-id'];
      let versionNumber: string = params['version'];
      let lang = params["lang"];
      console.log("Lang:", lang);
      let id = params["id"];
      this.action = params["action"];
      this.actualService.actualAction = this.action;
      if (!this.action) {
        this.action = "read";
      };

      console.log("programId, version, action, id", programId, versionNumber, this.action, id);
      let programIdInt = parseInt(programId);
      if (id == "null") {
        this.id = null;
      } else {
        this.id = id;
      }

      console.log("id", id);
      console.log("this.id", this.id);
      if (this.programId != programIdInt) {
        this.configService.getConfig()
          .subscribe((config) => {
            this.programId = programIdInt;
            this.program = ConfigHelper.getProgramById(config.programs, this.programId);
            this.langs = [];
            this.selectedLangs = [];
            this.program.langs.forEach(lang => {
              this.langs.push({
                label: lang,
                value: lang
              });
              this.selectedLangs.push(lang);
            });

            this.actualService.actualProgram = this.program;
            console.log("New program id", programId);
            //First of all we have get the versions
            this.changeLogService.getVersionsForProgramId(programId)
              .subscribe((versions) => {
                console.log("here are versions", versions);
                versions.sort(ConfigHelper.versionSorter);
                this.actualService.actualVersions = versions;
                //If version is the latest we have to find that
                if ((versionNumber == "last") && (versions.length > 0)) {
                  this.version = versions[0];
                } else {
                  this.version = ConfigHelper.getVersion(versions,versionNumber);
                }
                this.actualService.actualVersion = this.version;
                this.getChanges();
                if (this.action == "new") {
                  this.newItemCreate();
                }
              });
          });
      } else if (versionNumber != this.version.version) {
        this.version = ConfigHelper.getVersion(this.actualService.actualVersions, versionNumber);
        this.actualService.actualVersion = this.version;
        this.getChanges();
        if (this.action == "new") {
          this.newItemCreate();
        }
      } else {
        if (this.action == "new") {
          this.newItemCreate();
        }
      }      

    });

    this.route.queryParams.subscribe((queryParams) => {
      this.loadImportance();
      this.loadTypes();
      this.loadCaptionTranslations();
      this.filterText = queryParams["filter"];
      if (this.oriChangeList) {
        this.changeList = this.filter(this.oriChangeList);
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {


  }

  private loadCaptionTranslations() {
    setTimeout(() => {    
      this.translateService.get("NO_VERSION_YET")
        .subscribe((translation) => {
          this.noVersionYetCaption = translation;
        })
    }, 100);
  }

  private loadTypes() {
    console.log("in load types");
    setTimeout(() => {
      this.types = [];

      this.typesSubscribe = this.translateService.get([Constants.BUGFIX, Constants.FEATURE])
        .subscribe((t) => {
          console.log("in load types subscribe");
          if (t.bugfix) {
            this.types.push({ value: Constants.BUGFIX, label: t.bugfix })
          }

          if (t.feature) {
            this.types.push({ value: Constants.FEATURE, label: t.feature })
          }
          console.log("types", this.types);
        });
    }, 100);


  }
  private loadImportance() {
    setTimeout(() => {
      this.importances = [];

      this.importanceSubscribe = this.translateService.get([Constants.LOW, Constants.NORMAL, Constants.HIGH])
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

  private filter(inputChangeList: IVersionChangeLog): IVersionChangeLog {
    let changeList = {
      releaseDate: inputChangeList.releaseDate,
      version: inputChangeList.version,
      changes: []
    };

    inputChangeList.changes.forEach(change => {
      console.log("change.importance", change.importance);
      if ((this.selectedTypes.indexOf(change.type) > -1) && ((!change.importance && (this.selectedImportances.indexOf(Constants.NORMAL) > -1)) || (this.selectedImportances.indexOf(change.importance) > -1))) {
        let found = false;
        let newChange: IChangeLogItem = _.cloneDeep(change);
        if (!newChange.importance || (newChange.importance == null)) {
          newChange.importance = "normal";
        }
        if ((this.filterText) && (this.filterText != null) && (this.filterText != "")) {
          if (newChange.ticketNumber && (newChange.ticketNumber != null) && (newChange.ticketNumber != "")) {
            let bs = StringHelpers.findAndGreen(newChange.ticketNumber, this.filterText);
            found = bs.bool;

            if (found) {
              newChange.ticketNumber = bs.str;
            }
          }
          if (!found) {
            newChange.descriptions.forEach(description => {
              if (!found) {
                let bs = StringHelpers.findAndGreen(description.text, this.filterText);
                found = bs.bool;
                if (found) {
                  description.text = bs.str;
                }
              }
            });
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

  private getChanges() {
    if (this.version.version != "none") {
      this.loading = true;
      if (this.changeList) {
        this.changeList.changes = [];
      }
      this.changeLogService.getChangeLogs(this.programId, this.version.version)
        .subscribe(changeList => {

          changeList.changes.forEach(change => {
            change.date = new Date(change.date);
          });
          changeList.changes.sort((a, b) => {
            if (a.date > b.date)
              return -1;
            else if (a.date < b.date)
              return 1;
            else
              return 0;
          });

          this.oriChangeList = changeList;

          this.changeList = this.filter(this.oriChangeList);
          this.loading = false;
        },
        (error) => {
          console.log("getChanges", error);
          this.msgs.push({ severity: 'error', summary: 'Hiba', detail: error.error });
          this.loading = false;
        });
    } else {
        this.oriChangeList = {
          releaseDate: null,
          version: null,
          changes: []
        };
        this.changeList = _.cloneDeep(this.oriChangeList);
      
    }

  }


  public isNewEditing(): boolean {
    return (this.action == "new") && (this.newChangeItem != undefined);
  }

  public isReading(): boolean {
    return (this.action == "read");
  }

  private getNewDescriptions(): I18n[] {
    let resultList: I18n[] = [];
    this.program.langs.forEach(lang => {
      resultList.push({
        lang: lang,
        text: ""
      })
    });
    return resultList;
  }

  private newItemCreate() {
    this.newChangeItem = {
      id: null,
      type: "feature",
      importance: "normal",            
      ticketNumber: null,
      date: new Date(),      
      descriptions: this.getNewDescriptions(),
      cru: null,
      crd: null,
      lmu: null,
      lmd: null
    };
  }

  public getActualLang(): string {
    return this.translateService.currentLang;
  }


  public selectedTypesChange(event: string[]) {
    console.log("selectedTypesChange", event);
    this.selectedTypes = event;
    this.changeList = this.filter(this.oriChangeList);
  }

  public selectedImportancesChange(event: string[]) {
    console.log("selectedImportancesChange", event);
    this.selectedImportances = event;
    this.changeList = this.filter(this.oriChangeList);
  }

  public printVersion(){    
    if(this.version && (this.version != null) && (this.version.version != "none")){
      return this.version.version;
    } else {
      return this.noVersionYetCaption;
    }
  }

  public get versionNumber() {
    if(this.version && (this.version != null)){
      return this.version.version;
    } else {
      return "";
    }

  }


  public saveReleaseDate(event: Event) {
    event.preventDefault();
    this.changeLogService.changeLogRelease(this.program.id, this.version.version, this.changeList.releaseDate)
      .subscribe((x) => {
        this.getChanges();
      },
      (error) => {
        this.msgs.push({ severity: 'error', summary: 'Hiba', detail: error.error });
      });
  }

  public inssertModReleaseChangeLogOk(event: Event) {
    event.preventDefault();
    this.changeLogService.changeLogRelease(this.program.id, this.version.version, this.changeList.releaseDate)
      .subscribe((x) => {
        this.getChanges();
      },
      (error) => {
        this.msgs.push({ severity: 'error', summary: 'Hiba', detail: error.error });
      });
  }  

  public inssertModReleaseChangeLogCancel(event: Event) {
    event.preventDefault();
    this.changeLogService.changeLogRelease(this.program.id, this.version.version, this.changeList.releaseDate)
      .subscribe((x) => {
        this.getChanges();
      },
      (error) => {
        this.msgs.push({ severity: 'error', summary: 'Hiba', detail: error.error });
      });
  }  
}


