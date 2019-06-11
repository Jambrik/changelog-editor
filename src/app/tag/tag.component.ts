import { Component, OnInit, Input } from '@angular/core';
import { Tag } from '../models/Tag';
import { ICodeCaption } from '../models/ICodeCaption';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {
  @Input() tag: Tag;
  @Input() editing: boolean;
  public allCompactValues: ICodeCaption[];

  constructor() { }

  ngOnInit() {
    this.allCompactValues = this.tag.tagInfo.valuesCompact;
    this.values = this.tag.compactValues;
  }

  public get values(): ICodeCaption[] {
    return this.tag.compactValues;
  }

  public set values(values: ICodeCaption[]) {
    this.tag.compactValues = values;
  }

  search(event) {
    const compactValues: ICodeCaption[] = [];
    if (event.query === '') {
      for (const valueCompact of this.tag.tagInfo.valuesCompact) {
        if (!this.isInTheSelectedValues(valueCompact)) {
          compactValues.push(valueCompact);
        }
      }
    } else {
      for (const valueCompact of this.tag.tagInfo.valuesCompact) {
        if ((valueCompact.caption.toUpperCase().indexOf(event.query.toUpperCase()) > -1) && !this.isInTheSelectedValues(valueCompact)) {
          compactValues.push(valueCompact);
        }
      }

    }
    this.allCompactValues = compactValues;

  }

  private isInTheSelectedValues(inValue: ICodeCaption) {
    let found = false;
    for (const value of this.values) {
      if (value.code === inValue.code) {
        found = true;
      }
    }
    return found;
  }

}
