import { Injectable } from '@angular/core';

declare global {
  interface Window {
    process?: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  constructor() { }

  /**
   * Detecta si la aplicación está corriendo en Electron
   */
  isElectron(): boolean {
    // Múltiples formas de detectar Electron
    return !!(
      (window && window.process && window.process.type) ||
      (window && (window as any).require) ||
      (typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('electron') > -1)
    );
  }

  /**
   * Detecta si está en GitHub Pages
   */
  isGitHubPages(): boolean {
    return window.location.hostname === 'napssters.github.io';
  }

  /**
   * Obtiene la base path correcta según el entorno
   */
  getBasePath(): string {
    if (this.isElectron()) {
      return '/';
    } else if (this.isGitHubPages()) {
      return '/logic-programming/';
    } else {
      return '/'; // Para desarrollo local
    }
  }

  /**
   * Construye una ruta completa según el entorno
   */
  buildRoute(route: string): string {
    const basePath = this.getBasePath();
    const cleanRoute = route.startsWith('/') ? route.substring(1) : route;
    return basePath + cleanRoute;
  }
}
