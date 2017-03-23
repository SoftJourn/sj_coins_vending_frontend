import {Component, Input, OnInit, OnChanges, SimpleChanges}  from '@angular/core';
import { FormGroup }                 from '@angular/forms';
import {QuestionBase} from "./question/question-base";
import {QuestionControlService} from "./service/question-control.service";


@Component({
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html',
  providers: [ QuestionControlService ]
})
export class DynamicFormComponent implements OnInit {

  @Input() questions: QuestionBase<any>[] = [];
  form: FormGroup;
  payLoad = '';

  constructor(private qcs: QuestionControlService) {  }

  ngOnInit() {
    this.form = this.qcs.toFormGroup(this.questions);
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.value);
  }

  addQuestion(question: QuestionBase<any>) {
    this.qcs.addQuestion(this.form, question);
    this.questions.push(question);
  }
}
