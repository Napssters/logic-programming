import { Component, OnInit, OnDestroy, Type } from '@angular/core';
import { CardsComponent } from '../../shared/components/cards/cards.component';
import { Router } from '@angular/router';
import { NavigationService } from '../../shared/services/navigation.service';
import { ModalService } from '../../shared/services/modal.service';
import { Subscription } from 'rxjs';
import StartPage from 'src/assets/jsons-base/start-page.json';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.css']
})


export class StartPageComponent implements OnInit, OnDestroy {
  cards: any[] = [];
  showModal: boolean = false;
  modalComponentType: Type<any> = CardsComponent;
  modalTitle: string = 'Módulos disponibles';

  private modalSubscription?: Subscription;

  constructor(
    private router: Router,
    private navigationService: NavigationService,
    private modalService: ModalService
  ) { }

  public redirigir(vista: string) {
    this.navigationService.navigateTo(vista);
  }


  ngOnInit(): void {
    this.loadData();
    this.modalSubscription = this.modalService.onOpenModal().subscribe(() => {
      this.openCardsModal();
    });
  }

  ngOnDestroy(): void {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
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
