import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { MenuComponent } from './menu/menu.component';
import { PrimengModule } from '../primeng/primeng.module';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { DialogComponent } from './dialog/dialog.component';
import { NavigationFloatComponent } from './navigation-float/navigation-float.component';
import { FlowchartComponent } from './components/flowchart/flowchart.component';
import { BlocklyExerciseComponent } from './blockly-exercise/blockly-exercise.component';
import { ModalComponent } from './components/modal/modal.component';



@NgModule({
  declarations: [
    FooterComponent,
    MenuComponent,
    DialogComponent,
    NavigationFloatComponent,
    FlowchartComponent,
    BlocklyExerciseComponent,
    ModalComponent,
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
    NavigationFloatComponent,
    FlowchartComponent,
    BlocklyExerciseComponent,
    ModalComponent,
  ]
})
export class SharedModule { }
