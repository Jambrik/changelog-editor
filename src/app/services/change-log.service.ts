import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { IChaneLogList } from '../models/IChangeLogList';
import { IChangeLogItem } from '../models/IChangeLogItem';

@Injectable()
export class ChangeLogService {

  
  constructor(private http: HttpClient) { }


  public getVersionsForProgramId(programId: number): Observable<string[]> {
    return this.http.get<string[]>(environment.backEndUrl +"api/versions/" + programId);
  }  


  public getChangeLogs(programId: number, version: string): Observable<IChaneLogList> {
    return this.http.get<IChaneLogList>(environment.backEndUrl +"api/change-log-load/" + programId + "/" + version);
  }  

  public changeLogWrite(programId: number, version: string, item: IChangeLogItem) {
    return this.http.post(environment.backEndUrl + "api/change-log-write", 
      {
        programId: programId,
        version: version,
        item: item 
      }
    );
  }

  public changeLogDelete(programId: number, version: string, id: string) {
    return this.http.post(environment.backEndUrl + "api/change-log-delete", 
      {
        programId: programId,
        version: version,
        id: id
      }
    );
  }

  public createNewVersion(programId: number, version: string){
    return this.http.get<IChaneLogList>(environment.backEndUrl +"api/new-version/" + programId + "/" + version);
  }
}
