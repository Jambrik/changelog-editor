import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from "@progress/kendo-angular-notification";
import * as _ from 'lodash';
import { Constants } from '../constants/constants';
import { ChangeLogItem } from '../models/ChangeLogItem';
import { I18n } from '../models/I18N';
import { LabelValue } from '../models/LableValue';
import { Program } from '../models/Program';
import { Tag } from '../models/Tag';
import { TagImpl } from '../models/TagImpl';
import { User } from '../models/User';
import { VersionMetaData } from '../models/VersionMetaData';
import { ActualService } from '../services/actual.service';
import { ChangeLogService } from '../services/change-log.service';
import { GoogleTranslateService } from '../services/google-translate.service';
import { ChangeLogAction } from '../types/types';

@Component({
  selector: 'app-change-log-item',
  templateUrl: './change-log-item.component.html',
  styleUrls: ['./change-log-item.component.scss']
})
export class ChangeLogItemComponent implements OnInit, OnChanges {

  @Input() changeLogItem: ChangeLogItem;
  @Input() action: ChangeLogAction;
  @Input() modId: string;
  @Input() selectedLangs: string[];
  @Output() deleteOrAddingNew: EventEmitter<void> = new EventEmitter();
  deleteMessageShown = false;
  isEditor = true;
  translatePanelShown = false;
  froms: LabelValue[] = [];
  tos: LabelValue[] = [];
  selectedFrom: string;
  selectedTos: string[] = [];
  changeLogItemOri: ChangeLogItem;
  descriptions: I18n[] = [];
  public types: LabelValue[];

  public importances: LabelValue[];
  public showReleasedVersionWarning = false;
  public compactTags: TagImpl[];

  constructor(
    private actualService: ActualService,
    private changeLogService: ChangeLogService,
    private router: Router,
    private googleTranslateService: GoogleTranslateService,
    private translateService: TranslateService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.types = [];
    this.translateService.get([Constants.BUGFIX, Constants.FEATURE])
      .subscribe((t) => {
        if (t.bugfix) {
          this.types.push({ value: Constants.BUGFIX, label: t.bugfix });
        }

        if (t.feature) {
          this.types.push({ value: Constants.FEATURE, label: t.feature });
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
    if (this.action === 'new') {
      if (this.version.releaseDate && (this.version.releaseDate != null)) {
        this.showReleasedVersionWarning = true;
      }
    }
  }

  private createCompactTags() {
    const compactTags: TagImpl[] = [];
    for (const tagInfo of this.actualService.actualTagInfos) {
      let compactTag: TagImpl;
      if (this.changeLogItem.tags) {
        for (const tag of this.changeLogItem.tags) {
          if (tag.code === tagInfo.code) {
            compactTag = new TagImpl(tagInfo, tag.values, tag.value);
          }
        }
      }
      if (!compactTag) {
        let value: number | boolean | string;
        if (!tagInfo.moreOptionsAllowed) {
          if (tagInfo.dataType === 'boolean') {
            if (tagInfo.mandatory) {
              value = false;
            }
          } else if (tagInfo.dataType === 'string') {
            if (tagInfo.mandatory) {
              value = '';
            }
          } else if (tagInfo.dataType === 'number') {
            if (tagInfo.mandatory) {
              //  value = 0;
            }
          }
        }

        compactTag = new TagImpl(tagInfo, [], value);
      }
      compactTags.push(compactTag);
    }
    this.compactTags = compactTags;
  }

  private converCompactTagsIntoSimple() {
    const tags: Tag[] = [];
    for (const ctag of this.compactTags) {

      const tag: Tag = {
        code: ctag.code,
        values: ctag.values,
        value: ctag.value
      };
      tags.push(tag);
    }
    this.changeLogItem.tags = tags;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.action && (changes.action.currentValue !== changes.action.previousValue)) {
      if ((changes.action.currentValue === 'mod') && (this.modId === this.changeLogItem.id)) {
        this.changeLogItemOri = _.cloneDeep(this.changeLogItem);
      }
      this.descriptions = this.getDescriptions();
    }

    if (changes.selectedLangs && (changes.selectedLangs.currentValue !== changes.selectedLangs.previousValue)) {
      this.descriptions = this.getDescriptions();
    }

    if (changes.changeLogItem && (changes.changeLogItem.currentValue !== changes.changeLogItem.previousValue)) {
      this.createCompactTags();
    }

  }
  public isEditing(): boolean {
    return ((this.action === 'mod') && (this.modId === this.changeLogItem.id)) ||
      ((this.action === 'new') && (this.changeLogItem.id == null));
  }

  public canBeModified(): boolean {
    return this.action === 'read';
  }

  public clickMod(event: Event) {
    event.preventDefault();
    if (this.version.releaseDate && (this.version.releaseDate != null)) {
      this.showReleasedVersionWarning = true;
    } else {
      this.goEdit();
    }

  }

  public goEdit() {
    console.log('It is go edit. Action: mod');
    this.router.navigate(['/change-list', this.program.id, this.version.version, 'mod', this.changeLogItem.id],
      {
        queryParams:
        {
          lang: this.getActualLang(),
          filter: this.actualService.actualFilter
        }
      });
  }

  public get program(): Program {
    return this.actualService.actualProgram;
  }

  public get version(): VersionMetaData {
    return this.actualService.actualVersion;
  }

  public save(event: Event) {
    event.preventDefault();
    let user: User;
    user = this.actualService.actualUser;
    if (this.changeLogItem.id == null) {
      if (user) {
        this.changeLogItem.cru = user.code;
      } else {
        this.changeLogItem.cru = 'ANONYMOUS';
      }
      this.changeLogItem.crd = new Date();
    } else {
      if (user) {
        this.changeLogItem.lmu = user.code;
      } else {
        this.changeLogItem.lmu = 'ANONYMOUS';
      }
      this.changeLogItem.lmd = new Date();
    }

    // Adding tags:
    this.converCompactTagsIntoSimple();
    if (this.valid()) {
      // Save:
      this.changeLogService.changeLogWrite(this.program.id, this.version.version, this.changeLogItem)
        .subscribe((x) => {
          if (this.changeLogItem.id == null) {
            this.deleteOrAddingNew.emit();
          }
          this.router.navigate(['/change-list', this.program.id, this.version.version, 'read', 'none'],
            {
              queryParams:
              {
                lang: this.getActualLang(),
                filter: this.actualService.actualFilter
              }
            });
        },
          (error) => {
            this.notificationService.show({ type: { style: 'error', icon: true }, content: error.error, closable: true });
          });

    }

  }

  private valid(): boolean {
    // Check mandatory tag is added:
    const actualTagInfos = this.actualService.actualTagInfos;
    let ok = true;
    for (const tagInfo of actualTagInfos) {
      if (tagInfo.mandatory) {
        if (tagInfo.moreOptionsAllowed) {
          ok = false;
          for (const tag of this.changeLogItem.tags) {
            if ((tag.code === tagInfo.code) && (tag.values.length > 0)) {
              ok = true;
            }
          }
        } else {
          ok = false;
          for (const tag of this.changeLogItem.tags) {
            if ((tag.code === tagInfo.code) && (tag.value !== undefined) && (tag.value != null)) {
              ok = true;
            }
          }
        }
        if (!ok) {
          this.translateService.get(Constants.MANDATORY_TAG)
            .subscribe((translation) => {
              this.notificationService.show({ type: { style: 'error', icon: true }, content: translation, closable: true });
            });

          break;
        }
      }
    }
    if (ok) {
      this.msgs.length = 0;
    }
    return ok;
  }
  public cancelMod(event: Event) {
    event.preventDefault();

    if (this.action === 'mod') {
      console.log('before _.clone(this.changeLogItemOri);', this.changeLogItemOri);
      this.changeLogItem.crd = this.changeLogItemOri.crd;
      this.changeLogItem.cru = this.changeLogItemOri.cru;
      this.changeLogItem.date = this.changeLogItemOri.date;
      this.changeLogItem.id = this.changeLogItemOri.id;
      this.changeLogItem.importance = this.changeLogItemOri.importance;
      this.changeLogItem.lmd = this.changeLogItemOri.lmd;
      this.changeLogItem.lmu = this.changeLogItemOri.lmu;
      this.changeLogItem.ticketNumber = this.changeLogItemOri.ticketNumber;
      this.changeLogItem.type = this.changeLogItemOri.type;
      this.changeLogItem.descriptions = _.cloneDeep(this.changeLogItemOri.descriptions);
      this.changeLogItem.tags = _.cloneDeep(this.changeLogItemOri.tags);
      this.descriptions = this.getDescriptions();
    }
    console.log('after _.clone(this.changeLogItemOri);', this.changeLogItem);
    this.goToBack();
  }

  public goToBack() {
    this.router.navigate(['/change-list', this.program.id, this.version.version, 'read', 'none'],
      {
        queryParams: {
          lang: this.getActualLang(),
          filter: this.actualService.actualFilter
        }
      });
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
        this.deleteOrAddingNew.emit();
      },
        (error) => {
          this.notificationService.show({ type: { style: 'error', icon: true }, content: error.error, closable: true });
        });
  }

  public translate(event: Event) {
    event.preventDefault();
    let d = this.getDescriptionByLang(this.selectedFrom);
    if (d != null) {
      this.selectedTos.forEach(to => {
        if (to !== this.selectedFrom) {
          this.googleTranslateService.translate(d.text, this.selectedFrom, to)
            .subscribe((translateData) => {
              d = this.getDescriptionByLang(to);
              d.text = translateData.translate;
              this.translatePanelShown = false;
            },
              (error) => {
                this.notificationService.show({ type: { style: 'error', icon: true }, content: error.error, closable: true });
              });
        }
      });
    }
  }

  private getDescriptionByLang(lang: string): I18n {
    let selectedDescription: I18n = null;
    this.changeLogItem.descriptions.forEach(description => {
      if (description.lang === lang) {
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
      let i = 0;
      this.program.langs.forEach(lang => {
        this.froms.push({
          label: lang,
          value: lang
        });
        if (i === 0) {
          selectedFrom = lang;
        }
        this.tos.push({
          label: lang,
          value: lang
        });
        if (i === 1) {
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
    const descriptions: I18n[] = [];

    this.changeLogItem.descriptions.forEach(description => {
      if (this.selectedLangs.indexOf(description.lang) > -1) {
        descriptions.push(description);
      }
    });
    return descriptions;
  }

  public inssertModReleaseChangeLogOk(event: Event) {
    event.preventDefault();
    console.log('inssertModReleaseChangeLogOk. Action: ', this.action);
    this.showReleasedVersionWarning = false;
    if (this.action === 'read') {
      this.goEdit();
    }
  }

  public inssertModReleaseChangeLogCancel(event: Event) {
    event.preventDefault();
    this.showReleasedVersionWarning = false;
    if (this.action === 'new') {
      this.goToBack();
    }


  }

  public copyMessageUnique(val: string, ticket: string) {

    if (ticket == null) {
      val = val.replace(/<[^>]*>/g, '');
    } else {
      val = ticket + '\n' + val.replace(/<[^>]*>/g, '');
    }

    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

}
