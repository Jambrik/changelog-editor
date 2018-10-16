import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ConfigService } from '../services/config.service';
import * as _ from 'lodash';
import { Program } from '../models/Program';
import { I18n } from '../models/I18N';
import { StringHelpers } from '../helpers/string-helpers';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ChangeLogService } from '../services/change-log.service';
import { IVersionChangeLog } from '../models/IVersionChangeLog';
import { ActualService } from '../services/actual.service';
import { IProgram } from '../models/IProgram';
import { ConfigHelper } from '../helpers/config-helper';
import { IChangeLogItem } from '../models/IChangeLogItem';
import { TranslateService } from '@ngx-translate/core';
import { ILabelValue } from '../models/ILableValue';
import { Constants } from '../constants/constants';
import { Subscription } from 'rxjs/Subscription';
import { Message } from 'primeng/components/common/message';
import { IVersionMetaData } from '../models/IVersionMetaData';
import { ChangeLogAction } from '../types/types';
import { TagInfo } from '../models/TagInfo';
import { Tag } from '../models/Tag';
import { ITag } from '../models/ITag';
import { GoogleTranslateService } from '../services/google-translate.service';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';


@Component({
  selector: 'app-compact',
  templateUrl: './compact.component.html',
  styleUrls: ['./compact.component.scss']
})
  export class CompactComponent implements OnInit, OnChanges {
  
  @Input() modId: string;
  @Input("item") changeLogItem: IChangeLogItem;
  @Input() action: ChangeLogAction;
  @Input() selectedLangs: string[];
  @Output() onDeleteOrAddingNew: EventEmitter<void> = new EventEmitter();
  public text: string ;
  isEditor: boolean = true;
  public programId: number;
  public changeList: IVersionChangeLog;
  public version: IVersionMetaData = { version: "" };
  public id: string;
  public oldId: string;
  public newChangeItem: IChangeLogItem;
  public langs: ILabelValue[] = [];
  public filterText: string = "";
  public loading: boolean = false;
  public types: ILabelValue[] = [];
  public selectedTypes: string[] = [];
  public importances: ILabelValue[] = [];
  public selectedImportances: string[] = [];
  private typesSubscribe: Subscription;;
  private importanceSubscribe: Subscription;
  public compactTags: Tag[];
  public startDate: Date ;
  public vegeDate: Date ;
  descriptions: I18n[] = [];
  msgs: Message[] = [];
  private noVersionYetCaption: string;
  public showReleasedVersionWarning: boolean = false;
  changeLogItemOri: IChangeLogItem;


  constructor(
    private actualService: ActualService,
    private changeLogService: ChangeLogService,
    private router: Router,
    private googleTranslateService: GoogleTranslateService,
    private translateService: TranslateService,
    private route: ActivatedRoute
  ) { }
   
  ngOnInit() {

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
    
      this.route.params.subscribe(params => {
        const programId = params['program-id'];        
        console.log('program-id', programId);
        const programIdInt = parseInt(programId, 10);
        this.programId = programIdInt;
        let lang = this.translateService.currentLang;
        let text = "";
        let szoveg = "";

        for(let item of this.actualService.actualChangeList.changes) {
          for(let description of item.descriptions) {
            if(description.lang == lang)

            this.types = []; 
                this.translateService.get([item.type, item.type])
                  .subscribe((t) => {
                    if (t.bugfix) {
                      szoveg =t.bugfix ;
                    }
            
                    if (t.feature) {
                      szoveg =t.feature ;
                    }
            
                    console.log(szoveg); 
                  });
           
               text =text + item.ticketNumber + ' (' + szoveg + ')' + "\n" + description.text + "\n" + "\r"  ;
          }
        }

         this.text = text.replace(/<[^>]*>/g,'');
      });

  }
  

  public getLastVersion(program: IProgram): string {
    if (program.versions && (program.versions.length > 0)) {
      program.versions.sort(ConfigHelper.versionSorter);
      return program.versions[0].version;
    }
    else {
      return "none";
    }

  }


  public get program(): IProgram {
    return this.actualService.actualProgram;
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


  private createCompactTags() {
    let compactTags: Tag[] = [];
    for (let tagInfo of this.actualService.actualTagInfos) {
      let compactTag: Tag;
      if (this.changeLogItem.tags) {
        for (let tag of this.changeLogItem.tags) {
          if (tag.code == tagInfo.code) {
            compactTag = new Tag(tagInfo, tag.values, tag.value);
          }
        }
      }
      if (!compactTag) {
        let value: number | boolean | string;
        if (!tagInfo.moreOptionsAllowed) {
          if (tagInfo.dataType == "boolean") {
            if (tagInfo.mandatory) {
              value = false;
            }
          } else if (tagInfo.dataType == "string") {
            if (tagInfo.mandatory) {
              value = "";
            }
          } else if (tagInfo.dataType == "number") {
            if (tagInfo.mandatory) {
              //  value = 0;
            }
          }
        }

        compactTag = new Tag(tagInfo, [], value);
      }
      compactTags.push(compactTag);
    }

    this.compactTags = compactTags;
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.action && (changes.action.currentValue != changes.action.previousValue)) {
      if ((changes.action.currentValue == "mod") && (this.modId == this.changeLogItem.id)) {
        this.changeLogItemOri = _.cloneDeep(this.changeLogItem);
      }
      this.descriptions = this.getDescriptions();
    }

    if (changes.selectedLangs && (changes.selectedLangs.currentValue != changes.selectedLangs.previousValue)) {
      this.descriptions = this.getDescriptions();
    }

    if (changes.changeLogItem && (changes.changeLogItem.currentValue != changes.changeLogItem.previousValue)) {
      this.createCompactTags();
    }

  }

  

  copyMessage(val: string){  
    console.log('copy');
    let selBox = document.createElement('textarea');
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

  public selectedTypesChange(event: string) {
    this.selectedTypes = [Constants.BUGFIX, Constants.FEATURE];

    this.route.params.subscribe(params => {
      const programId = params['program-id'];        
      const programIdInt = parseInt(programId, 10);
      this.programId = programIdInt;
      let lang = this.translateService.currentLang;
      let text = "";
      this.text = "";
      let szoveg : string;

      if (this.startDate == null) 
      {
         this.startDate = new Date('1990.01.01');
      }

      if (this.vegeDate == null) 
      {
         this.vegeDate = new Date('2990.01.01');
      }


      for(let item of this.actualService.actualChangeList.changes) {
        for(let description of item.descriptions) {
          if (description.lang == lang)
          
           if ( (new Date(item.crd) >= new Date(this.startDate)) && (new Date(item.crd) <= new Date(this.vegeDate)) )  {

                this.types = []; //type átalakítás
                this.translateService.get([item.type, item.type])
                  .subscribe((t) => {
                    if (t.bugfix) {
                      szoveg =t.bugfix ;
                    }
            
                    if (t.feature) {
                      szoveg =t.feature ;
                    }

                  });

           text =text + item.ticketNumber + ' (' + szoveg + ')' + "\n" + description.text + "\n" + "\r"  ;
            }
        }
      }

      this.text = text.replace(/<[^>]*>/g,'');
    })
    
  }

    public isNewEditing(): boolean {
      return (this.action == "new") && (this.newChangeItem != undefined);
    }
  }