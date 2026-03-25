import { Component, inject, Input,computed } from '@angular/core';
import { SurveyService } from '../../services/survey_service';
import { Survey } from '../../interfaces/survey_interface';

@Component({
  selector: 'app-survey-card-board',
  imports: [],
  templateUrl: './survey-card-board.html',
  styleUrl: './survey-card-board.scss',
})
export class SurveyCardBoard {
  @Input() survey!: Survey;

  surveyService = inject(SurveyService);

  statusText = computed(() => {
    let d = this.surveyService.getDaysLeft(this.survey.endDate);

    if (d > 0) return `Ends in ${d} days`;
    if (d === 0) return `Ends today`;
    return `Expired ${Math.abs(d)} days ago`;
  });
}
