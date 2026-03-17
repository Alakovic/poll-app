import { Component, Input, inject } from '@angular/core';
import { Survey } from '../../interfaces/survey_interface';
import { SurveyService } from '../../services/survey_service';


@Component({
  selector: 'app-survey-card',
  standalone: true,
  imports: [],
  templateUrl: './survey-card.html',
  styleUrls: ['./survey-card.scss'],
})
export class SurveyCard {
  @Input() survey!: Survey;

  surveyService = inject(SurveyService);
}
