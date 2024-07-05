import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.css']
})
export class StartPageComponent {

  constructor(private router: Router) { }

  redirigir(vista: string) {
    switch (vista) {
      case 'vista1':
        this.router.navigate(['/home/crear-db']);
        break;
      case 'vista2':
        this.router.navigate(['/home/crear-tabla']);
        break;
    }
  }
}
