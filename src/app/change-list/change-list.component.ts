import { StringHelpers } from '../helpers/string-helpers';
import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChangeLogService } from '../services/change-log.service';
import { IChaneLogList } from '../models/IChangeLogList';
import { NavbarService } from '../services/navbar.service';
import { ConfigService } from '../services/config.service';
import { IProgram } from '../models/IProgram';
import { ConfigHelper } from '../helpers/config-helper';

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
  public program: IProgram;
  public version: string;
  public changeList: IChaneLogList;


  constructor(
    private route: ActivatedRoute,
    private changeLogService: ChangeLogService,
    private navbarService: NavbarService,
    private configService: ConfigService) { }

  ngOnInit() {
    //Because we load always the same component, the init run only once. So we subscribe the router params changes:
    this.route.params.subscribe(params => {
      let programId = params['program-id'];
      let version = params['version'];
      console.log("programId, version", programId, version);
      let programIdInt = parseInt(programId);
      if (this.programId != programIdInt) {
        this.configService.getConfig()
          .subscribe((config) => {
            this.programId = programIdInt;
            this.program = ConfigHelper.getProgramById(config.programs, this.programId);
            this.navbarService.actualProgram = this.program;
            console.log("New program id", programId);
            //First of all we have get the versions
            this.changeLogService.getVersionsForProgramId(programId)
              .subscribe((versions) => {
                console.log("here are versions", versions);
                versions.sort(StringHelpers.sortDesc);
                this.navbarService.actualVersions = versions;
                //If version is the latest we have to find that
                if ((version == "latest") && (versions.length > 0)) {
                  this.version = versions[0];
                }
                this.getChanges();
              });
          });
      } else {
        this.version = version;
        this.getChanges();
      }

    });
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.filterText.currentValue != changes.filterText.previousValue) {
      //this.changeLogService.getChangeLogs(programId, version)
    }
  }

  private getChanges() {
    this.changeLogService.getChangeLogs(this.programId, this.version)
      .subscribe(chaneLogList => {
        console.log("change list loaded", chaneLogList);
        chaneLogList.changes.sort((a, b) => {
          if (a.date > b.date)
            return -1;
          else if (a.date < b.date)
            return 1;
          else
            return 0;
        });
        this.changeList = chaneLogList;
      });

  }



}


