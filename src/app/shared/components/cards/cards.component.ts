import { Component, Input } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent {
  @Input() cards: any[] = [];

  constructor(private navigationService: NavigationService) {}

  public redirigir(vista: string) {
    this.navigationService.navigateTo(vista);
  }
}
