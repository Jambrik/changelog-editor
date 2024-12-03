import { Component, Input, OnInit } from '@angular/core';
import { TagComponent } from '@changelog-editor/feature/tag';
import { TagImpl } from '@changelog-editor/util/models';



@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
  standalone: true,
  imports: [
    TagComponent
  ]
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
