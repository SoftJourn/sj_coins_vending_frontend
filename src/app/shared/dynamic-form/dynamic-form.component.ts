import {Component, Input, OnInit, OnChanges, SimpleChanges}  from '@angular/core';
import {FormGroup}                 from '@angular/forms';
import {QuestionBase} from "./question/question-base";
import {QuestionControlService} from "./service/question-control.service";


@Component({
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html',
  providers: [QuestionControlService]
})
export class DynamicFormComponent implements OnInit {

  @Input() questions: QuestionBase<any>[] = [];
  @Input() allowDuplicates: boolean = false;

  form: FormGroup;
  payLoad = '';

  constructor(private qcs: QuestionControlService) {
  }

  ngOnInit() {
    this.form = this.qcs.toFormGroup(this.questions);
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.value);
  }

  addQuestion(question: QuestionBase<any>) {
    this.qcs.addQuestion(this.form, question, this.allowDuplicates);
    this.questions.push(question);
  }

  removeAllRemovable(): void {
    this.questions
      .filter(question => question.removable)
      .forEach(question => this.removeFromList(question));
  }

  removeFromList(question) {
    this.questions = this.questions
      .filter(quest => quest !== question);
    if (question)
      this.form.removeControl(question.key)
  }
}
