import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Translate } from '../models/TranslateData';

@Injectable()
export class GoogleTranslateService {

  constructor(private http: HttpClient) { }

  public translate(text: string, from: string, to: string): Observable<Translate> {
    return this.http.post<Translate>(environment.backEndUrl + 'api/translate/',
      {
        text: text,
        from: from,
        to: to
      });
  }

}
