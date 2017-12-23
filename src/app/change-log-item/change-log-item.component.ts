import { Component, OnInit, Input } from '@angular/core';
import { IChangeLogItem } from '../models/IChangeLogItem';

@Component({
  selector: 'app-change-log-item',
  templateUrl: './change-log-item.component.html',
  styleUrls: ['./change-log-item.component.scss']
})
export class ChangeLogItemComponent implements OnInit {
  @Input("item") changeLogItem: IChangeLogItem;
  constructor() { }

  ngOnInit() {
  }

}
