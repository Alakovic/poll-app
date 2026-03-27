import { Component,inject,Pipe } from '@angular/core';
import { SurveyService } from '../../services/survey_service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-survey-details',
  imports: [CommonModule],
  templateUrl: './survey-details.html',
  styleUrls: ['./survey-details.scss'],
})
export class SurveyDetails {
  private route = inject(ActivatedRoute);
  router = inject(Router);
  surveyService = inject(SurveyService);
  detail = this.surveyService.surveyDetail;
  selectedAnswers: { [questionId: number]: string[] } = {};

  ngOnInit(): void {
    let surveyId = Number(this.route.snapshot.paramMap.get('id'));
    if(!surveyId) return;
    this.surveyService.getSurveyWithDetails(surveyId);
  }

  onAnswerChange(questionId: number, answer: string, event: any) {
  const checked = event.target.checked;

  if (!this.selectedAnswers[questionId]) {
    this.selectedAnswers[questionId] = [];
  }

  if (checked) {
    this.selectedAnswers[questionId].push(answer);
  } else {
    this.selectedAnswers[questionId] =
      this.selectedAnswers[questionId].filter(a => a !== answer);
  }
}

}
