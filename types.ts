export enum ContentTemplate {
  LESSON_PLAN = 'LESSON_PLAN',
  STUDY_GUIDE = 'STUDY_GUIDE',
  QUIZ = 'QUIZ',
  FLASHCARDS = 'FLASHCARDS',
  CONCEPT_SIMPLIFIER = 'CONCEPT_SIMPLIFIER',
}

export enum Complexity {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
}

export enum ContentLength {
  SHORT = 'Short',
  MEDIUM = 'Medium',
  LONG = 'Long',
}

export interface GenerationParams {
  topic: string;
  subject: string;
  gradeLevel: string;
  template: ContentTemplate;
  complexity: Complexity;
  length: ContentLength;
  additionalInstructions?: string;
  includeExplanations?: boolean;
}

export interface PerformanceMetrics {
  durationMs: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCost: number; // In USD, approximated
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizData {
  questions: QuizQuestion[];
}

export interface GeneratedContent {
  id: string;
  params: GenerationParams;
  content: string; // Markdown text
  imageUrl?: string; // Base64 or URL
  quizData?: QuizData;
  timestamp: number;
  metrics: PerformanceMetrics;
}

export interface TemplateConfig {
  id: ContentTemplate;
  label: string;
  description: string;
  systemPrompt: string;
  userPromptTemplate: (params: GenerationParams) => string;
}

export interface SampleContent {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  params: GenerationParams;
  content: string;
}

export interface PromptComparison {
  id: string;
  scenario: string;
  iterations: {
    version: string;
    promptSnippet: string;
    outcome: string;
    qualityScore: number; // 1-5
  }[];
  insight: string;
}