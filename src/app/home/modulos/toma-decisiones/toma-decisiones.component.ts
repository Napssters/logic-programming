import { Component } from '@angular/core';
import { CarroMascotasGameComponent } from '../../../shared/carro-mascotas-game/carro-mascotas-game.component';

@Component({
  selector: 'app-toma-decisiones',
  templateUrl: './toma-decisiones.component.html',
  styleUrls: ['./toma-decisiones.component.css']
})
export class TomaDecisionesComponent {
  selectedSection = 1;
}
