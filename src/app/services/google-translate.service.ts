import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ITranslate } from '../models/ITranslateData';

@Injectable()
export class GoogleTranslateService {

  constructor(private http: HttpClient) { }

  public translate(text: string, from: string, to: string): Observable<ITranslate> {
    return this.http.post<ITranslate>(environment.backEndUrl + "api/translate/",
      {
        text: text,
        from: from,
        to: to
      });
  }

}
