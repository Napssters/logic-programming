  // Navegación entre módulos desde el botón flotante
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { ModalService } from './shared/services/modal.service';

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

  constructor(private router: Router, private http: HttpClient, private modalService: ModalService) {}

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

  // Método para ser llamado por navigation-float al hacer click en menú
  openModulesModalFromMenu(): void {
    // Navegar a /home y abrir el modal
    this.router.navigate(['/home']).then(() => {
      setTimeout(() => {
        this.modalService.openModal();
      }, 0);
    });
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

  // Navegación entre módulos desde el botón flotante
  navigateToPreviousModule(): void {
    if (this.currentModuleIndex > 0 && this.allModules.length > 0) {
      const previousModule = this.allModules[this.currentModuleIndex - 1];
      this.router.navigate([previousModule.url]);
    }
  }

  navigateToNextModule(): void {
    if (this.currentModuleIndex < this.allModules.length - 1 && this.allModules.length > 0) {
      const nextModule = this.allModules[this.currentModuleIndex + 1];
      this.router.navigate([nextModule.url]);
    }
  }
}
