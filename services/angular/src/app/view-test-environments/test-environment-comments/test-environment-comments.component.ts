import {Component, OnInit, Input, ElementRef} from '@angular/core';

import { TestEnvironment } from '../../models/testEnvironment';
import { TestEnvironmentService } from '../../services/test-environment.service';
import {DynamicPageComponent} from '../../dynamic-page/dynamic-page.component';

@Component({
  selector: 'app-test-environment-comments',
  templateUrl: './test-environment-comments.component.html',
  styleUrls: ['./test-environment-comments.component.css'],
})
export class TestEnvironmentCommentsComponent implements OnInit {
  @Input() testEnvironment!: TestEnvironment;
  isEditable = false;
  isExpandButtonHidden = false;
  isResizeButtonHidden = true;

  constructor(
    private testEnvironmentService: TestEnvironmentService,
    private dynamicPageComponent: DynamicPageComponent,
  ) {}

  ngOnInit(): void {
    this.checkIfCommentsUndefined();
  }

  editTextArea(textField: any): void {
    this.isExpandButtonHidden = true;
    this.isResizeButtonHidden = true;
    this.isEditable = true;
    this.autoGrowTextArea(textField);
    this.dynamicPageComponent.dragDisabled = true;
  }

  changeButtonTypeAndSaveCurrentInfo(comments: string, textField: any): void {
    if (this.isEditable === true) {
      this.isResizeButtonHidden = false;
      this.saveComments(comments);
    }
    this.isEditable = false;
  }

  autoGrowTextArea(textField: any): void {
    if (textField.clientHeight < textField.scrollHeight) {
      textField.style.height = `${textField.scrollHeight}px`;
      if (textField.clientHeight < textField.scrollHeight) {
        const newHeight = textField.scrollHeight * 2 - textField.clientHeight;
        textField.style.height = `${newHeight}px`;
      }
    }
  }

  autoGrowTextAreaFromButton(textField: any): void {
    this.autoGrowTextArea(textField);
    this.isExpandButtonHidden = true;
    this.isResizeButtonHidden = false;
  }

  resetTextArea(textField: any): void {
    textField.style.height = '24px';
    this.isExpandButtonHidden = false;
    this.isResizeButtonHidden = true;
  }

  private checkIfCommentsUndefined(): void {
    this.testEnvironment.comments =
      this.testEnvironment.comments === undefined ? '' : this.testEnvironment.comments;
  }

  private saveComments(comments: string): void {
    this.testEnvironment.comments = comments;
    this.testEnvironmentService.patchTestEnvironment(this.testEnvironment);
    this.dynamicPageComponent.dragDisabled = false;
  }
}
