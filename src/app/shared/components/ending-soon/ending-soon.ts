import { Component,inject } from '@angular/core';
import { SurveyService } from '../../services/survey_service';
import { SurveyCard } from '../survey-card/survey-card';

@Component({
  selector: 'app-ending-soon',
  standalone: true,
  imports: [SurveyCard],
  templateUrl: './ending-soon.html',
  styleUrls: ['./ending-soon.scss'],
})
export class EndingSoon {
  surveyService = inject(SurveyService);

  surveys = this.surveyService.surveyList;
}
