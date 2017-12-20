import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChangeLogService } from '../services/change-log.service';

interface City {
  name: string,
  code: string
}

@Component({
  selector: 'app-change-list',
  templateUrl: './change-list.component.html',
  styleUrls: ['./change-list.component.scss']
})
export class ChangeListComponent implements OnInit, OnChanges {
  @Input() filterText: string;
  public programId: number;
  public version: string;



  constructor(
    private route: ActivatedRoute,
    private changeLogService: ChangeLogService) { }

  ngOnInit() {
    //Because we load always the same component, the init run only once. So we subscribe the router params changes:
    this.route.params.subscribe(params => {
      let programId = params['program-id'];
      let version  = params['version'];
      this.programId = parseInt(programId);
      this.version = version;    
    });
  }

  ngOnChanges(changes: SimpleChanges): void {

    if(changes.filterText.currentValue != changes.filterText.previousValue){
      //this.changeLogService.getChangeLogs(programId, version)
    }
  }




}


