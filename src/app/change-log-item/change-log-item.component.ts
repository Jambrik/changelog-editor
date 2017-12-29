import { Component, OnInit, Input } from '@angular/core';
import { IChangeLogItem } from '../models/IChangeLogItem';
import { NavbarService } from '../services/navbar.service';
import { IProgram } from '../models/IProgram';

@Component({
  selector: 'app-change-log-item',
  templateUrl: './change-log-item.component.html',
  styleUrls: ['./change-log-item.component.scss']
})
export class ChangeLogItemComponent implements OnInit {
  @Input("item") changeLogItem: IChangeLogItem;
  @Input() action: "read" | "mod" | "new";  
  @Input() modId: number;  

  public types = [
    {label: "BUGFIX", value: "bugfix"},
    {label: "FEATURE", value: "feature"}
  ];

  public selectedType: any;
  constructor(private navbarService: NavbarService) { }

  ngOnInit() {
  }

  public isEditing(): boolean {
    return ((this.action == "mod") || (this.action == "new")) && (this.modId == this.changeLogItem.id);

  }

  public canBeModified(): boolean{
    return !this.modId;
  }

  public clickMod(){
    this.action = "mod";
  }

  public get program(): IProgram{
    return this.navbarService.actualProgram;
  }

  public get version(): string {
    return this.navbarService.actualVersion;
  }

}
