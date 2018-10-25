import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IVersionChangeLog } from '../models/IVersionChangeLog';
import { IChangeLogItem } from '../models/IChangeLogItem';
import { TranslateService } from '@ngx-translate/core';
import { ILabelValue } from '../models/ILableValue';
import { IVersionMetaData } from '../models/IVersionMetaData';

@Injectable()
export class ChangeLogService {


  constructor(
    private http: HttpClient,
    private translateService: TranslateService
  ) { }


  public getVersionsForProgramId(programId: number): Observable<IVersionMetaData[]> {
    return this.http.get<IVersionMetaData[]>(environment.backEndUrl + "api/versions/" + programId);
  }

  public getChangeLogs(programId: number, versionNumber: string): Observable<IVersionChangeLog> {
    return this.http.get<IVersionChangeLog>(environment.backEndUrl + "api/change-log-load/" + programId + "/" + versionNumber);
  }

  public changeLogWrite(programId: number, versionNumber: string, item: IChangeLogItem) {
    return this.http.post(environment.backEndUrl + "api/change-log-write",
      {
        programId: programId,
        version: versionNumber,
        item: item
      }
    );
  }

  public changeLogDelete(programId: number, versionNumber: string, id: string) {
    return this.http.post(environment.backEndUrl + "api/change-log-delete",
      {
        programId: programId,
        version: versionNumber,
        id: id
      }
    );
  }


  public changeLogRelease(programId: number, versionNumber: string, releaseDate: Date) {
    return this.http.post(environment.backEndUrl + "api/change-log-release",
      {
        programId: programId,
        version: versionNumber,        
        releaseDate: releaseDate
      }
    );
  }  

  public createNewVersion(programId: number, version: string) {
    return this.http.get<IVersionChangeLog>(environment.backEndUrl + "api/new-version/" + programId + "/" + version);
  }
  
}
