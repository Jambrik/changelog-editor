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
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-compact',
  templateUrl: './compact.component.html',
  styleUrls: ['./compact.component.scss']
})
  export class CompactComponent implements OnInit, OnChanges {
  
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
    private route: ActivatedRoute,
    private configService: ConfigService,
    private datePipe: DatePipe
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
        const versionNumber = params['version'];  
        const programIdInt = parseInt(programId, 10);
        this.programId = programIdInt;
        this.actualService.actualAction = "read";
        
        
   
           this.configService.getConfig()
              .subscribe((config) => {
                this.actualService.actualProgram = ConfigHelper.getProgramById(config.programs, this.programId);          
              });
        
       
        

        this.changeLogService.getVersionsForProgramId(programId)
        .subscribe((versions) => {
          versions.sort(ConfigHelper.versionSorter);
          this.actualService.actualVersions = versions;       
            
                    
          if ((versionNumber == "last") && (versions.length > 0)) {
            this.version = versions[0];
          } else {
            this.version = ConfigHelper.getVersion(versions, versionNumber);
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
                  if (a.date > b.date)
                    return -1;
                  else if (a.date < b.date)
                    return 1;
                  else
                    return 0;
                });
      
                      
                this.actualService.actualChangeList = changeList;
                this.buildCompactChangesText(null);
              },

              
                (error) => {
                  console.log("getChanges", error);
                  this.msgs.push({ severity: 'error', summary: 'Hiba', detail: error.error });
                
                });
          
        });       
      });

  }

  ngOnChanges(changes: SimpleChanges): void {
   
  }

  private buildCompactChangesText(event: string) : void {
    let lang = this.translateService.currentLang;
    let text = "";
    let szoveg = "";
    let elso_date = "";
    let utolso_date = "";

    for(let item of this.actualService.actualChangeList.changes) {
      for(let description of item.descriptions) {
        if(description.lang == lang) {

          if (item.crd == undefined)
          {
            item.crd=new Date('1990-01-01T00:00:00');
          };

        elso_date=this.datePipe.transform(item.crd, 'yyyy.MM.dd');

        if (this.startDate == null) 
        {
           this.startDate = new Date('1990-01-01T00:00:00');
        }
  
        if (this.vegeDate == null) 
        {
           this.vegeDate = new Date('2990-12-31T00:00:00');
        }
        
        if  ((new Date(item.crd) >= new Date(this.startDate)) && (new Date(item.crd) <= new Date(this.vegeDate)))   {

        this.types = []; 
            this.translateService.get([item.type, item.type])
              .subscribe((t) => {
                if (t.bugfix) {
                  szoveg =t.bugfix ;
                }
        
                if (t.feature) {
                  szoveg =t.feature ;
                }
        
              });

           if(elso_date==utolso_date)  { 
           text =text + item.ticketNumber + ' (' + szoveg + ')' + "\n" + description.text + "\n" + "\r"  ;
           }
           else{
            text =text + '----------- ' + this.datePipe.transform(item.crd, 'yyyy.MM.dd') + ' -----------' +  "\r" + item.ticketNumber + ' (' + szoveg + ')' + "\n" + description.text + "\n" + "\r"  ;
           }

           utolso_date=this.datePipe.transform(item.crd, 'yyyy.MM.dd');
            }
          }
     }
    }
    this.text = text.replace(/<[^>]*>/g,'');
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
 

  private copyMessage(val: string){  
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

  }