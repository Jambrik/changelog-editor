import { Router } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { IChangeLogItem } from '../models/IChangeLogItem';
import { NavbarService } from '../services/navbar.service';
import { IProgram } from '../models/IProgram';
import { ChangeLogService } from '../services/change-log.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { Message } from 'primeng/components/common/api';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { ILabelValue } from '../models/ILableValue';
import { GoogleTranslateService } from '../services/google-translate.service';
import { I18n } from '../models/I18N';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { Constants } from '../constants/constants';
import { User } from '../models/IUser';
import { IVersionMetaData } from '../models/IVersionMetaData';

@Component({
  selector: 'app-change-log-item',
  templateUrl: './change-log-item.component.html',
  styleUrls: ['./change-log-item.component.scss']
})
export class ChangeLogItemComponent implements OnInit, OnChanges {

  @Input("item") changeLogItem: IChangeLogItem;
  @Input() action: "read" | "mod" | "new";
  @Input() modId: string;
  @Input() selectedLangs: string[];
  @Output() onDeleteOrAddingNew: EventEmitter<void> = new EventEmitter();
  msgs: Message[] = [];
  deleteMessageShown: boolean = false;
  isEditor: boolean = true;
  translatePanelShown: boolean = false;
  froms: ILabelValue[] = [];
  tos: ILabelValue[] = [];
  selectedFrom: string;
  selectedTos: string[] = [];
  changeLogItemOri: IChangeLogItem;
  descriptions: I18n[] = [];
  public types: ILabelValue[];

  public importances: ILabelValue[];
  public showReleasedVersionWarning: boolean = false;


  public selectedType: any;
  constructor(
    private navbarService: NavbarService,
    private changeLogService: ChangeLogService,
    private router: Router,
    private googleTranslateService: GoogleTranslateService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    console.log("ngOnInit");
    this.types = [];
    this.translateService.get([Constants.BUGFIX, Constants.FEATURE])
      .subscribe((t) => {
        if (t.bugfix) {
          this.types.push({ value: Constants.BUGFIX, label: t.bugfix })
        }

        if (t.feature) {
          this.types.push({ value: Constants.FEATURE, label: t.feature })
        }

      });

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
      if(this.action == "new"){
        if(this.version.releaseDate && (this.version.releaseDate != null)){
          this.showReleasedVersionWarning = true;
        }
      }

  }

  ngOnChanges(changes: SimpleChanges): void {    
    if (changes.action && (changes.action.currentValue != changes.action.previousValue)) {
      if ((changes.action.currentValue == "mod") && (this.modId == this.changeLogItem.id)) {
        console.log("ngOnChanges");
        this.changeLogItemOri = _.cloneDeep(this.changeLogItem);
      } else {

      }
    }

    if (changes.selectedLangs && (changes.selectedLangs.currentValue != changes.selectedLangs.previousValue)) {
      this.descriptions = this.getDescriptions();
    }

  }
  public isEditing(): boolean {
    return ((this.action == "mod") && (this.modId == this.changeLogItem.id)) || ((this.action == "new") && (this.changeLogItem.id == null));

  }

  public canBeModified(): boolean {
    return this.action == 'read';
  }

  public clickMod(event: Event) {
    event.preventDefault();
    if (this.version.releaseDate && (this.version.releaseDate != null)) {
      this.showReleasedVersionWarning = true;
    } else {
      this.goEdit();      
    }

  }

  public goEdit(){
    this.router.navigate(["/change-list", this.program.id, this.version.version, 'mod', this.changeLogItem.id], { queryParams: { lang: this.getActualLang() } });
  }

  public get program(): IProgram {
    return this.navbarService.actualProgram;
  }

  public get version(): IVersionMetaData {
    return this.navbarService.actualVersion;
  }

  public save(event: Event) {
    event.preventDefault();
    let user: User;
    user = this.navbarService.actualUser;
    if (this.changeLogItem.id == null) {
      if (user) {
        this.changeLogItem.cru = user.code;
      } else {
        this.changeLogItem.cru = "ANONYMOUS";
      }
      this.changeLogItem.crd = new Date();
    } else {
      if (user) {
        this.changeLogItem.lmu = user.code;
      } else {
        this.changeLogItem.lmu = "ANONYMOUS";
      }
      this.changeLogItem.lmd = new Date();
    }
    this.changeLogService.changeLogWrite(this.program.id, this.version.version, this.changeLogItem)
      .subscribe((x) => {
        if (this.changeLogItem.id == null) {
          this.onDeleteOrAddingNew.emit();
        }
        this.router.navigate(["/change-list", this.program.id, this.version.version, 'read', 'none'], { queryParams: { lang: this.getActualLang() } });
      },
      (error) => {
        this.msgs.push({ severity: 'error', summary: 'Hiba', detail: error.error });
      });
  }
  public cancelMod(event: Event) {
    event.preventDefault();
    console.log("before _.clone(this.changeLogItemOri);", this.changeLogItemOri);
    this.changeLogItem = _.cloneDeep(this.changeLogItemOri);
    if (this.action == "mod") {
      this.descriptions = this.getDescriptions();
    }
    console.log("after _.clone(this.changeLogItemOri);", this.changeLogItem);
    this.goToBack();
  }

  public goToBack(){
    this.router.navigate(["/change-list", this.program.id, this.version.version, 'read', 'none'], { queryParams: { lang: this.getActualLang() } });
}

  public deleteMessageShow(event: Event) {
    event.preventDefault();
    this.deleteMessageShown = true;
  }

  public cancelDelete(event: Event) {
    event.preventDefault();
    this.deleteMessageShown = false;
  }
  public cancelTranslate(event: Event) {
    event.preventDefault();
    this.translatePanelShown = false;
  }

  public delete(event: Event) {
    event.preventDefault();
    this.changeLogService.changeLogDelete(this.program.id, this.version.version, this.changeLogItem.id)
      .subscribe((x) => {
        this.onDeleteOrAddingNew.emit();
      },
      (error) => {
        this.msgs.push({ severity: 'error', summary: 'Hiba', detail: error.error });
      });
  }

  public translate(event: Event) {
    event.preventDefault();
    let d = this.getDescriptionByLang(this.selectedFrom);
    if (d != null) {
      this.selectedTos.forEach(to => {
        if (to != this.selectedFrom) {
          this.googleTranslateService.translate(d.text, this.selectedFrom, to)
            .subscribe((translateData) => {
              d = this.getDescriptionByLang(to);
              d.text = translateData.translate;
              this.translatePanelShown = false;
            },
            (error) => {
              this.msgs.push({ severity: 'error', summary: 'Hiba', detail: error.error });
            });
        }
      });
    }
  }

  private getDescriptionByLang(lang: string): I18n {
    let selectedDescription: I18n = null;
    this.changeLogItem.descriptions.forEach(description => {
      if (description.lang == lang) {
        selectedDescription = description;
      }
    });

    return selectedDescription;
  }

  public showTranslatePanel(event: Event) {
    event.preventDefault();
    this.translatePanelShown = true;
    this.fillFromsAndTos();
  }

  private fillFromsAndTos() {

    setTimeout(() => {
      this.froms = [];
      this.tos = [];
      this.selectedTos = [];
      let selectedFrom;
      let i: number = 0;
      this.program.langs.forEach(lang => {
        this.froms.push({
          label: lang,
          value: lang
        });
        if (i == 0) {
          selectedFrom = lang;
        }
        this.tos.push({
          label: lang,
          value: lang
        });
        if (i == 1) {
          this.selectedTos.push(lang);
        }
        i++;
      });
      this.selectedFrom = selectedFrom;
    }, 100);

  }

  public isMoreThenOneLang(): boolean {
    return this.program && this.program.langs && (this.program.langs.length > 1);
  }

  public getActualLang(): string {
    return this.translateService.currentLang;
  }

  public getDescriptions() {
    let descriptions: I18n[] = [];
    this.changeLogItem.descriptions.forEach(description => {
      if (this.selectedLangs.indexOf(description.lang) > -1) {
        descriptions.push(description);
      }
    });
    return descriptions;
  }

  public inssertModReleaseChangeLogOk(event: Event) {
    event.preventDefault();
    this.showReleasedVersionWarning = false;
    if(this.action == "mod"){
      this.goEdit();
    }    
  }

  public inssertModReleaseChangeLogCancel(event: Event) {
    event.preventDefault();
    this.showReleasedVersionWarning = false;
    if(this.action == "new"){
      this.goToBack();
    }
      
    
  }
}
