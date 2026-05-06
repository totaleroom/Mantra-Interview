export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface ModuleSection {
  id: string;
  title: string;
  content: string; // HTML content
  quiz: QuizQuestion[];
}

export interface ModuleData {
  id: string;
  title: string;
  thesis: string;
  sections: ModuleSection[];
}

// Module content has been migrated to the server database.
// These types are kept for backward compatibility with InterviewSimulator.
