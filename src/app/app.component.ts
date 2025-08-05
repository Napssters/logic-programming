import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

interface ModuleCard {
  title: string;
  description: string;
  image: string;
  url: string;
  color: string;
}

interface StartPageData {
  cards: ModuleCard[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'logic-programming';
  showFloatingButton = false;
  allModules: ModuleCard[] = [];
  currentModuleIndex = -1;
  private routerSubscription?: Subscription;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.loadModules();
    this.setupRouterListener();
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  loadModules(): void {
    this.http.get<StartPageData>('assets/jsons-base/start-page.json').subscribe({
      next: (data) => {
        this.allModules = data.cards;
        console.log('App: Modules loaded:', this.allModules.length);
      },
      error: (error) => {
        console.error('App: Error cargando módulos:', error);
      }
    });
  }

  setupRouterListener(): void {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateFloatingButtonVisibility(event.url);
      });

    // También verificar la ruta inicial
    this.updateFloatingButtonVisibility(this.router.url);
  }

  updateFloatingButtonVisibility(url: string): void {
    console.log('Current URL:', url);

    // Ocultar en la página principal (/home y /home/inicio)
    if (url === '/home' || url === '/home/inicio' || url === '/') {
      this.showFloatingButton = false;
      this.currentModuleIndex = -1;
      return;
    }

    // Mostrar en todas las demás páginas de módulos
    if (url.startsWith('/home/') && this.allModules.length > 0) {
      this.showFloatingButton = true;
      this.findCurrentModuleIndex(url);
    } else {
      this.showFloatingButton = false;
    }
  }

  findCurrentModuleIndex(url: string): void {
    // Extraer la parte de la ruta después de /home/
    const routePart = url.replace('/home/', '');

    // Buscar el módulo que coincida con la ruta actual
    const moduleIndex = this.allModules.findIndex(module =>
      module.url.includes(routePart)
    );

    this.currentModuleIndex = moduleIndex !== -1 ? moduleIndex : 0;
    console.log('Current module index:', this.currentModuleIndex, 'for route:', routePart);
  }
}
