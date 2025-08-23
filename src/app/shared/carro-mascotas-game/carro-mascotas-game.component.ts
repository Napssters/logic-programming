import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-carro-mascotas-game',
  templateUrl: './carro-mascotas-game.component.html',
  styleUrls: ['./carro-mascotas-game.component.css']
})
export class CarroMascotasGameComponent {
  @Input() tipoHijo: 1 | 2 = 1;
}
