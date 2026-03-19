import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { QuestionForm } from '../question-form/question-form';

@Component({
  selector: 'app-survey-form',
  standalone: true,
  imports: [RouterLink, QuestionForm],
  templateUrl: './survey-form.html',
  styleUrls: ['./survey-form.scss'],
})
export class SurveyForm {}
