import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ChangeLogService {

  
  constructor(private http: HttpClient) { }


  public getVersionsForProgramId(programId: number): Observable<string[]> {
    return this.http.get<string[]>(environment.backEndUrl +"api/versions/" + programId);
  }  


  public getChangeLogs(programId: number, version: string): Observable<string[]> {
    return this.http.get<string[]>(environment.backEndUrl +"api/change-log-load/" + programId + "/" + version);
  }  
}
