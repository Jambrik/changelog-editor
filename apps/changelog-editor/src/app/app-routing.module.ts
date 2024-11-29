import { Routes } from '@angular/router';


export const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('@changelog-editor/feature/program-list').then(m => m.routes)
  },
  {
    path: 'program-list',
    loadChildren: () => import('@changelog-editor/feature/program-list').then(m => m.routes)
  },
  {
    path: 'change-list/:program-id/:version/:action/:id',
    loadChildren: () => import('@changelog-editor/feature/change-list').then(m => m.routes)
  },
  {
    path: 'compact/:program-id/:version',
    loadChildren: () => import('@changelog-editor/feature/compact').then(m => m.routes)
  },
  {
    path: 'config-editor',
    loadChildren: () => import('@changelog-editor/feature/config-editor').then(m => m.routes)
  },
  {
    path: 'new-version/:program-id',
    loadChildren: () => import('@changelog-editor/feature/new-version-creation').then(m => m.routes)
  },
  {
    path: 'full/:program-id/:version',
    loadChildren: () => import('@changelog-editor/feature/full').then(m => m.routes)
  }
  /*{ path: 'about', component: AboutComponent },
  { path: 'detail', loadChildren: './+detail#DetailModule'},
  { path: 'barrel', loadChildren: './+barrel#BarrelModule'},
  { path: '**',    component: NoContentComponent },*/
];
