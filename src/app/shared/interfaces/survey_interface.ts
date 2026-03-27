import { SurveyCategory } from '../types/category_types';

export interface Survey {
  id: number;
  title: string;
  description: string;
  category: SurveyCategory;
  endDate?: Date | string;
  questions: Question[];
}

export interface Question {
  id: number;
  survey_id: number;
  title: string;
  answers: Answer[];
  allow_multiple: boolean;
}

export interface Answer {
  id: number;
  text: string;
  votesCount: number;
  question_id: number;
}
