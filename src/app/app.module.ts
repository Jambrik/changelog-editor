import { DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { EditorModule } from '@progress/kendo-angular-editor';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { MessageService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';
import { ChangeListComponent } from './change-list/change-list.component';
import { ChangeLogItemComponent } from './change-log-item/change-log-item.component';
import { CompactComponent } from './compact/compact.component';
import { ConfigEditorComponent } from './config-editor/config-editor.component';
import { LeftNavbarComponent } from './left-navbar/left-navbar.component';
import { NewVersionCreatationComponent } from './new-version-creatation/new-version-creatation.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { ProgramListComponent } from './program-list/program-list.component';
import { ActualService } from './services/actual.service';
import { ChangeLogService } from './services/change-log.service';
import { ConfigService } from './services/config.service';
import { GoogleTranslateService } from './services/google-translate.service';
import { TagComponent } from './tag/tag.component';
import { TagsComponent } from './tags/tags.component';
import { TopNavbarComponent } from './top-navbar/top-navbar.component';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { GridModule } from '@progress/kendo-angular-grid';









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
    MessageModule,
    MessagesModule,
    CalendarModule,
    EditorModule,
    InputSwitchModule,
    SelectButtonModule,
    HttpClientModule,
    InputTextModule,
    ProgressSpinnerModule,
    TableModule,
    DialogModule,
    ButtonModule,
    DropdownModule,
    AutoCompleteModule,
    TriStateCheckboxModule,
    CheckboxModule,
    RouterModule.forRoot(ROUTES, {
      useHash: true,
      onSameUrlNavigation: 'reload',
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    DropDownsModule,
    ButtonsModule,
    DateInputsModule,
    IndicatorsModule,
    NotificationModule,
    DialogsModule,
    InputsModule,
    GridModule
  ],
  providers: [ConfigService, ActualService, ChangeLogService, MessageService, GoogleTranslateService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
