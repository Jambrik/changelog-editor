import { ROUTES } from './app.routes';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { InputTextModule, ButtonModule, DataTableModule, DialogModule, DropdownModule, MessageModule, MessagesModule, 
  CalendarModule, EditorModule, InputSwitchModule }  from 'primeng/primeng';
import { ChangeListComponent } from './change-list/change-list.component';
import { AppComponent } from './app.component';
import { TopNavbarComponent } from './top-navbar/top-navbar.component';
import { LeftNavbarComponent } from './left-navbar/left-navbar.component';
import { ProgramListComponent } from './program-list/program-list.component';
import { ConfigEditorComponent } from './config-editor/config-editor.component';
import {HttpClientModule} from '@angular/common/http';
import { ConfigService } from './services/config.service';
import { NavbarService } from './services/navbar.service';
import { ChangeLogService } from './services/change-log.service';
import { ChangeLogItemComponent } from './change-log-item/change-log-item.component';
import { MessageService } from 'primeng/components/common/messageservice';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';


@NgModule({
  declarations: [
    AppComponent,
    ChangeListComponent,
    TopNavbarComponent,
    LeftNavbarComponent,
    ProgramListComponent,
    ConfigEditorComponent,
    ChangeLogItemComponent,
    SafeHtmlPipe
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
    HttpClientModule,
    InputTextModule, 
    DialogModule,
    ButtonModule,
    DropdownModule,
    RouterModule.forRoot(ROUTES, {
      useHash: true,
      onSameUrlNavigation: "reload",
    })
  ],
  providers: [ConfigService, NavbarService, ChangeLogService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
