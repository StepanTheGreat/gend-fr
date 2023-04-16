import { Routes } from '@angular/router';

import { IndexPage } from './index/index.page';

export const routes: Routes = [
  {
    path: "",
    component: IndexPage,
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.page').then( m => m.SettingsPage)
  },
];
