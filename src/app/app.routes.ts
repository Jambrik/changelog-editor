import { Routes } from '@angular/router';
import { ChangeListComponent } from './change-list/change-list.component';
import { CompactComponent } from './compact/compact.component';
import { ConfigEditorComponent } from './config-editor/config-editor.component';
import { FullScreenComponent } from './full-screen/full-screen.component';
import { NewVersionCreatationComponent } from './new-version-creatation/new-version-creatation.component';
import { ProgramListComponent } from './program-list/program-list.component';


export const ROUTES: Routes = [
  { path: '', component: ProgramListComponent },
  { path: 'program-list', component: ProgramListComponent },
  { path: 'change-list/:program-id/:version/:action/:id', component: ChangeListComponent },
  { path: 'compact/:program-id/:version', component: CompactComponent },
  { path: 'config-editor', component: ConfigEditorComponent },
  { path: 'new-version/:program-id', component: NewVersionCreatationComponent },
  { path: 'full-screen/:program-id/:version', component: FullScreenComponent }
  /*{ path: 'about', component: AboutComponent },
  { path: 'detail', loadChildren: './+detail#DetailModule'},
  { path: 'barrel', loadChildren: './+barrel#BarrelModule'},
  { path: '**',    component: NoContentComponent },*/
];
