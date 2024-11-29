/// <reference types="@angular/localize" />

import { ApplicationModule, enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from './environments/environment';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/components/app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { appRoutes } from './app/app-routing.modules';
import { ConfigService } from './app/services/config.service';
import { ActualService } from './app/services/actual.service';
import { ChangeLogService } from './app/services/change-log.service';

export function getHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

if (environment.production) {
  enableProdMode();
}

const bootstrap = () => bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    importProvidersFrom(TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: getHttpLoaderFactory,
        deps: [HttpClient]
      }
    })),
    provideHttpClient(),
    provideRouter(appRoutes, withComponentInputBinding()),
  ]
});

bootstrap().catch(err => console.log(err));
