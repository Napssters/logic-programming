export interface BlocklyExercise {
  id: string;
  title: string;
  description: string;
  instructions: string;
  expectedCode: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export interface BlocklyExerciseData {
  variables?: {
    exercises: BlocklyExercise[];
  };
  bucles?: {
    exercises: BlocklyExercise[];
  };
  condicionales?: {
    exercises: BlocklyExercise[];
  };
  funciones?: {
    exercises: BlocklyExercise[];
  };
  // Se pueden agregar más categorías según sea necesario
}
