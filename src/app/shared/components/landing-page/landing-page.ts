import { Component } from '@angular/core';
import { EndingSoon } from "../ending-soon/ending-soon";

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [EndingSoon],
  templateUrl: './landing-page.html',
  styleUrls: ['./landing-page.scss'],
})
export class LandingPage {}
