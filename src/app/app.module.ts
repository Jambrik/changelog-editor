import { ROUTES } from './app.routes';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { InputTextModule, ButtonModule, DataTableModule, DialogModule, DropdownModule }  from 'primeng/primeng';
import { ChanegeListComponent } from './chanege-list/chanege-list.component';
import { AppComponent } from './app.component';
import { TopNavbarComponent } from './top-navbar/top-navbar.component';
import { LeftNavbarComponent } from './left-navbar/left-navbar.component';
import { ProgramListComponent } from './program-list/program-list.component';
import { ConfigEditorComponent } from './config-editor/config-editor.component';
import {HttpClientModule} from '@angular/common/http';
import { ConfigService } from './services/config.service';
import { NavbarService } from './services/navbar.service';
import { ChangeLogService } from './services/change-log.service';


@NgModule({
  declarations: [
    AppComponent,
    ChanegeListComponent,
    TopNavbarComponent,
    LeftNavbarComponent,
    ProgramListComponent,
    ConfigEditorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    DataTableModule,
    HttpClientModule,
    InputTextModule, 
    DialogModule,
    ButtonModule,
    DropdownModule,
    RouterModule.forRoot(ROUTES, {
      useHash: true})
  ],
  providers: [ConfigService, NavbarService, ChangeLogService],
  bootstrap: [AppComponent]
})
export class AppModule { }
