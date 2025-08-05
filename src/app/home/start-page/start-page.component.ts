import { Component, OnInit } from '@angular/core';
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
  isFlipped: boolean = false;

  constructor(
    private router: Router,
    private navigationService: NavigationService
  ) { }

  public redirigir(vista: string) {
    this.navigationService.navigateTo(vista);
  }  ngOnInit(): void {
    this.loadData();
  }

  public loadData(): void {
    this.cards = StartPage.cards.map(card => ({ ...card, isFlipped: false }));
  }

  onMouseOver(index: number) {
    this.cards[index].isFlipped = true;
  }

  onMouseOut(index: number) {
    this.cards[index].isFlipped = false;
  }
}
