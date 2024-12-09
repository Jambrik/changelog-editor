/// <reference types="@angular/localize" />

import { HttpClient, provideHttpClient } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding, withHashLocation } from '@angular/router';
import { ActualService, ChangeLogService, ConfigService } from '@changelog-editor/data-access-core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { appRoutes } from './app/app-routing.module';
import { AppComponent } from './app/components/app/app.component';
import { environment } from './environments/environment';

export function getHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
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
    provideRouter(appRoutes, withHashLocation()),
    provideRouter(appRoutes, withComponentInputBinding()),
    ChangeLogService,
    ActualService,
    ConfigService
  ]
});

bootstrap().catch(err => console.log(err));
