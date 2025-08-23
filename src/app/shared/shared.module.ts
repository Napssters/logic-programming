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
import { CardsComponent } from './components/cards/cards.component';
import { CardTitleFormatPipe } from './pipes/card-title-format.pipe';
import { ExtractTipoPipe } from './pipes/extract-tipo.pipe';
import { TutorialComponent } from './components/tutorial/tutorial.component';
import { PuzzleComponent } from './components/puzzle/puzzle.component';

import { GameQuestionSelectionComponent } from './components/ejercicios/game-question-selection.component';
import { CarroMascotasGameComponent } from './carro-mascotas-game/carro-mascotas-game.component';



@NgModule({
  declarations: [
    FooterComponent,
    MenuComponent,
    DialogComponent,
    NavigationFloatComponent,
    FlowchartComponent,
    BlocklyExerciseComponent,
    ModalComponent,
    CardsComponent,
    CardTitleFormatPipe,
    ExtractTipoPipe,
    TutorialComponent,
    PuzzleComponent,
  GameQuestionSelectionComponent,
  CarroMascotasGameComponent
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
    CardsComponent,
    CardTitleFormatPipe,
    TutorialComponent,
    PuzzleComponent,
  GameQuestionSelectionComponent,
  CarroMascotasGameComponent
  ]
})
export class SharedModule { }
