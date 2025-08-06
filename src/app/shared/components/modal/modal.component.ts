import { Component, ComponentRef, ViewChild, ViewContainerRef, Input, Output, EventEmitter, OnDestroy, Type, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnDestroy, OnChanges {
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef })
  dynamicComponentContainer!: ViewContainerRef;

  @Input() isVisible: boolean = false;
  @Input() title: string = '';
  @Input() componentType: Type<any> | null = null;
  @Input() componentInputs: any = {};
  @Input() maxWidth: string = 'max-w-4xl';
  @Input() maxHeight: string = 'max-h-[90vh]';

  @Output() onClose = new EventEmitter<void>();

  private componentRef: ComponentRef<any> | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible'] && this.isVisible && this.componentType) {
      // Pequeño delay para asegurar que el ViewChild esté disponible
      setTimeout(() => {
        this.loadComponent();
      }, 0);
    }
  }

  ngOnDestroy(): void {
    this.destroyComponent();
  }

  private loadComponent(): void {
    if (!this.dynamicComponentContainer || !this.componentType) {
      return;
    }

    // Limpiar componente anterior si existe
    this.destroyComponent();

    // Crear el nuevo componente
    this.componentRef = this.dynamicComponentContainer.createComponent(this.componentType);

    // Asignar inputs al componente
    if (this.componentInputs) {
      Object.keys(this.componentInputs).forEach(key => {
        if (this.componentRef?.instance.hasOwnProperty(key)) {
          this.componentRef.instance[key] = this.componentInputs[key];
        }
      });
    }

    // Detectar cambios
    this.componentRef.changeDetectorRef.detectChanges();
  }

  private destroyComponent(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
    if (this.dynamicComponentContainer) {
      this.dynamicComponentContainer.clear();
    }
  }

  closeModal(): void {
    this.onClose.emit();
  }

  onBackdropClick(event: Event): void {
    this.closeModal();
  }

  onModalContentClick(event: Event): void {
    event.stopPropagation();
  }
}
