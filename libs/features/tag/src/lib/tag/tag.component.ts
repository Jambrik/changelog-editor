import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TagImpl, CodeCaption } from '@changelog-editor/util/models';
import { MultiSelectModule } from '@progress/kendo-angular-dropdowns';
import { LabelModule } from '@progress/kendo-angular-label';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MultiSelectModule,
    LabelModule,
  ]
})
export class TagComponent implements OnInit {
  @Input() tag: TagImpl;
  @Input() editing: boolean;
  public allCompactValues: CodeCaption[];

  constructor() { }

  ngOnInit() {
    this.allCompactValues = this.tag.tagInfo.valuesCompact;
    this.values = this.tag.compactValues;
  }

  public get values(): CodeCaption[] {
    return this.tag.compactValues;
  }

  public set values(values: CodeCaption[]) {
    this.tag.compactValues = values;
  }

  search(event) {
    const compactValues: CodeCaption[] = [];
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

  private isInTheSelectedValues(inValue: CodeCaption) {
    let found = false;
    for (const value of this.values) {
      if (value.code === inValue.code) {
        found = true;
      }
    }
    return found;
  }

}
