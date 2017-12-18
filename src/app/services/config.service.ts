import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { IChangeLogEditorConfig } from '../models/IChangeLogEditorConfig';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ConfigService {

  constructor(private http: HttpClient) { }

  public getConfig(): Observable<IChangeLogEditorConfig> {
    return this.http.get<IChangeLogEditorConfig>(environment.backEndUrl +"api/config")      
  }

  

}
