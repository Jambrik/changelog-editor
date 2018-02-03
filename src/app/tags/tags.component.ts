import { Component, OnInit, Input } from '@angular/core';
import { IProgram } from '../models/IProgram';
import { ITag } from '../models/ITag';
import { ActualService } from '../services/actual.service';
import { TranslateService } from '@ngx-translate/core';
import { ChangeLogAction } from '../types/types';
import { TagInfo } from '../models/TagInfo';
import { Tag } from '../models/Tag';



@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {
  @Input() tags: Tag[];
  @Input() editing: boolean;
  constructor(    
  ) {

  }

  ngOnInit() {
  }  

}
