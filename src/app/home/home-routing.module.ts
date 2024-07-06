import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { StartPageComponent } from './start-page/start-page.component';
import { SolucionCreativaComponent } from './modulos/solucion-creativa/solucion-creativa.component';
import { TomaDecisionesComponent } from './modulos/toma-decisiones/toma-decisiones.component';
import { PensamientoLogicoComponent } from './modulos/pensamiento-logico/pensamiento-logico.component';
import { AbstraccionComponent } from './modulos/abstraccion/abstraccion.component';
import { ModularidadComponent } from './modulos/modularidad/modularidad.component';
import { BuclesComponent } from './modulos/bucles/bucles.component';
import { CondicionalesComponent } from './modulos/condicionales/condicionales.component';
import { ConceptoVariablesComponent } from './modulos/concepto-variables/concepto-variables.component';
import { IntroduccionComponent } from './modulos/introduccion/introduccion.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'inicio',
        component: StartPageComponent,
      },
      {
        path: 'introduccion',
        component: IntroduccionComponent,
      },
      {
        path: 'concepto-variables',
        component: ConceptoVariablesComponent,
      },
      {
        path: 'condicionales',
        component: CondicionalesComponent,
      },
      {
        path: 'bucles',
        component: BuclesComponent,
      },
      {
        path: 'modularidad',
        component: ModularidadComponent,
      },
      {
        path: 'abstraccion',
        component: AbstraccionComponent,
      },
      {
        path: 'pensamiento-logico',
        component: PensamientoLogicoComponent,
      },
      {
        path: 'toma-de-decisiones',
        component: TomaDecisionesComponent,
      },
      {
        path: 'solucion-creativa',
        component: SolucionCreativaComponent,
      },
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
