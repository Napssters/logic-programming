import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

declare global {
  interface Window {
    process?: any;
    require?: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router) { }

  /**
   * Detecta si la aplicación está corriendo en Electron
   */
  private isElectron(): boolean {
    return !!(
      (window && window.process && window.process.type) ||
      (window && window.require) ||
      (typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('electron') > -1) ||
      (window.location.protocol === 'file:')
    );
  }

  /**
   * Detecta si está en GitHub Pages
   */
  private isGitHubPages(): boolean {
    return window.location.hostname === 'napssters.github.io';
  }

  /**
   * Detecta si está en desarrollo local
   */
  private isLocalDevelopment(): boolean {
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  }

  /**
   * Navega a una ruta de forma inteligente según el entorno
   */
  navigateTo(route: string): void {
    console.log('Environment check:', {
      isElectron: this.isElectron(),
      isGitHubPages: this.isGitHubPages(),
      isLocalDevelopment: this.isLocalDevelopment(),
      protocol: window.location.protocol,
      hostname: window.location.hostname
    });

    if (this.isElectron()) {
      // En Electron usar Angular Router (SPA)
      console.log('Using Angular Router for Electron:', route);
      this.router.navigate([route]);
    } else if (this.isGitHubPages()) {
      // En GitHub Pages usar window.location con ruta completa
      const fullRoute = `/logic-programming${route}`;
      console.log('Using window.location for GitHub Pages:', fullRoute);
      window.location.href = fullRoute;
    } else {
      // En desarrollo local usar Angular Router
      console.log('Using Angular Router for local development:', route);
      this.router.navigate([route]);
    }
  }
}
