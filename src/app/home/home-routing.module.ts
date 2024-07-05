import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { StartPageComponent } from './start-page/start-page.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'inicio',
        component: StartPageComponent,
      },
      /*{
        path: 'crear-db',
        component: CrearDbComponent,
      },*/
      {
        path: '**',
        redirectTo: 'inicio'
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes),
    CommonModule],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
