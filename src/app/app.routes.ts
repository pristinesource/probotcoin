import { Routes } from '@angular/router';
import { Intro } from './components/intro/intro';
import { Tracker } from './components/tracker/tracker';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/intro',
    pathMatch: 'full'
  },
  {
    path: 'intro',
    component: Intro
  },
  {
    path: 'tracker',
    component: Tracker
  },
  {
    path: '**',
    redirectTo: '/intro'
  }
];
