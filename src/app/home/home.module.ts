import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { PrimengModule } from '../primeng/primeng.module';
import { SharedModule } from '../shared/shared.module';
import { StartPageComponent } from './start-page/start-page.component';
import { IntroduccionComponent } from './modulos/introduccion/introduccion.component';
import { ConceptoVariablesComponent } from './modulos/concepto-variables/concepto-variables.component';
import { CondicionalesComponent } from './modulos/condicionales/condicionales.component';
import { BuclesComponent } from './modulos/bucles/bucles.component';
import { ModularidadComponent } from './modulos/modularidad/modularidad.component';
import { AbstraccionComponent } from './modulos/abstraccion/abstraccion.component';
import { PensamientoLogicoComponent } from './modulos/pensamiento-logico/pensamiento-logico.component';
import { TomaDecisionesComponent } from './modulos/toma-decisiones/toma-decisiones.component';
import { SolucionCreativaComponent } from './modulos/solucion-creativa/solucion-creativa.component';



@NgModule({
  declarations: [
    StartPageComponent,
    IntroduccionComponent,
    ConceptoVariablesComponent,
    CondicionalesComponent,
    BuclesComponent,
    ModularidadComponent,
    AbstraccionComponent,
    PensamientoLogicoComponent,
    TomaDecisionesComponent,
    SolucionCreativaComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    PrimengModule,
    SharedModule
  ]
})
export class HomeModule { }
