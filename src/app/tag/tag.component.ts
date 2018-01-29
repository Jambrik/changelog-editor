import { Component, OnInit, Input } from '@angular/core';
import { ITag } from '../models/ITag';
import { ITagInfo } from '../models/ITagInfo';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {
  @Input() tags: ITag[];  
  @Input() tagInfo: ITagInfo;
  constructor() { }

  ngOnInit() {
  }

}
