import {Component, Input, Output, EventEmitter} from '@angular/core';
import {FormGroup}        from '@angular/forms';
import {QuestionBase} from "../question/question-base";


@Component({
  selector: 'df-question',
  templateUrl: './dynamic-form-question.component.html'
})
export class DynamicFormQuestionComponent {
  @Input() question: QuestionBase<any>;
  @Input() form: FormGroup;
  @Output() onRemove:EventEmitter<QuestionBase<any>> = new EventEmitter<QuestionBase<any>>();

  get isValid() {
    let control = this.form.controls[this.question.key];
    return control ? control.valid : false;
  }

  get css(){
    if(this.question.removable)
      return "col-sm-8";
    else
      return "col-sm-10";
  }

  remove(event){
    this.onRemove.emit(this.question)
  }
}
