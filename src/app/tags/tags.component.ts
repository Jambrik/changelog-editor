import { Component, OnInit, Input } from '@angular/core';
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
