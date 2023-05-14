import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Message } from 'primeng/api';
import { Constants } from '../constants/constants';
import { ConfigHelper } from '../helpers/config-helper';
import { I18n } from '../models/I18N';
import { IChangeLogItem } from '../models/IChangeLogItem';
import { ILabelValue } from '../models/ILableValue';
import { IProgram } from '../models/IProgram';
import { IRendezCompact } from '../models/IRendezCompact';
import { IVersionChangeLog } from '../models/IVersionChangeLog';
import { IVersionMetaData } from '../models/IVersionMetaData';
import { TagImpl } from '../models/TagImpl';
import { TagInfoImpl } from '../models/TagInfo';
import { ITagInfosCheckBox } from '../models/TagInfosCheckBox';
import { ActualService } from '../services/actual.service';
import { ChangeLogService } from '../services/change-log.service';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-compact',
  templateUrl: './compact.component.html',
  styleUrls: ['./compact.component.scss']
})


export class CompactComponent implements OnInit, OnChanges {

  @Input() tagInfosCheckBox: ITagInfosCheckBox;
  public text: string;
  isEditor = true;
  public programId: number;
  public changeList: IVersionChangeLog;
  public version: IVersionMetaData = { version: '' };
  public id: string;
  public oldId: string;
  public newChangeItem: IChangeLogItem;
  public langs: ILabelValue[] = [];
  public filterText = '';
  public loading = false;
  public types: ILabelValue[] = [];
  public selectedTypes: string[] = [];
  public importances: ILabelValue[] = [];
  public selectedImportances: string[] = [];
  public compactTags: TagImpl[];
  public startDate: Date;
  public vegeDate: Date;
  descriptions: I18n[] = [];
  msgs: Message[] = [];
  public showReleasedVersionWarning = false;
  changeLogItemOri: IChangeLogItem;
  public page = false;
  public tech = false;
  public work = false;
  public w = false;
  public alr = false;
  public men = false;
  public elsoRendez: any = false;
  public masodikRendez = false;
  public harmadikRendez = false;
  public negyedikRendez = false;
  public otodikRendez = false;
  public hatodikRendez = false;
  public hetedikRendez = false;
  public pageCode: string;
  public techCode: string;
  public workCode: string;
  public wS: string;
  public alrKod: string;
  public menuKod: string;
  public pageSzoveg: string;
  public techSzoveg: string;
  public workSzoveg: string;
  public wsSzoveg: string;
  public alrSzoveg: string;
  public menuSzoveg: string;
  public iTagInfosCheckBox: ITagInfosCheckBox[];
  public iTagInfosCheckBoxAdd: string[] = [];
  public iRendezCompactMind: IRendezCompact[];
  public iRendezCompactMindValaszt: IRendezCompact[];
  public rendezConst: string[] = ['Dátum', 'Típus', 'Fontosság', 'Jegyszám'];
  public rendezConstproperty: string[] = ['date', 'type', 'importance', 'ticketNumber'];
  public iRendezCompactKihagy: IRendezCompact[];
  public iRendezCompactKiValaszt: IRendezCompact[] = [];
  public sortChanges: IChangeLogItem[];
  public sorba: IRendezCompact[] = [];
  public elsoProperty: any = '';
  public masodikProperty: any = '';
  public harmadikProperty: any = '';
  public negyedikProperty: any = '';
  public otodikProperty: any = '';
  public hatodikProperty: any = '';
  public hetedikProperty: any = '';
  public rendezKivalaszt: ILabelValue[] = [];
  public rendezKihagy: ILabelValue[] = [];
  public rendezKihagyAdd: ILabelValue[] = [];
  public rendezVezerles: any[] = [0];
  public rendezesTorleseAtadas: any[] = [];
  public megNincsPluszSor = true;
  public kiValasztmegmarad: IRendezCompact[] = [];
  public elementNev: string;
  public csokkenNovekvo = false;
  public csokkenNovekvoElso = true;
  public csokkenNovekvoMasodik = true;
  public csokkenNovekvoHarmadik = true;
  public csokkenNovekvoNegyedik = true;
  public csokkenNovekvoOtodik = true;
  public csokkenNovekvoHatodik = true;
  public csokkenNovekvoHetedik = true;
  public tableInfo: IChangeLogItem[];
  public tableElso = '';
  public tableMasodik = '';
  public tableAdatok: any[] = [];
  public tableAdatokRendezes: IRendezCompact[];
  public tableAdatokRendezesNelkul: IRendezCompact[];
  public torlesHozzadasVezerles = 0;



  constructor(
    private actualService: ActualService,
    private changeLogService: ChangeLogService,
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
      this.actualService.actualAction = 'read';



      this.configService.getConfig()
        .subscribe((config) => {
          this.actualService.actualProgram = ConfigHelper.getProgramById(config.programs, this.programId);
          this.taginfosBox();
          this.rendezesOsszes();
        });




      this.changeLogService.getVersionsForProgramId(programId)
        .subscribe((versions) => {
          versions.sort(ConfigHelper.versionSorter);
          this.actualService.actualVersions = versions;


          if ((versionNumber === 'last') && (versions.length > 0)) {
            this.version = versions[0];
          } else {
            this.version = ConfigHelper.getVersion(versions, versionNumber);
          }


          this.changeLogService.getChangeLogs(this.programId, this.version.version)  // itt kell rendezni!!!!!!!!!!
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

              this.actualService.actualChangeList = changeList;
              this.buildCompactChangesText(null);
            },


              (error) => {
                this.msgs.push({ severity: 'error', summary: 'Hiba', detail: error.error });

              });

        });
    });

    this.actualService.actualRendezValaszt = [];
    if (this.actualService.actualRendezValaszt) {
      this.actualService.actualRendezValaszt = [];

      const element = {
        value: 'Dátum',
        gysor: 0,
        id: 0,
        property: 'date',
        rendezes: true
      };

      this.actualService.actualRendezValaszt.push(element);
      this.iRendezCompactKiValaszt.push(element);
    }

  }

  ngOnChanges(changes: SimpleChanges): void {

  }




  private setActualTaginfosAdd() {
    const resultList: TagInfoImpl[] = [];
    const program: IProgram = this.actualService.actualProgram;
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

  public buildCompactChangesText(event: string): void {
    this.taginfosBox();
    this.compactRendezes(); // rendezés
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

                  console.log('code.values:' + code.values);
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
            this.vegeDate = new Date('2990-12-31T00:00:00');
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

  public getLastVersion(program: IProgram): string {
    if (program.versions && (program.versions.length > 0)) {
      program.versions.sort(ConfigHelper.versionSorter);
      return program.versions[0].version;
    } else {
      return 'none';
    }

  }


  public get program(): IProgram {
    return this.actualService.actualProgram;
  }


  public copyMessage(val: string) {
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

  public onClick(item: string) {
    this.buildCompactChangesText(null);
    this.actualService.iTagInfosCheckBox = this.iTagInfosCheckBox;
  }


  public rendezesOsszes() {
    this.iRendezCompactKihagy = [];
    this.iRendezCompactKiValaszt = [];
    this.rendezConstproperty = [];
    this.rendezConst = [];
    this.rendezConst = ['Dátum', 'Típus', 'Fontosság', 'Jegyszám'];
    this.rendezConstproperty = ['date', 'type', 'importance', 'ticketNumber'];

    for (let index = 0; index < this.actualService.iTagInfosCheckBox.length; index++) {
      const element = this.actualService.iTagInfosCheckBox[index].code;

      this.elementNev = null;
      if (element === 'PAGE') {
        this.elementNev = 'Érinett oldalak';
        this.rendezConst.push(this.elementNev);
        this.rendezConstproperty.push(element.toLocaleLowerCase());
      } else if (element === 'TECHNICAL_CHANGE') {
        this.elementNev = 'Technikai változás';
        this.rendezConst.push(this.elementNev);
        this.rendezConstproperty.push(element.toLocaleLowerCase());
      } else if (element === 'WORK_HOURS') {
        this.elementNev = 'Munkaóra';
        this.rendezConst.push(this.elementNev);
        this.rendezConstproperty.push(element.toLocaleLowerCase());
      } else if (element === 'ALRKOD') {
        this.elementNev = 'Alrendszer kód';
        this.rendezConst.push(this.elementNev);
        this.rendezConstproperty.push(element.toLocaleLowerCase());
      } else if (element === 'MENUKOD') {
        this.elementNev = 'Menü kód';
        this.rendezConst.push(this.elementNev);
        this.rendezConstproperty.push(element.toLocaleLowerCase());
      } else {
        this.rendezConst.push(element);
        this.rendezConstproperty.push(element.toLocaleLowerCase());
      }
    }

    this.rendezKihagy = [];
    for (let i = 0; i < this.rendezConst.length; i++) {
      const element = {
        value: this.rendezConst[i],
        gysor: i,
        id: i,
        property: this.rendezConstproperty[i],
        rendezes: true
      };

      const elementKiir = {
        value: this.rendezConstproperty[i],
        label: this.rendezConst[i],
      };
      this.iRendezCompactKihagy.push(element);
      this.rendezKihagy.push(elementKiir);
    }
    this.actualService.actualRendezKihagy = this.iRendezCompactKihagy;
    this.actualService.actualRendezKihagyKiir = this.rendezKihagy;
  }

  public iRendezCompactValaszt(value: string, sorszam: number) {
    if (!this.actualService.actualRendezValaszt) { // Egynelőre nincs töltve az a változó amit tovább viszek, akkor feltöltjük
      console.log('Egyenlőre még semmi');
      for (const item of this.actualService.actualRendezKihagy) {
        if (item.property === value) {
          const element = {
            value: item.value,
            gysor: sorszam,
            id: sorszam,
            property: item.property,
            rendezes: item.rendezes
          };
          const elementKiir = {
            value: item.property,
            label: item.value,
          };
          this.iRendezCompactKiValaszt.push(element);
          this.actualService.actualRendezValaszt.push(element);
          this.rendezKivalaszt.push(elementKiir);
        }

      }

    } else {// Már töltve van az a változó amit tovább viszek, akkor updateljük a megfelelő sort
      console.log('Már töltve van');
      this.megNincsPluszSor = true;
      for (const kiValaszt of this.actualService.actualRendezValaszt) { // update
        if (kiValaszt.gysor === sorszam) {
          console.log('Ez már hozzá van rendelve.');

          for (const kiValasztNev of this.actualService.actualRendezKihagy) {
            if (kiValasztNev.property === value) {
              kiValaszt.property = kiValasztNev.property;
              kiValaszt.value = kiValasztNev.value;
              console.log('Itt kéne áttálítani');
              this.megNincsPluszSor = false;
            }
          }
        }
      }

      if (this.megNincsPluszSor) {  // Ha még nincs ilyen sor felvéve akkor felvesszük, megy az insert
        for (const item of this.actualService.actualRendezKihagy) {
          if (item.property === value) {
            const element = {
              value: item.value,
              gysor: sorszam,
              id: sorszam,
              property: item.property,
              rendezes: item.rendezes
            };
            const elementKiir = {
              value: item.property,
              label: item.value,
            };
            this.iRendezCompactKiValaszt.push(element);
            this.actualService.actualRendezValaszt.push(element);
            this.rendezKivalaszt.push(elementKiir);
          }

        }

      }
    }

    console.log('Így néz ki az eredmény:');
    console.log(this.actualService.actualRendezValaszt);
    this.buildCompactChangesText(null);
    this.sorrendNelkulOszlopok(this.actualService.actualRendezValaszt, this.actualService.actualRendezKihagy);
    // this.actualService.actualRendezValaszt = this.iRendezCompactKiValaszt; // ezt kell töltenem normálisan this.iRendezCompactKiValaszt
  }




  public iRendezCompactTorles(value: string, sorszam: number) {

    this.iRendezCompactKiValaszt = [];
    this.rendezKivalaszt = [];
    for (const item of this.actualService.actualRendezValaszt) {
      if (item.value !== value) {  // Ha nem egyenlő akkor beleteszem

        const element = {
          value: item.value,
          gysor: item.gysor,
          id: item.id,
          property: item.property,
          rendezes: item.rendezes
        };
        const elementKiir = {
          value: item.property,
          label: item.value,
        };

        this.iRendezCompactKiValaszt.push(element);
        this.rendezKivalaszt.push(elementKiir);
      } else { // Ha egyenlő akkor egy másik változóba teszem

        const element = {
          value: item.value,
          gysor: item.gysor,
          id: item.id,
          property: item.property,
          rendezes: item.rendezes
        };
        const elementKiir = {
          value: item.property,
          label: item.value,
        };
        this.iRendezCompactKihagy.push(element);
        this.rendezKihagy.push(elementKiir);
      }
      this.actualService.actualRendezValaszt = this.iRendezCompactKiValaszt;
      this.actualService.actualRendezKihagy = this.iRendezCompactKihagy;
      this.actualService.actualRendezValasztKiir = this.rendezKivalaszt;
      this.actualService.actualRendezKihagyKiir = this.rendezKihagy;
    }
  }

  public rendezesHozzaadas(nemKell: IRendezCompact[], value: string) {
    if (this.rendezVezerles.length <= this.rendezConst.length - 1) {
      this.rendezVezerles.push(this.rendezVezerles.length);
    }
    this.torlesHozzadasVezerles = this.rendezVezerles.length - 1;
  }



  public rendezesTorlese(value: string, sorszam: number) {

    if (this.actualService.actualRendezValaszt) {
      for (let index = 0; index < this.actualService.actualRendezValaszt.length; index++) { // Sorbatesszük
        this.rendezVezerles[index] = index;
        this.actualService.actualRendezValaszt[index].gysor = index;
        this.actualService.actualRendezValaszt[index].id = index;

      }
    }

    if (this.rendezVezerles.length > 1) {
      const maxErtek = this.rendezVezerles.length - 1;
      if (maxErtek === sorszam) {  // csak akkor lehet törölni ha az az utolsó
        this.rendezVezerles = [];
        this.kiValasztmegmarad = [];

        for (let i = 0; i < this.actualService.actualRendezValaszt.length; i++) {
          if (this.actualService.actualRendezValaszt[i].gysor !== sorszam) {
            const element = {
              value: this.actualService.actualRendezValaszt[i].value,
              gysor: this.actualService.actualRendezValaszt[i].gysor,
              id: this.actualService.actualRendezValaszt[i].id,
              property: this.actualService.actualRendezValaszt[i].property,
              rendezes: this.actualService.actualRendezValaszt[i].rendezes,
            };
            this.kiValasztmegmarad.push(element);
            this.rendezVezerles.push(i);

          }
        }

        this.actualService.actualRendezValaszt = [];
        this.actualService.actualRendezValaszt = this.kiValasztmegmarad;
        this.rendezVezerles = [];
        for (let i = 0; i < this.actualService.actualRendezValaszt.length; i++) {
          this.actualService.actualRendezValaszt[i].gysor = i;
          this.actualService.actualRendezValaszt[i].id = i;
          this.rendezVezerles[i] = i;
        }
        this.torlesHozzadasVezerles = this.rendezVezerles.length - 1;

      }
    }
  }




  public compactRendezes() {
    console.log('Rendezés!');
    this.sortChanges = this.actualService.actualChangeList.changes;
    console.table(this.actualService.actualRendezValaszt);
    if (this.actualService.actualRendezValaszt === undefined) {
      this.actualService.actualRendezValaszt = [];
    }
    if (!this.actualService.actualRendezValaszt[0]) {
      this.sortChanges.sort((a, b) => {
        if (a.date > b.date) {
          return -1;
        } else if (a.date < b.date) {
          return 1;
        } else {
          return 0;
        }
      });
    } else {
      console.log('Itt kell lennünk');
      this.sorba = [];
      for (let index = 0; index < this.actualService.actualRendezValaszt.length; index++) {
        const element = {
          id: index + 1,
          gysor: index + 1,
          value: this.actualService.actualRendezValaszt[index].value,
          property: this.actualService.actualRendezValaszt[index].property,
          rendezes: this.actualService.actualRendezValaszt[index].rendezes
        };
        this.sorba.push(element);
      }

      this.sortChanges = this.actualService.actualChangeList.changes;

      for (let index = 0; index < this.actualService.actualRendezValaszt.length; index++) {
        if (this.actualService.actualRendezValaszt[0] !== undefined) {
          this.elsoProperty = this.actualService.actualRendezValaszt[0].property;
          this.elsoRendez = this.actualService.actualRendezValaszt[0].rendezes;
        }
        if (this.actualService.actualRendezValaszt[1] !== undefined) {
          this.masodikProperty = this.actualService.actualRendezValaszt[1].property;
          this.masodikRendez = this.actualService.actualRendezValaszt[1].rendezes;
        }
        if (this.actualService.actualRendezValaszt[2] !== undefined) {
          this.harmadikProperty = this.actualService.actualRendezValaszt[2].property;
          this.harmadikRendez = this.actualService.actualRendezValaszt[2].rendezes;
        }
        if (this.actualService.actualRendezValaszt[3] !== undefined) {
          this.negyedikProperty = this.actualService.actualRendezValaszt[3].property;
          this.negyedikRendez = this.actualService.actualRendezValaszt[3].rendezes;
        }
        if (this.actualService.actualRendezValaszt[4] !== undefined) {
          this.otodikProperty = this.actualService.actualRendezValaszt[4].property;
          this.otodikRendez = this.actualService.actualRendezValaszt[4].rendezes;
        }
        if (this.actualService.actualRendezValaszt[5] !== undefined) {
          this.hatodikProperty = this.actualService.actualRendezValaszt[5].property;
          this.hatodikRendez = this.actualService.actualRendezValaszt[5].rendezes;
        }
        if (this.actualService.actualRendezValaszt[6] !== undefined) {
          this.hetedikProperty = this.actualService.actualRendezValaszt[5].property;
          this.hetedikRendez = this.actualService.actualRendezValaszt[5].rendezes;
        }
      }

      const elsoProperty: any = this.elsoProperty;
      const masodikProperty: any = this.masodikProperty;
      const harmadikProperty: any = this.harmadikProperty;
      const negyedikProperty: any = this.negyedikProperty;
      const otodikProperty: any = this.otodikProperty;
      const hatodikProperty: any = this.hatodikProperty;
      const hetedikProperty: any = this.hetedikProperty;

      // csak így lehet átvinni az értékét a sort-ba
      const elsoRendez: boolean = this.elsoRendez;
      const masodikRendez: boolean = this.masodikRendez;
      const harmadikRendez: boolean = this.harmadikRendez;
      const negyedikRendez: boolean = this.negyedikRendez;
      const otodikRendez: boolean = this.otodikRendez;
      const hatodikRendez: boolean = this.hatodikRendez;
      const hetedikRendez: boolean = this.hetedikRendez;

      console.log('rendezés nélkül: ', this.sortChanges);
      console.table(this.sortChanges);
      this.sortChanges.sort(function (a, b) {
        if (!elsoRendez) {
          if (a[elsoProperty] < b[elsoProperty]) { return 1; }
          if (a[elsoProperty] > b[elsoProperty]) { return -1; }
        } else {
          if (b[elsoProperty] < a[elsoProperty]) { return 1; }
          if (b[elsoProperty] > a[elsoProperty]) { return -1; }
        }

        for (let index = 0; index < a.tags.length; index++) {
          const element = a.tags[index];
          if (element.code.toLocaleLowerCase() === elsoProperty) {
            if (element.code.toLocaleLowerCase() === 'page' || element.code.toLocaleLowerCase() === 'ws'
              || element.code.toLocaleLowerCase() === 'alrkod') {
              if (!elsoRendez) {
                if (a.tags[index].values[0] < b.tags[index].values[0]) { return 1; }
                if (a.tags[index].values[0] > b.tags[index].values[0]) { return -1; }
              } else {
                if (b.tags[index].values[0] < a.tags[index].values[0]) { return 1; }
                if (b.tags[index].values[0] > a.tags[index].values[0]) { return -1; }
              }
            } else if (element.code.toLocaleLowerCase() === 'work_hours' || element.code.toLocaleLowerCase() === 'technical_change'
              || element.code.toLocaleLowerCase() === 'menukod'
            ) {
              if (!elsoRendez) {
                if (a.tags[index].value < b.tags[index].value) { return 1; }
                if (a.tags[index].value > b.tags[index].value) { return -1; }
              } else {
                if (b.tags[index].value < a.tags[index].value) { return 1; }
                if (b.tags[index].value > a.tags[index].value) { return -1; }
              }
            }
          }
        }


        if (!masodikRendez) {
          if (a[masodikProperty] > b[masodikProperty]) { return -1; }
          if (a[masodikProperty] < b[masodikProperty]) { return 1; }
        } else {
          if (b[masodikProperty] < a[masodikProperty]) { return 1; }
          if (b[masodikProperty] > a[masodikProperty]) { return -1; }
        }

        for (let index = 0; index < a.tags.length; index++) {
          const element = a.tags[index];
          if (element.code.toLocaleLowerCase() === masodikProperty) {
            if (element.code.toLocaleLowerCase() === 'page' || element.code.toLocaleLowerCase() === 'ws'
              || element.code.toLocaleLowerCase() === 'alrkod') {
              if (!masodikRendez) {
                if (a.tags[index].values[0] < b.tags[index].values[0]) { return 1; }
                if (a.tags[index].values[0] > b.tags[index].values[0]) { return -1; }
              } else {
                if (b.tags[index].values[0] < a.tags[index].values[0]) { return 1; }
                if (b.tags[index].values[0] > a.tags[index].values[0]) { return -1; }
              }
            } else if (element.code.toLocaleLowerCase() === 'work_hours' || element.code.toLocaleLowerCase() === 'technical_change'
              || element.code.toLocaleLowerCase() === 'menukod'
            ) {
              if (!masodikRendez) {
                if (a.tags[index].value < b.tags[index].value) { return 1; }
                if (a.tags[index].value > b.tags[index].value) { return -1; }
              } else {
                if (b.tags[index].value < a.tags[index].value) { return 1; }
                if (b.tags[index].value > a.tags[index].value) { return -1; }
              }
            }
          }
        }


        if (!harmadikRendez) {
          if (a[harmadikProperty] > b[harmadikProperty]) { return -1; }
          if (a[harmadikProperty] < b[harmadikProperty]) { return 1; }
        } else {
          if (b[harmadikProperty] < a[harmadikProperty]) { return 1; }
          if (b[harmadikProperty] > a[harmadikProperty]) { return -1; }
        }

        for (let index = 0; index < a.tags.length; index++) {
          const element = a.tags[index];
          if (element.code.toLocaleLowerCase() === harmadikProperty) {
            if (element.code.toLocaleLowerCase() === 'page' || element.code.toLocaleLowerCase() === 'ws'
              || element.code.toLocaleLowerCase() === 'alrkod') {
              if (!harmadikRendez) {
                if (a.tags[index].values[0] < b.tags[index].values[0]) { return 1; }
                if (a.tags[index].values[0] > b.tags[index].values[0]) { return -1; }
              } else {
                if (b.tags[index].values[0] < a.tags[index].values[0]) { return 1; }
                if (b.tags[index].values[0] > a.tags[index].values[0]) { return -1; }
              }
            } else if (element.code.toLocaleLowerCase() === 'work_hours' || element.code.toLocaleLowerCase() === 'technical_change'
              || element.code.toLocaleLowerCase() === 'menukod'
            ) {
              if (!harmadikRendez) {
                if (a.tags[index].value < b.tags[index].value) { return 1; }
                if (a.tags[index].value > b.tags[index].value) { return -1; }
              } else {
                if (b.tags[index].value < a.tags[index].value) { return 1; }
                if (b.tags[index].value > a.tags[index].value) { return -1; }
              }
            }
          }
        }


        if (!negyedikRendez) {
          if (a[negyedikProperty] > b[negyedikProperty]) { return -1; }
          if (a[negyedikProperty] < b[negyedikProperty]) { return 1; }
        } else {
          if (b[negyedikProperty] < a[negyedikProperty]) { return 1; }
          if (b[negyedikProperty] > a[negyedikProperty]) { return -1; }
        }

        for (let index = 0; index < a.tags.length; index++) {
          const element = a.tags[index];
          if (element.code.toLocaleLowerCase() === negyedikProperty) {
            if (element.code.toLocaleLowerCase() === 'page' || element.code.toLocaleLowerCase() === 'ws'
              || element.code.toLocaleLowerCase() === 'alrkod') {
              if (!negyedikRendez) {
                if (a.tags[index].values[0] < b.tags[index].values[0]) { return 1; }
                if (a.tags[index].values[0] > b.tags[index].values[0]) { return -1; }
              } else {
                if (b.tags[index].values[0] < a.tags[index].values[0]) { return 1; }
                if (b.tags[index].values[0] > a.tags[index].values[0]) { return -1; }
              }
            } else if (element.code.toLocaleLowerCase() === 'work_hours' || element.code.toLocaleLowerCase() === 'technical_change'
              || element.code.toLocaleLowerCase() === 'menukod'
            ) {
              if (!negyedikRendez) {
                if (a.tags[index].value < b.tags[index].value) { return 1; }
                if (a.tags[index].value > b.tags[index].value) { return -1; }
              } else {
                if (b.tags[index].value < a.tags[index].value) { return 1; }
                if (b.tags[index].value > a.tags[index].value) { return -1; }
              }
            }
          }
        }


        if (!otodikRendez) {
          if (a[otodikProperty] > b[otodikProperty]) { return -1; }
          if (a[otodikProperty] < b[otodikProperty]) { return 1; }
        } else {
          if (b[otodikProperty] < a[otodikProperty]) { return 1; }
          if (b[otodikProperty] > a[otodikProperty]) { return -1; }
        }

        for (let index = 0; index < a.tags.length; index++) {
          const element = a.tags[index];
          if (element.code.toLocaleLowerCase() === otodikProperty) {
            if (element.code.toLocaleLowerCase() === 'page' || element.code.toLocaleLowerCase() === 'ws'
              || element.code.toLocaleLowerCase() === 'alrkod') {
              if (!otodikRendez) {
                if (a.tags[index].values[0] < b.tags[index].values[0]) { return 1; }
                if (a.tags[index].values[0] > b.tags[index].values[0]) { return -1; }
              } else {
                if (b.tags[index].values[0] < a.tags[index].values[0]) { return 1; }
                if (b.tags[index].values[0] > a.tags[index].values[0]) { return -1; }
              }
            } else if (element.code.toLocaleLowerCase() === 'work_hours' || element.code.toLocaleLowerCase() === 'technical_change'
              || element.code.toLocaleLowerCase() === 'menukod'
            ) {
              if (!otodikRendez) {
                if (a.tags[index].value < b.tags[index].value) { return 1; }
                if (a.tags[index].value > b.tags[index].value) { return -1; }
              } else {
                if (b.tags[index].value < a.tags[index].value) { return 1; }
                if (b.tags[index].value > a.tags[index].value) { return -1; }
              }
            }
          }
        }


        if (!hatodikRendez) {
          if (a[hatodikProperty] > b[hatodikProperty]) { return -1; }
          if (a[hatodikProperty] < b[hatodikProperty]) { return 1; }
        } else {
          if (b[hatodikProperty] < a[hatodikProperty]) { return 1; }
          if (b[hatodikProperty] > a[hatodikProperty]) { return -1; }
        }

        for (let index = 0; index < a.tags.length; index++) {
          const element = a.tags[index];
          if (element.code.toLocaleLowerCase() === hatodikProperty) {
            if (element.code.toLocaleLowerCase() === 'page' || element.code.toLocaleLowerCase() === 'ws'
              || element.code.toLocaleLowerCase() === 'alrkod') {
              if (!hatodikRendez) {
                if (a.tags[index].values[0] < b.tags[index].values[0]) { return 1; }
                if (a.tags[index].values[0] > b.tags[index].values[0]) { return -1; }
              } else {
                if (b.tags[index].values[0] < a.tags[index].values[0]) { return 1; }
                if (b.tags[index].values[0] > a.tags[index].values[0]) { return -1; }
              }
            } else if (element.code.toLocaleLowerCase() === 'work_hours' || element.code.toLocaleLowerCase() === 'technical_change'
              || element.code.toLocaleLowerCase() === 'menukod'
            ) {
              if (!hatodikRendez) {
                if (a.tags[index].value < b.tags[index].value) { return 1; }
                if (a.tags[index].value > b.tags[index].value) { return -1; }
              } else {
                if (b.tags[index].value < a.tags[index].value) { return 1; }
                if (b.tags[index].value > a.tags[index].value) { return -1; }
              }
            }
          }
        }


        if (!hetedikRendez) {
          if (a[hetedikProperty] > b[hetedikProperty]) { return -1; }
          if (a[hetedikProperty] < b[hetedikProperty]) { return 1; }
        } else {
          if (b[hetedikProperty] < a[hetedikProperty]) { return 1; }
          if (b[hetedikProperty] > a[hetedikProperty]) { return -1; }
        }

        for (let index = 0; index < a.tags.length; index++) {
          const element = a.tags[index];
          if (element.code.toLocaleLowerCase() === hetedikProperty) {
            if (element.code.toLocaleLowerCase() === 'page' || element.code.toLocaleLowerCase() === 'ws'
              || element.code.toLocaleLowerCase() === 'alrkod') {
              if (!hetedikRendez) {
                if (a.tags[index].values[0] < b.tags[index].values[0]) { return 1; }
                if (a.tags[index].values[0] > b.tags[index].values[0]) { return -1; }
              } else {
                if (b.tags[index].values[0] < a.tags[index].values[0]) { return 1; }
                if (b.tags[index].values[0] > a.tags[index].values[0]) { return -1; }
              }
            } else if (element.code.toLocaleLowerCase() === 'work_hours' || element.code.toLocaleLowerCase() === 'technical_change'
              || element.code.toLocaleLowerCase() === 'menukod'
            ) {
              if (!hetedikRendez) {
                if (a.tags[index].value < b.tags[index].value) { return 1; }
                if (a.tags[index].value > b.tags[index].value) { return -1; }
              } else {
                if (b.tags[index].value < a.tags[index].value) { return 1; }
                if (b.tags[index].value > a.tags[index].value) { return -1; }
              }
            }
          }
        }
        return 0;
      });
      console.log('rendezéssel: ', this.sortChanges);
      console.table(this.sortChanges);
      this.tableAdatokRendezes = this.actualService.actualRendezValaszt;
      this.sorrendNelkulOszlopok(this.actualService.actualRendezValaszt, this.actualService.actualRendezKihagy);
    }
  }

  public toggleVisibility(e, value: any) {
    this.actualService.actualRendezValaszt[value].rendezes = e.target.checked;
    this.buildCompactChangesText(null);
  }

  public dinamikusTable(tableData: IRendezCompact[], property: string) {
    return tableData[property];
  }

  public sorrendNelkulOszlopok(kiValaszt: IRendezCompact[], megMarad: IRendezCompact[]) {
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

}
