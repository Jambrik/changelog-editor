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
import { TranslateService } from '../services/translate.service';
import { I18n } from '../models/I18N';
import * as _ from 'lodash';

@Component({
  selector: 'app-change-log-item',
  templateUrl: './change-log-item.component.html',
  styleUrls: ['./change-log-item.component.scss']
})
export class ChangeLogItemComponent implements OnInit, OnChanges {

  @Input("item") changeLogItem: IChangeLogItem;
  @Input() action: "read" | "mod" | "new";
  @Input() modId: string;
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

  public types: ILabelValue[] = [
    { label: "BUGFIX", value: "bugfix" },
    { label: "FEATURE", value: "feature" }
  ];

  public selectedType: any;
  constructor(
    private navbarService: NavbarService,
    private changeLogService: ChangeLogService,
    private router: Router,
    private messageService: MessageService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.action.currentValue != changes.action.previousValue){
      if((changes.action.currentValue == "mod") &&(this.modId == this.changeLogItem.id)) {
        this.changeLogItemOri = _.cloneDeep(this.changeLogItem);
        console.log("this.changeLogItemOri", this.changeLogItemOri);
      }
    }

  }
  public isEditing(): boolean {
    return ((this.action == "mod") && (this.modId == this.changeLogItem.id)) || ((this.action == "new") && (this.changeLogItem.id == null));

  }

  public canBeModified(): boolean {
    return this.action == 'read';
  }

  public clickMod() {
    this.action = "mod";
  }

  public get program(): IProgram {
    return this.navbarService.actualProgram;
  }

  public get version(): string {
    return this.navbarService.actualVersion;
  }

  public save(event: Event) {
    event.preventDefault();
    this.changeLogService.changeLogWrite(this.program.id, this.version, this.changeLogItem)
      .subscribe((x) => {
        if (this.changeLogItem.id == null) {
          this.onDeleteOrAddingNew.emit();
        }
        this.router.navigate(["/change-list", this.program.id, this.version, 'read', 'none']);
      },
      (error) => {
        this.msgs.push({ severity: 'error', summary: 'Hiba', detail: error.error });
      });
  }
  public cancelMod(event: Event) {
    event.preventDefault();
    console.log("before _.clone(this.changeLogItemOri);", this.changeLogItemOri);
    this.changeLogItem = _.cloneDeep(this.changeLogItemOri);
    this.router.navigate(["/change-list", this.program.id, this.version, 'read', 'none']);    
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
    this.changeLogService.changeLogDelete(this.program.id, this.version, this.changeLogItem.id)
      .subscribe((x) => {
        console.log("delete done", x);
        this.onDeleteOrAddingNew.emit();
      },
      (error) => {
        this.msgs.push({ severity: 'error', summary: 'Hiba', detail: error.error });
      });
  }

  public translate(event: Event) {
    event.preventDefault();
    let d = this.getDescriptionByLang(this.selectedFrom);    
    if(d != null){
      this.selectedTos.forEach(to => {
        if(to != this.selectedFrom) {
          this.translateService.translate(d.text, this.selectedFrom, to)
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

  private getDescriptionByLang(lang: string): I18n{
    console.log("lang", lang);
    console.log("this.changeLogItem.descriptions", this.changeLogItem.descriptions);
    let selectedDescription: I18n = null;
    this.changeLogItem.descriptions.forEach(description => {
      if(description.lang == lang){
        console.log("getDescriptionByLang in if");
        selectedDescription = description;
      }
    });    

    return selectedDescription;
  }

  public showTranslatePanel() {    
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

}
