import { Injectable, signal } from '@angular/core';
import { Survey } from '../interfaces/survey_interface';
import { SurveyCategory } from '../types/category_types';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {

  surveyList = signal<Survey[]>([]);

  constructor() {
      this.surveyList.set(this.surveys);
  }

  surveys = [
    {
      title: "Let's plan the next team event together",
      description: "We want to make sure that everyone has a great time at our next team event. Please take a moment to share your preferences and ideas for activities, venues, and dates. Your input will help us create an unforgettable experience for everyone!",
      category: "Team Activities" as SurveyCategory,
      endDate: new Date("2026-03-18")
    }
  ];

  getDaysLeft(endDate: Date): number {
    let today = new Date();
    let timeDiff = endDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

}
