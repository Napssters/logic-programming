import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import StartPage from 'src/assets/jsons-base/start-page.json';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.css']
})
export class StartPageComponent implements OnInit {

  cards: any[] = [];
  isFlipped: boolean = false;

  constructor(private router: Router) { }

  public redirigir(vista: string) {
    window.location.href = vista;
  }

  ngOnInit(): void {
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
