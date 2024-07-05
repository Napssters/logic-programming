import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { PrimengModule } from '../primeng/primeng.module';
import { SharedModule } from '../shared/shared.module';
import { StartPageComponent } from './start-page/start-page.component';



@NgModule({
  declarations: [
    StartPageComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    PrimengModule,
    SharedModule
  ]
})
export class HomeModule { }
