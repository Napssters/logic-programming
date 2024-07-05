import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CardModule } from 'primeng/card';
import { ScrollerModule } from 'primeng/scroller';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { MessagesModule } from 'primeng/messages';
import { DialogModule } from 'primeng/dialog';




@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule
  ],
  exports:[
    ButtonModule,
    MenubarModule,
    AutoCompleteModule,
    CardModule,
    ScrollerModule,
    ScrollPanelModule,
    MessagesModule,
    DialogModule
  ],
})
export class PrimengModule { }
