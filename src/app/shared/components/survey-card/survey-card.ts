import { Component, Input, inject } from '@angular/core';
import { Survey } from '../../interfaces/survey_interface';
import { SurveyService } from '../../services/survey_service';
import { RouterLink } from '@angular/router'; 


@Component({
  selector: 'app-survey-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './survey-card.html',
  styleUrls: ['./survey-card.scss'],
})
export class SurveyCard {
  @Input() survey!: Survey;

  surveyService = inject(SurveyService);
}
