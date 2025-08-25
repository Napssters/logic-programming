import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { BlocklyService } from '../services/blockly.service';
import { BlocklyExercise } from '../interfaces/blockly.interface';
import * as Blockly from 'blockly';

@Component({
  selector: 'app-blockly-exercise',
  templateUrl: './blockly-exercise.component.html',
  styleUrls: ['./blockly-exercise.component.css']
})
export class BlocklyExerciseComponent implements OnInit, OnDestroy, AfterViewInit {
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    if (this.showGifModal) {
      this.showGifModal = false;
      event.preventDefault();
    }
  }
  showGifModal: boolean = false;

  @ViewChild('blocklyDiv', { static: false }) blocklyDiv!: ElementRef;
  @Input() exercises: BlocklyExercise[] = [];
  @Input() urlgif: string = '';
  @Input() currentExerciseIndex: number = 0;
  @Output() exerciseCompleted = new EventEmitter<{ exerciseId: string, success: boolean }>();
  @Output() nextExercise = new EventEmitter<void>();
  @Output() previousExercise = new EventEmitter<void>();

  workspace: Blockly.WorkspaceSvg | null = null;
  showSuccess = false;
  showError = false;
  currentMessage = '';
  isValidating = false;

  // Propiedades para modales de variables
  showCreateVariableModal = false;
  showRenameVariableModal = false;
  showDeleteVariableModal = false;
  newVariableName = '';
  currentVariableName = '';
  private currentVariableCallback: ((name: string) => void) | null = null;
  onCancelDeleteVariable: (() => void) | null = null;

  constructor(private blocklyService: BlocklyService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeBlockly();
    }, 100);
  }

  ngOnDestroy() {
  this.blocklyService.dispose();
  this.hideSolutionToast();
  }

  get currentExercise(): BlocklyExercise | null {
    return this.exercises[this.currentExerciseIndex] || null;
  }

  get canGoPrevious(): boolean {
    return this.currentExerciseIndex > 0;
  }

  get canGoNext(): boolean {
    return this.currentExerciseIndex < this.exercises.length - 1;
  }

  initializeBlockly() {
    if (this.blocklyDiv && this.blocklyDiv.nativeElement) {
      this.workspace = this.blocklyService.initializeWorkspace(this.blocklyDiv.nativeElement);
      this.blocklyService.setupCallbacks(this);
      this.blocklyService.setupCustomDialogs(this);
      console.log('Blockly workspace initialized with custom dialogs');

      // Forzar ocultamiento de scrollbars después de la inicialización
      setTimeout(() => {
        this.hideBlocklyScrollbars();
      }, 100);

      // Escuchar cambios en el workspace para ocultar scrollbars
      if (this.workspace) {
        this.workspace.addChangeListener(() => {
          setTimeout(() => {
            this.hideBlocklyScrollbars();
          }, 50);
        });
      }
    }
  }

  private hideBlocklyScrollbars() {
    const blocklyContainer = this.blocklyDiv?.nativeElement;
    if (blocklyContainer) {
      // Ocultar todos los elementos de scrollbar de Blockly
      const scrollElements = blocklyContainer.querySelectorAll(
        '.blocklyScrollbarHandle, .blocklyScrollbarBackground, .blocklyScrollbarVertical, .blocklyScrollbarHorizontal'
      );
      scrollElements.forEach((element: Element) => {
        (element as HTMLElement).style.display = 'none';
        (element as HTMLElement).style.visibility = 'hidden';
      });

      // Forzar overflow hidden en todos los elementos hijos
      const allElements = blocklyContainer.querySelectorAll('*');
      allElements.forEach((element: Element) => {
        (element as HTMLElement).style.overflow = 'hidden';
      });
    }
  }

  validateSolution() {
    if (!this.currentExercise) return;

    this.isValidating = true;
    this.showSuccess = false;
    this.showError = false;

    // Validación con código real de Blockly
    setTimeout(() => {
      const userCode = this.blocklyService.generateCode();
      console.log('Código generado por el usuario:', userCode);
      console.log('Código esperado:', this.currentExercise!.expectedCode);

      // Validación real
      const isCorrect = this.blocklyService.validateCode(userCode, this.currentExercise!.expectedCode);
      console.log('¿Es correcto?', isCorrect);

      if (isCorrect) {
        this.showSuccessMessage();
        this.exerciseCompleted.emit({
          exerciseId: this.currentExercise!.id,
          success: true
        });
      } else {
        this.showErrorMessage();
        this.exerciseCompleted.emit({
          exerciseId: this.currentExercise!.id,
          success: false
        });
      }

      this.isValidating = false;
    }, 1000);
  }

  private generateCodeFromBlocks(): string {
    return this.blocklyService.generateCode();
  }

  private compareCode(userCode: string, expectedCode: string): boolean {
    return this.blocklyService.validateCode(userCode, expectedCode);
  }

  private showSuccessMessage() {
    this.showSuccess = true;
    this.currentMessage = '¡Excelente! Has completado el ejercicio correctamente. 🎉';

    setTimeout(() => {
      this.showSuccess = false;
    }, 3000);
  }

  private showErrorMessage() {
    this.showError = true;
    this.currentMessage = 'La solución no es correcta. Revisa las instrucciones e inténtalo de nuevo. 💪';

    setTimeout(() => {
      this.showError = false;
    }, 3000);
  }

  onPreviousExercise() {
    if (this.canGoPrevious) {
      // Limpiar la pantalla antes de cambiar de ejercicio
      this.resetWorkspace();
      this.previousExercise.emit();
    }
  }

  onNextExercise() {
    if (this.canGoNext) {
      // Limpiar la pantalla antes de cambiar de ejercicio
      this.resetWorkspace();
      this.nextExercise.emit();
    }
  }

  resetWorkspace() {
    // Limpiar el workspace de Blockly
    this.blocklyService.clearWorkspace();

    // Ocultar todos los mensajes de estado
    this.showSuccess = false;
    this.showError = false;
    this.isValidating = false;

    // Ocultar todos los modales de variables
    this.showCreateVariableModal = false;
    this.showRenameVariableModal = false;
    this.showDeleteVariableModal = false;

    // Limpiar variables temporales
    this.newVariableName = '';
    this.currentVariableName = '';
    this.currentVariableCallback = null;
    this.onCancelDeleteVariable = null;

    // Ocultar toast de solución
    this.hideSolutionToast();

    // Forzar ocultamiento de scrollbars después del reset
    setTimeout(() => {
      this.hideBlocklyScrollbars();
    }, 100);
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'easy': return '#10B981'; // Verde
      case 'medium': return '#F59E0B'; // Amarillo
      case 'hard': return '#EF4444'; // Rojo
      default: return '#6B7280'; // Gris
    }
  }

  getDifficultyBorderColor(difficulty: string): string {
    switch (difficulty) {
      case 'easy': return '#047857'; // Verde oscuro
      case 'medium': return '#D97706'; // Amarillo oscuro
      case 'hard': return '#DC2626'; // Rojo oscuro
      default: return '#4B5563'; // Gris oscuro
    }
  }

  getDifficultyText(difficulty: string): string {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Intermedio';
      case 'hard': return 'Difícil';
      default: return 'Normal';
    }
  }

  // Métodos para crear variable
  showCreateVariableDialog(callback: (name: string) => void) {
    this.currentVariableCallback = callback;
    this.newVariableName = '';
    this.showCreateVariableModal = true;
    setTimeout(() => {
      const input = document.getElementById('variableNameInput') as HTMLInputElement;
      input?.focus();
    }, 100);
  }

  confirmCreateVariable() {
    const name = this.newVariableName.trim();
    console.log('Intentando crear variable:', name);

    if (name && this.currentVariableCallback) {
      console.log('Ejecutando callback para crear variable');
      this.currentVariableCallback(name);

      // Dar tiempo para que se actualice el workspace
      setTimeout(() => {
        console.log('Variables en workspace después de crear:', this.getWorkspaceVariables());
      }, 500);

      this.cancelCreateVariable();
    } else {
      console.log('No se puede crear variable - nombre vacío o callback nulo');
    }
  }

  // Método auxiliar para debug - obtener variables del workspace
  private getWorkspaceVariables(): string[] {
    if (this.workspace) {
      return this.workspace.getAllVariables().map(v => v.getName());
    }
    return [];
  }

  cancelCreateVariable() {
    this.showCreateVariableModal = false;
    this.newVariableName = '';
    this.currentVariableCallback = null;
  }

  // Métodos para renombrar variable
  showRenameVariableDialog(currentName: string, callback: (name: string) => void) {
    this.currentVariableName = currentName;
    this.currentVariableCallback = callback;
    this.newVariableName = currentName;
    this.showRenameVariableModal = true;
    setTimeout(() => {
      const input = document.getElementById('renameVariableInput') as HTMLInputElement;
      input?.focus();
      input?.select();
    }, 100);
  }

  confirmRenameVariable() {
    const name = this.newVariableName.trim();
    if (name && this.currentVariableCallback) {
      this.currentVariableCallback(name);
      this.cancelRenameVariable();
    }
  }

  cancelRenameVariable() {
    this.showRenameVariableModal = false;
    this.newVariableName = '';
    this.currentVariableName = '';
    this.currentVariableCallback = null;
  }

  // Métodos para eliminar variable
  showDeleteVariableDialog(variableName: string, callback: () => void) {
    this.currentVariableName = variableName;
    this.currentVariableCallback = callback as any;
    this.showDeleteVariableModal = true;
  }

  confirmDeleteVariable() {
    if (this.currentVariableCallback) {
      (this.currentVariableCallback as any)();
      this.cancelDeleteVariable();
    }
  }

  cancelDeleteVariable() {
    this.showDeleteVariableModal = false;
    this.currentVariableName = '';
    this.currentVariableCallback = null;
    // Llamar al callback de cancelación si existe
    if (this.onCancelDeleteVariable) {
      this.onCancelDeleteVariable();
      this.onCancelDeleteVariable = null;
    }
  }

  // Toast and solution preview state
  showSolutionToast = false;
  solutionToastTimeout: any = null;
  solutionPreviewWorkspace: Blockly.WorkspaceSvg | null = null;

  showHelpIdea() {
    this.showSolutionPreview();
  }

  showSolutionPreview() {
    if (!this.currentExercise) return;
    this.showSolutionToast = true;
    clearTimeout(this.solutionToastTimeout);
    this.renderSolutionBlocks(this.currentExercise.expectedCode);
    // Hide toast after 5 seconds unless mouse stays over
    this.solutionToastTimeout = setTimeout(() => {
      this.hideSolutionToast();
    }, 5000);
  }

  hideSolutionToast() {
    this.showSolutionToast = false;
    clearTimeout(this.solutionToastTimeout);
    // Dispose preview workspace if exists
    if (this.solutionPreviewWorkspace) {
      this.solutionPreviewWorkspace.dispose();
      this.solutionPreviewWorkspace = null;
    }
  }

  keepSolutionToast() {
    clearTimeout(this.solutionToastTimeout);
    // Keep toast open while mouse is over
    this.solutionToastTimeout = setTimeout(() => {
      this.hideSolutionToast();
    }, 5000);
  }

  renderSolutionBlocks(expectedCode: string) {
    // Find the toast container and render Blockly blocks
    setTimeout(() => {
      const toastDiv = document.getElementById('solutionToastBlocklyDiv');
      if (toastDiv) {
        // Dispose previous workspace
        if (this.solutionPreviewWorkspace) {
          this.solutionPreviewWorkspace.dispose();
        }
        // Parse code to Blockly XML
        const xmlText = this.parseExpectedCodeToBlocklyXml(expectedCode);
        // Use DOMParser for XML string to DOM
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, 'text/xml');
        this.solutionPreviewWorkspace = Blockly.inject(toastDiv, {
          readOnly: true,
          scrollbars: false,
          media: 'media/',
          renderer: 'zelos',
        });
        Blockly.Xml.domToWorkspace(xml.documentElement, this.solutionPreviewWorkspace);
      }
    }, 100);
  }

  parseExpectedCodeToBlocklyXml(expectedCode: string): string {
  // Usa el servicio para convertir el código JS a bloques Blockly
  return this.blocklyService.codeToBlocksXml(expectedCode);
  }
}
