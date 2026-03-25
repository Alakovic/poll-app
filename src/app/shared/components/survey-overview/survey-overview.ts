import { Component, inject,computed } from '@angular/core';
import { SurveyService } from '../../services/survey_service';
import { SurveyCardBoard } from '../survey-card-board/survey-card-board';
import { SurveyCategory } from '../../types/category_types';

@Component({
  selector: 'app-survey-overview',
  imports: [SurveyCardBoard],
  templateUrl: './survey-overview.html',
  styleUrl: './survey-overview.scss',
})
export class SurveyOverview {
  surveyService = inject(SurveyService);
  surveys = this.surveyService.surveyList;
  categories = this.surveyService.categories;

  open: boolean = false;
  selectedCategory: SurveyCategory | null = null;
  activeStatus: 'active' | 'past' = 'active';

  selectCategory(cat: SurveyCategory | null) {
    this.surveyService.selectedCategory.set(cat);
    this.open = false;
  }

  setStatus(status: 'active' | 'past') {
    this.activeStatus = status;
  }

}
