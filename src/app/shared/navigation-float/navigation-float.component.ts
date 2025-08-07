import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navigation-float',
  templateUrl: './navigation-float.component.html',
  styleUrls: ['./navigation-float.component.css']
})
export class NavigationFloatComponent {
  @Input() currentModuleIndex: number = 0;
  @Input() modules: any[] = [];
  @Output() menuClicked = new EventEmitter<void>();
  @Output() previousClicked = new EventEmitter<void>();
  @Output() nextClicked = new EventEmitter<void>();

  isExpanded = false;

  // No Router needed, navigation handled by parent via Output event

  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
    console.log('Toggle expanded:', this.isExpanded);
  }

  onPrevious() {
    console.log('Previous clicked, current index:', this.currentModuleIndex);
    if (this.currentModuleIndex > 0) {
      this.previousClicked.emit();
    }
  }

  onNext() {
    console.log('Next clicked, current index:', this.currentModuleIndex, 'total:', this.modules.length);
    if (this.currentModuleIndex < this.modules.length - 1) {
      this.nextClicked.emit();
    }
  }

  onMenu() {
    console.log('Menu clicked');
    this.menuClicked.emit();
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
