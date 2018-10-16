import { ROUTES } from './app.routes';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import {
  InputTextModule, ButtonModule, DataTableModule, DialogModule, DropdownModule, MessageModule, MessagesModule,
  CalendarModule, EditorModule, InputSwitchModule, SelectButtonModule, ProgressSpinnerModule, AutoCompleteModule,
  TriStateCheckboxModule, CheckboxModule
} from 'primeng/primeng';
import { ChangeListComponent } from './change-list/change-list.component';
import { CompactComponent } from './compact/compact.component';
import { AppComponent } from './app.component';
import { TopNavbarComponent } from './top-navbar/top-navbar.component';
import { LeftNavbarComponent } from './left-navbar/left-navbar.component';
import { ProgramListComponent } from './program-list/program-list.component';
import { ConfigEditorComponent } from './config-editor/config-editor.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ConfigService } from './services/config.service';
import { ActualService } from './services/actual.service';
import { ChangeLogService } from './services/change-log.service';
import { ChangeLogItemComponent } from './change-log-item/change-log-item.component';
import { MessageService } from 'primeng/components/common/messageservice';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { GoogleTranslateService } from './services/google-translate.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NewVersionCreatationComponent } from './new-version-creatation/new-version-creatation.component';
import { TagsComponent } from './tags/tags.component';
import { TagComponent } from './tag/tag.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    ChangeListComponent,
    CompactComponent,
    TopNavbarComponent,
    LeftNavbarComponent,
    ProgramListComponent,
    ConfigEditorComponent,
    ChangeLogItemComponent,
    SafeHtmlPipe,
    NewVersionCreatationComponent,
    TagsComponent,
    TagComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    DataTableModule,
    MessageModule,
    MessagesModule,
    CalendarModule,
    EditorModule,
    InputSwitchModule,
    SelectButtonModule,
    HttpClientModule,
    InputTextModule,
    ProgressSpinnerModule,
    DialogModule,
    ButtonModule,
    DropdownModule,
    AutoCompleteModule,
    TriStateCheckboxModule,
    CheckboxModule,
    RouterModule.forRoot(ROUTES, {
      useHash: true,
      onSameUrlNavigation: "reload",
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [ConfigService, ActualService, ChangeLogService, MessageService, GoogleTranslateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
