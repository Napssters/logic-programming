import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { MenuComponent } from './menu/menu.component';
import { PrimengModule } from '../primeng/primeng.module';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { DialogComponent } from './dialog/dialog.component';



@NgModule({
  declarations: [
    FooterComponent,
    MenuComponent,
    DialogComponent,
  ],
  imports: [
    CommonModule,
    PrimengModule,
    DialogModule,
    FormsModule,
  ],
  exports: [
    MenuComponent,
    FooterComponent,
    DialogComponent,
  ]
})
export class SharedModule { }
