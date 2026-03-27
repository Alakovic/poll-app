import { computed, Injectable, signal } from '@angular/core';
import { Survey } from '../interfaces/survey_interface';
import { SurveyCategory } from '../types/category_types';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import { SurveyModel } from '../models/surveymodel';
import { QuestionModel } from '../models/questionmodel';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  supabase = createClient(
    'https://xkhifaaddekbpkgsxqhi.supabase.co',
    'sb_publishable_n2CTOVwdc0OkCrsi_An1sA_Lk8dJ0z7',
  );

  surveyList = signal<Survey[]>([]);
  surveyDetail = signal<Survey>({
    id: 0,
    title: '',
    description: '',
    category: 'Team activities',
    endDate: new Date(),
    questions: [],
  });

  selectedCategory = signal<SurveyCategory | null>(null);
  selectedStatus = signal<'active' | 'past'>('active');

  categories: SurveyCategory[] = [
    'Team activities',
    'Health & Wellness',
    'Gaming & Entertainment',
    'Education & Learning',
    'Lifestyle & Preferences',
    'Technology & Innovation',
  ];

  surveyListInsertChannel!: RealtimeChannel;
  surveyDetailInsertChannel!: RealtimeChannel;
  answersInsertChannel!: RealtimeChannel;

  constructor() {
    this.getAllSurveys();
    this.surveyInsertListener();
    this.questionInsertListener();
    this.answerInsertListener();
  }

  surveyInsertListener() {
    this.surveyListInsertChannel = this.supabase
      .channel('surveys-insert-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'surveys' },
        (payload) => {
          let newSurvey = new SurveyModel(payload.new);
          this.surveyList.update((surveys) => [...surveys, newSurvey]);
        },
      )
      .subscribe();
  }

  questionInsertListener() {
    this.surveyDetailInsertChannel = this.supabase
      .channel('questions-insert-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'questions' },
        (payload) => {
          let newQuestion = new QuestionModel(payload.new);
          this.surveyDetail.update((survey) => {
            if (survey.id === payload.new['surveyId']) {
              return {
                ...survey,
                questions: [...survey.questions, newQuestion],
              };
            }
            return survey;
          });
        },
      )
      .subscribe();
  }

  answerInsertListener() {
    this.answersInsertChannel = this.supabase
      .channel('answers-insert-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'answers' },
        (payload) => {
          let questionId = payload.new['questionId'];
          let answerText = payload.new['text'];
          this.surveyDetail.update((survey) => {
            return {
              ...survey,
              questions: survey.questions.map((question) => {
                if (question.id === questionId) {
                  return {
                    ...question,
                    answers: [...question.answers, answerText],
                  };
                }
                return question;
              }),
            };
          });
        },
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.supabase.removeChannel(this.surveyListInsertChannel);
    this.supabase.removeChannel(this.surveyDetailInsertChannel);
    this.supabase.removeChannel(this.answersInsertChannel);
  }

  endingSoonSurveys = computed(() => {
    return this.surveyList().filter((s) => {
      if (!s.endDate) return false;
      let daysLeft = this.getDaysLeft(s.endDate);
      return daysLeft <= 5 && daysLeft >= 0;
    });
  });

  filteredByStatusSurveys = computed(() => {
    let status = this.selectedStatus();
    let cat = this.selectedCategory();
    return this.surveyList().filter((s) => {
      let isActive = s.endDate ? this.getDaysLeft(s.endDate) >= 0 : true;
      if (status === 'active' && !isActive) return false;
      if (status === 'past' && isActive) return false;
      if (cat && s.category !== cat) return false;
      return true;
    });
  });

  getDaysLeft(endDate: any): number {
    if (!endDate) return 0;
    let end = new Date(endDate);
    let today = new Date();
    let diff = end.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  getLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  getNumber(index: number): number {
    return index + 1;
  }

  async getAllSurveys() {
    let response = await this.supabase.from('surveys').select('*');
    if (response.data) {
      this.surveyList.set(response.data as Survey[]);
    }
  }

  async getSurveyWithDetails(id: number) {
    const { data, error } = await this.supabase
      .from('surveys')
      .select(
        `
      *,
      questions (
        *,
        answers (*)
      )
    `,
      )
      .eq('id', id)
      .single();

    if (error) {
      console.error(error);
      return;
    }
    this.surveyDetail.set(data);
  }

  async addSurvey(survey: SurveyModel) {
    let survey_data = survey.getCleanAddJson();
    const { data, error } = await this.supabase
      .from('surveys')
      .insert(survey_data)
      .select()
      .single();
    if (error) {
      console.error(error);
      return;
    }
    let surveyId = data.id;
    for (let question of survey.questions) {
      await this.addQuestion(surveyId, new QuestionModel(question));
    }

    return surveyId;
  }

  async addQuestion(surveyId: number, question: QuestionModel) {
    let question_data = question.getCleanQuestionJson(surveyId);
    const { data, error } = await this.supabase
      .from('questions')
      .insert(question_data)
      .select()
      .single();
    if (error) {
      console.error(error);
      return;
    }
    let questionId = data.id;
    for (let answer of question.answers) {
      await this.addAnswer(questionId, answer?.text ?? answer);
    }
  }

  async addAnswer(questionId: number, text: string) {
    let { error } = await this.supabase.from('answers').insert({
      questionId: questionId,
      text: text,
      votesCount: 0,
    });
    if (error) {
      console.error(error);
    }
  }
}
