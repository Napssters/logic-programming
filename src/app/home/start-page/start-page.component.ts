import { Component, OnInit, Type } from '@angular/core';
import { CardsComponent } from '../../shared/components/cards/cards.component';
import { Router } from '@angular/router';
import { NavigationService } from '../../shared/services/navigation.service';
import StartPage from 'src/assets/jsons-base/start-page.json';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.css']
})


export class StartPageComponent implements OnInit {
  cards: any[] = [];
  showModal: boolean = false;
  modalComponentType: Type<any> = CardsComponent;
  modalTitle: string = 'Módulos disponibles';

  constructor(
    private router: Router,
    private navigationService: NavigationService
  ) { }

  public redirigir(vista: string) {
    this.navigationService.navigateTo(vista);
  }

  ngOnInit(): void {
    this.loadData();
  }

  public loadData(): void {
    this.cards = StartPage.cards;
  }

  openCardsModal(): void {
    this.showModal = true;
  }

  closeCardsModal(): void {
    this.showModal = false;
  }
}
