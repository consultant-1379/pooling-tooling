import { Component, OnInit , ViewChild} from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';
import { environment } from '../../environments/environment';
import { setAdditionalText } from '../utils/set-environment-additional-text';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})

export class LandingPageComponent implements OnInit {

  @ViewChild(MatAccordion) accordion!: MatAccordion;

  public environmentModeText = '';

  constructor() {
   }

  ngOnInit(): void {
    this.environmentModeText = setAdditionalText(environment.production);
  }

}
