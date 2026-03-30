import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { QuestionForm } from '../question-form/question-form';
import { SurveyService } from '../../services/survey_service';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { SurveyCategory } from '../../types/category_types';
import { SurveyModel } from '../../models/surveymodel';

@Component({
  selector: 'app-survey-form',
  standalone: true,
  imports: [RouterLink, QuestionForm, ReactiveFormsModule],
  templateUrl: './survey-form.html',
  styleUrls: ['./survey-form.scss'],
})
export class SurveyForm {
  router = inject(Router);
  surveyService = inject(SurveyService);
  categories = this.surveyService.categories;
  open: boolean = false;
  categorySelected: boolean = false;
  isPublished: boolean = false;

  ngOnInit() {
    this.addQuestion();
  }

  categoryValidator = () => {
    return this.categorySelected ? null : { required: true };
  };

  surveyForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    endDate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/)],
    }),
    description: new FormControl('', { nonNullable: true }),
    questions: new FormArray<FormGroup>([]),
    category: new FormControl<SurveyCategory>(this.categories[0], {
      nonNullable: true,
      validators: [this.categoryValidator],
    }),
  });

  questionsArray(): FormArray<FormGroup> {
    return this.surveyForm.controls.questions;
  }

  createQuestionGroup() {
    return new FormGroup({
      title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      allow_multiple: new FormControl(false, { nonNullable: true }),
      answers: new FormArray([
        new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      ]),
    });
  }

  getErrorMessage(controlName: string): string | null {
    const control = this.surveyForm.get(controlName);
    if (!control || !control.touched || !control.invalid) return null;
    if (control.hasError('required')) return 'This field is required.';
    if (control.hasError('minlength'))
      return `Minimum length is ${control.getError('minlength')?.requiredLength}.`;
    if (control.hasError('pattern')) return 'Date must be in DD-MM-YYYY format.';
    return null;
  }

  addQuestion() {
    this.questionsArray().push(this.createQuestionGroup());
  }

  removeQuestion(index: number) {
    let questions = this.questionsArray();
    if (questions.length > 1) {
      questions.removeAt(index);
    } else {
     let q = questions.at(index) as FormGroup;
     q.reset();
     q.setControl('answers', new FormArray([
      new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      new FormControl('', { nonNullable: true, validators: [Validators.required] }),
     ]));
    }
  }

  selectCategory(cat: SurveyCategory) {
    let control = this.surveyForm.get('category');
    if (control) {
      control.setValue(cat);
      control.markAsTouched();
      this.categorySelected = true;
      control.updateValueAndValidity();
    }
    this.open = false;
  }

  clearField(controlName: string) {
    let c = this.surveyForm.get(controlName);
    c?.setValue('');
    c?.markAsUntouched();
  }

  async onSubmit() {
    if (this.surveyForm.valid) {
      this.isPublished = true;
      let survey = new SurveyModel(this.surveyForm.value);
      let id = await this.surveyService.addSurvey(survey);
      if (id) {
        setTimeout(() => {
          this.isPublished = false;
        }, 1000);
        setTimeout(() => {
          this.router.navigate(['/survey', id]);
        }, 2000);
      }
    } else {
      this.surveyForm.markAllAsTouched();
    }
  }
}
