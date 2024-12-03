/// <reference types="@angular/localize" />

import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/components/app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { provideRouter, withComponentInputBinding, withHashLocation } from '@angular/router';
import { appRoutes } from './app/app-routing.module';
import { ActualService, ChangeLogService, ConfigService } from '@changelog-editor/data-access-core';

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
    provideRouter(appRoutes, withHashLocation()),
    provideRouter(appRoutes, withComponentInputBinding()),
    ChangeLogService,
    ActualService,
    ConfigService
  ]
});

bootstrap().catch(err => console.log(err));
