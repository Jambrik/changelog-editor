import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { ChangeLogEditorConfig } from '../models/ChangeLogEditorConfig';
import { ActualService } from './actual.service';

@Injectable()
export class ConfigService {

  constructor(
    private http: HttpClient,
    private actualService: ActualService) { }

  public getConfig(): Observable<ChangeLogEditorConfig> {
    return this.http.get<ChangeLogEditorConfig>(environment.backEndUrl + 'api/config')
      .map((response: ChangeLogEditorConfig) => {
        console.log('User', response.user);
        this.actualService.actualUser = response.user;
        response.programs.forEach(program => {
          program.versions.forEach(cl => {
            cl.releaseDate = new Date(cl.releaseDate);

          });

        });
        return response;
      });
  }



}
