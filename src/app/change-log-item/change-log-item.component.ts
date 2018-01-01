import { Router } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { IChangeLogItem } from '../models/IChangeLogItem';
import { NavbarService } from '../services/navbar.service';
import { IProgram } from '../models/IProgram';
import { ChangeLogService } from '../services/change-log.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { Message } from 'primeng/components/common/api';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-change-log-item',
  templateUrl: './change-log-item.component.html',
  styleUrls: ['./change-log-item.component.scss']
})
export class ChangeLogItemComponent implements OnInit, OnChanges {
  
  @Input("item") changeLogItem: IChangeLogItem;
  @Input() action: "read" | "mod" | "new";
  @Input() modId: string;
  @Output() onDeleteOrAddingNew: EventEmitter<void> = new EventEmitter();
  msgs: Message[] = [];
  deleteMessageShown: boolean = false;  

  public types = [
    { label: "BUGFIX", value: "bugfix" },
    { label: "FEATURE", value: "feature" }
  ];

  public selectedType: any;
  constructor(
    private navbarService: NavbarService,
    private changeLogService: ChangeLogService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit() {    
  }

  ngOnChanges(changes: SimpleChanges): void {
    
  }
  public isEditing(): boolean {
    return ((this.action == "mod") && (this.modId == this.changeLogItem.id)) || ((this.action == "new") && (this.changeLogItem.id == null));

  }

  public canBeModified(): boolean {
    return this.action == 'read';
  }

  public clickMod() {
    this.action = "mod";
  }

  public get program(): IProgram {
    return this.navbarService.actualProgram;
  }

  public get version(): string {
    return this.navbarService.actualVersion;
  }

  public save(event: Event) {
    event.preventDefault();
    this.changeLogService.changeLogWrite(this.program.id, this.version, this.changeLogItem)
      .subscribe((x) => {
        if(this.changeLogItem.id == null) {
          this.onDeleteOrAddingNew.emit();        
          this.router.navigate(["/change-list", this.program.id, this.version, 'read', 'none']);        
      },
      (error) => {
        this.msgs.push({ severity: 'error', summary: 'Hiba', detail: error.error });
      });
  }

  public deleteMessageShow(event: Event) {
    event.preventDefault();
    this.deleteMessageShown = true;
  }

  public cancelDelete(event: Event) {
    event.preventDefault();
    this.deleteMessageShown = false;
  }

  public delete(event: Event) {
    event.preventDefault();
    this.changeLogService.changeLogDelete(this.program.id, this.version, this.changeLogItem.id)
      .subscribe((x) => {
        console.log("delete done", x);
        this.onDeleteOrAddingNew.emit();
      },
      (error) => {
        this.msgs.push({ severity: 'error', summary: 'Hiba', detail: error.error });
      });
  }

}
