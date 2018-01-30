import { Component, OnInit, Input } from '@angular/core';
import { IProgram } from '../models/IProgram';
import { ITag } from '../models/ITag';
import { ActualService } from '../services/actual.service';
import { TranslateService } from '@ngx-translate/core';
import { ChangeLogAction } from '../types/types';
import { TagInfo } from '../models/TagInfo';



@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {
  @Input() tags: ITag[];
  @Input() action: ChangeLogAction;
  constructor(
    private actualService: ActualService,
    private translateService: TranslateService
  ) {

  }

  ngOnInit() {
  }

  public getTagInfos(): TagInfo[] {
    let resultList: TagInfo[] = [];
    let program: IProgram = this.actualService.actualProgram;
    let actualLang: string = this.translateService.currentLang;
    let tagInfos = program.tagInfos;
    if (tagInfos) {
      for (let tagInfo of tagInfos) {
        let tio = new TagInfo(
          tagInfo.code,
          tagInfo.captions,
          tagInfo.fix,
          tagInfo.moreOptionsAllowed,
          tagInfo.mandatory,
          tagInfo.setOfValues,
          this.translateService
        );
        resultList.push(tio);
      }
    }
    return resultList;
  }

}
