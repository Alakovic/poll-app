import { Routes } from '@angular/router';
import { LandingPage } from './shared/components/landing-page/landing-page';
import { SurveyForm } from './shared/components/survey-form/survey-form';
import { SurveyDetails } from './shared/components/survey-details/survey-details';

export const routes: Routes = [
    {
       path: '',
       component: LandingPage   
    },
    {
      path: 'survey-form' ,
      component: SurveyForm
    },
    {
      path: 'survey/:id',
      component: SurveyDetails
    }
    ];