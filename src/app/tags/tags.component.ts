import { Component, Input, OnInit } from '@angular/core';
import { TagImpl } from '../models/TagImpl';



@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {
  @Input() tags: TagImpl[];
  @Input() editing: boolean;
  constructor(
  ) {

  }

  ngOnInit() {
  }

}
