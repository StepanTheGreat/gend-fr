import { Routes } from '@angular/router';

import { IndexPage } from './index/index-page/index.page';
import { SettingsPage } from './settings/settings-page/settings.page';
import { RegistrationPage } from "src/app/registration/registration-page/registration.page";

export const routes: Routes = [
  {
    path: "", component: IndexPage,
  },
  {
    path: 'settings', component: SettingsPage
  },
  {
    path: 'registration', component: RegistrationPage
  },
];
