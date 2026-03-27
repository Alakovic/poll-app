import { Answer, Question } from '../interfaces/survey_interface';

export class QuestionModel implements Question {
  id: number;
  survey_id: number;
  title: string;
  answers:  Answer[];
  allow_multiple: boolean;

  constructor(data: Partial<Question> = {}) {
    this.id = data.id ?? 0;
    this.survey_id = data.survey_id ?? 0;
    this.title = data.title ?? '';
    this.answers = data.answers ?? [];
    this.allow_multiple = data.allow_multiple ?? false;
  }

  getCleanQuestionJson(surveyId: number) {
    return {
      surveyId: surveyId,
      title: this.title,
      allow_multiple: this.allow_multiple,
    };
  }
}
