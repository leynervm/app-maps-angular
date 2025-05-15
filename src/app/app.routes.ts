import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: 'fullscreen',
    title: 'Mapa Patalla Completa',
    loadComponent: () =>
      import('./pages/full-screen-page/full-screen-page.component')
  },
  {
    path: 'markers',
    title: 'Marcadores',
    loadComponent: () => import('./pages/markers-page/markers-page.component')
  },
  {
    path: 'houses',
    title: 'Propiedades Disponibles',
    loadComponent: () => import('./pages/houses-page/houses-page.component')
  },
  {
    path: '**',
    redirectTo: 'fullscreen'
  }
]
