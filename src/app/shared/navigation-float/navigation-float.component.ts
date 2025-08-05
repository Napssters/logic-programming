import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-float',
  templateUrl: './navigation-float.component.html',
  styleUrls: ['./navigation-float.component.css']
})
export class NavigationFloatComponent {
  @Input() currentModuleIndex: number = 0;
  @Input() modules: any[] = [];

  isExpanded = false;

  constructor(private router: Router) {}

  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
    console.log('Toggle expanded:', this.isExpanded);
  }

  onPrevious() {
    console.log('Previous clicked, current index:', this.currentModuleIndex);
    if (this.currentModuleIndex > 0) {
      const previousModule = this.modules[this.currentModuleIndex - 1];
      console.log('Navigating to previous module:', previousModule.url);
      this.router.navigate([previousModule.url]);
    }
  }

  onNext() {
    console.log('Next clicked, current index:', this.currentModuleIndex, 'total:', this.modules.length);
    if (this.currentModuleIndex < this.modules.length - 1) {
      const nextModule = this.modules[this.currentModuleIndex + 1];
      console.log('Navigating to next module:', nextModule.url);
      this.router.navigate([nextModule.url]);
    }
  }

  onMenu() {
    console.log('Menu clicked');
    this.router.navigate(['/home']);
  }

  get canGoPrevious(): boolean {
    return this.currentModuleIndex > 0;
  }

  get canGoNext(): boolean {
    return this.currentModuleIndex < this.modules.length - 1;
  }

  get totalModules(): number {
    return this.modules.length;
  }
}
