import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../apps/changelog-editor/src/environments/environment';
import { Translate } from '@changelog-editor/util/models';

@Injectable()
export class GoogleTranslateService {

  constructor(private http: HttpClient) { }

  public translate(text: string, from: string, to: string): Observable<Translate> {
    return this.http.post<Translate>(environment.backEndUrl + 'rest/translate/',
      {
        text: text,
        from: from,
        to: to
      });
  }

}
