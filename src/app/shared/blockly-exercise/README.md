# Componente Blockly Exercise

Este componente proporciona una interfaz interactiva de Blockly para crear ejercicios de programación visual. **Componente completamente genérico** que carga ejercicios desde archivos JSON.

## Características

- ✅ **Componente genérico** - No tiene ejercicios hardcodeados
- ✅ **Carga desde JSON** - Ejercicios definidos en `assets/jsons-base/blockly-exercises.json`
- ✅ **Validación automática** de soluciones
- ✅ **Mensajes de éxito/error** con feedback visual
- ✅ **Navegación** entre ejercicios
- ✅ **Niveles de dificultad** (Fácil, Intermedio, Difícil)
- ✅ **Workspace personalizable** con toolbox específico para variables

## Estructura del JSON

### Archivo: `assets/jsons-base/blockly-exercises.json`

```json
{
  "variables": {
    "exercises": [
      {
        "id": "exercise-1",
        "title": "Crear una Variable",
        "description": "Aprende a crear tu primera variable en programación.",
        "instructions": "Crea una variable llamada \"nombre\" y asígnale el valor \"Juan\".",
        "expectedCode": "var nombre = \"Juan\";",
        "difficulty": "easy",
        "category": "variables"
      }
      // ... más ejercicios
    ]
  },
  "bucles": {
    "exercises": [
      // Ejercicios de bucles (para futuros módulos)
    ]
  }
}
```

## Uso del Componente

### 1. En el componente padre (ej: ConceptoVariablesComponent)

```typescript
import { BlocklyExercise, BlocklyExerciseData } from '../../../shared/interfaces/blockly.interface';

export class ConceptoVariablesComponent implements OnInit {
  blocklyExercises: BlocklyExercise[] = [];
  currentBlocklyExerciseIndex: number = 0;

  ngOnInit(): void {
    this.loadBlocklyExercises();
  }

  loadBlocklyExercises(): void {
    this.http.get<BlocklyExerciseData>('assets/jsons-base/blockly-exercises.json').subscribe({
      next: (data) => {
        if (data.variables && data.variables.exercises) {
          this.blocklyExercises = data.variables.exercises;
        }
      }
    });
  }
}
```

### 2. En el template HTML

```html
<app-blockly-exercise
  [exercises]="blocklyExercises"
  [currentExerciseIndex]="currentBlocklyExerciseIndex"
  (exerciseCompleted)="onExerciseCompleted($event)"
  (nextExercise)="onNextBlocklyExercise()"
  (previousExercise)="onPreviousBlocklyExercise()">
</app-blockly-exercise>
```

## Ejercicios Actuales (Variables)

### 1. Crear una Variable (Fácil)
- **Objetivo**: Crear una variable llamada "nombre" con valor "Juan"
- **Bloques necesarios**: Variable Set + Text

### 2. Variable Numérica (Fácil)
- **Objetivo**: Crear una variable llamada "edad" con valor 25
- **Bloques necesarios**: Variable Set + Number

### 3. Operación con Variables (Intermedio)
- **Objetivo**: Crear variables "a" (10) y "b" (5), luego "suma" = a + b
- **Bloques necesarios**: Variable Set + Number + Math Arithmetic

### 4. Variable Booleana (Fácil)
- **Objetivo**: Crear variable "esEstudiante" con valor verdadero
- **Bloques necesarios**: Variable Set + Boolean

### 5. Cambiar Valor de Variable (Intermedio)
- **Objetivo**: Crear "contador" (0), luego cambiar a 1
- **Bloques necesarios**: Variable Set (x2)

### 6. Concatenación de Texto (Intermedio)
- **Objetivo**: Unir "Hola" + " " + "María" en variable "mensaje"
- **Bloques necesarios**: Variable Set + Text + Text Join

### 7. Cálculo Completo (Difícil)
- **Objetivo**: Calcular precio final con descuento
- **Bloques necesarios**: Variable Set (x3) + Number + Math Arithmetic

## Personalización

### Ejercicios Personalizados
```typescript
const misEjercicios: BlocklyExercise[] = [
  {
    id: 'custom-1',
    title: 'Mi Ejercicio',
    description: 'Descripción del ejercicio',
    instructions: 'Instrucciones paso a paso',
    expectedCode: 'var resultado = 42;',
    difficulty: 'easy',
    category: 'variables'
  }
];
```

### Eventos Disponibles
- `exerciseCompleted`: Se dispara cuando se valida una solución
- `nextExercise`: Se dispara al navegar al siguiente ejercicio
- `previousExercise`: Se dispara al navegar al ejercicio anterior

## Integración Actual

El componente está integrado en:
- ✅ `ConceptoVariablesComponent` - Sección de práctica
- ✅ `SharedModule` - Disponible globalmente

## Próximas Mejoras

- [ ] Integración completa con Blockly JavaScript Generator
- [ ] Más categorías de ejercicios (bucles, condicionales)
- [ ] Sistema de puntuación
- [ ] Guardar progreso del usuario
- [ ] Hints/pistas para ejercicios difíciles
