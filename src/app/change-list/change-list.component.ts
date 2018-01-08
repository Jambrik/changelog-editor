import { I18n } from '../models/I18N';
import { StringHelpers } from '../helpers/string-helpers';
import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChangeLogService } from '../services/change-log.service';
import { IChaneLogList } from '../models/IChangeLogList';
import { NavbarService } from '../services/navbar.service';
import { ConfigService } from '../services/config.service';
import { IProgram } from '../models/IProgram';
import { ConfigHelper } from '../helpers/config-helper';
import { IChangeLogItem } from '../models/IChangeLogItem';
import { TranslateService } from '@ngx-translate/core';
import { ILabelValue } from '../models/ILableValue';
import * as _ from 'lodash';
import { Constants } from '../constants/constants';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-change-list',
  templateUrl: './change-list.component.html',
  styleUrls: ['./change-list.component.scss']
})
export class ChangeListComponent implements OnInit, OnChanges {
  public programId: number;
  public program: IProgram;
  public version: string;
  public changeList: IChaneLogList;
  public oriChangeList: IChaneLogList;
  public action: "read" | "mod" | "new";
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

  constructor(
    private route: ActivatedRoute,
    private changeLogService: ChangeLogService,
    private navbarService: NavbarService,
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
      let version = params['version'];
      let lang = params["lang"];
      console.log("Lang:", lang);
      let id = params["id"];
      this.action = params["action"];
      this.navbarService.actualAction = this.action;
      if (!this.action) {
        this.action = "read";
      };

      console.log("programId, version, action, id", programId, version, this.action, id);
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

            this.navbarService.actualProgram = this.program;
            console.log("New program id", programId);
            //First of all we have get the versions
            this.changeLogService.getVersionsForProgramId(programId)
              .subscribe((versions) => {
                console.log("here are versions", versions);
                versions.sort(StringHelpers.sortDesc);
                this.navbarService.actualVersions = versions;
                //If version is the latest we have to find that
                if ((version == "last") && (versions.length > 0)) {
                  this.version = versions[0];
                } else {
                  this.version = version;
                }
                this.getChanges();
                if (this.action == "new") {
                  this.newItemCreate();
                }
              });
          });
      } else if (version != this.version) {
        this.version = version;
        this.getChanges();
        if (this.action == "new") {
          this.newItemCreate();
        }
      } else {
        if (this.action == "new") {
          this.newItemCreate();
        }
      }
      this.navbarService.actualVersion = version;

    });

    this.route.queryParams.subscribe((queryParams) => {
      this.loadImportance();
      this.loadTypes();
      this.filterText = queryParams["filter"];
      if (this.oriChangeList) {
        this.changeList = this.filter(this.oriChangeList);
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {


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

  private filter(inputChangeList: IChaneLogList): IChaneLogList {
    let changeList = {
      releaseDate: inputChangeList.releaseDate,
      version: inputChangeList.version,
      changes: []
    };

    inputChangeList.changes.forEach(change => {      
      console.log("change.importance", change.importance);
      if ((this.selectedTypes.indexOf(change.type) > -1) && ((!change.importance && (this.selectedImportances.indexOf(Constants.NORMAL)>-1)) || (this.selectedImportances.indexOf(change.importance) > -1))) {        
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
    this.loading = true;
    if (this.changeList) {
      this.changeList.changes = [];
    }
    this.changeLogService.getChangeLogs(this.programId, this.version)
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
      });

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
      category: null,
      subCategory: null,
      ticketNumber: null,
      date: new Date(),
      keywords: [],
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

}


