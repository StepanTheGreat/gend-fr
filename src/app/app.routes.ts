import { Routes } from '@angular/router';

import { IndexPage } from './index/index/index.page';
import { SettingsPage } from './settings/settings/settings.page';

export const routes: Routes = [
  {
    path: "", component: IndexPage,
  },
  {
    path: 'settings', component: SettingsPage
  },
];
