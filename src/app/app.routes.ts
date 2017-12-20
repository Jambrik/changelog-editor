import { ConfigEditorComponent } from './config-editor/config-editor.component';
import { Routes } from '@angular/router';
import { ChangeListComponent } from './change-list/change-list.component';
import { ProgramListComponent } from './program-list/program-list.component';


export const ROUTES: Routes = [
  { path: '',      component: ProgramListComponent },
  { path: 'program-list',      component: ProgramListComponent },
  { path: 'change-list/:program-id/:version',  component: ChangeListComponent },
  { path: 'config-editor',  component: ConfigEditorComponent},
  /*{ path: 'about', component: AboutComponent },
  { path: 'detail', loadChildren: './+detail#DetailModule'},
  { path: 'barrel', loadChildren: './+barrel#BarrelModule'},
  { path: '**',    component: NoContentComponent },*/
];