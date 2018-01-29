import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { IChangeLogEditorConfig } from '../models/IChangeLogEditorConfig';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { ActualService } from './actual.service';

@Injectable()
export class ConfigService {

  constructor(
    private http: HttpClient,
    private actualService: ActualService) { }

  public getConfig(): Observable<IChangeLogEditorConfig> {
    return this.http.get<IChangeLogEditorConfig>(environment.backEndUrl +"api/config")
    .map((response: IChangeLogEditorConfig) => {
      console.log("User", response.user);
      this.actualService.actualUser = response.user;
      return response;
    });
  }

  

}
