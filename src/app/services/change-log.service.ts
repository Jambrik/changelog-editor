import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ChangeLogItem } from '../models/ChangeLogItem';
import { VersionChangeLog } from '../models/VersionChangeLog';
import { VersionMetaData } from '../models/VersionMetaData';

@Injectable()
export class ChangeLogService {


  constructor(
    private http: HttpClient,
    private translateService: TranslateService
  ) { }


  public getVersionsForProgramId(programId: number): Observable<VersionMetaData[]> {
    return this.http.get<VersionMetaData[]>(environment.backEndUrl + 'rest/changelog/versions/' + programId);
  }

  public getChangeLogs(programId: number, versionNumber: string): Observable<VersionChangeLog> {
    return this.http.get<VersionChangeLog>(environment.backEndUrl + 'rest/changelog/load/' + programId + '/' + versionNumber);
  }

  public changeLogWrite(programId: number, versionNumber: string, item: ChangeLogItem) {
    return this.http.post(environment.backEndUrl + 'rest/changelog/write',
      {
        programId: programId,
        version: versionNumber,
        item: item
      }
    );
  }

  public changeLogDelete(programId: number, versionNumber: string, id: string) {
    return this.http.post(environment.backEndUrl + 'rest/changelog/delete',
      {
        programId: programId,
        version: versionNumber,
        id: id
      }
    );
  }


  public changeLogRelease(programId: number, versionNumber: string, releaseDate: Date) {
    return this.http.post(environment.backEndUrl + 'rest/changelog/release',
      {
        programId: programId,
        version: versionNumber,
        releaseDate: releaseDate
      }
    );
  }

  public createNewVersion(programId: number, version: string) {
    return this.http.get<VersionChangeLog>(environment.backEndUrl + 'rest/changelog/new-version/' + programId + '/' + version);
  }

}
