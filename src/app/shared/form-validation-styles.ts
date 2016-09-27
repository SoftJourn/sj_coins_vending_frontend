import { FormGroup } from "@angular/forms";


export class FormValidationStyles {

  constructor(private form: FormGroup) {
  }

  getValidationClass(controlName: string): string {
    if (this.form.controls[controlName].pristine) {
      return "";
    } else if (this.form.controls[controlName].valid) {
      return "has-success";
    } else if (!this.form.controls[controlName].valid) {
      return "has-danger";
    }
  }

  getValidationIcon(controlName: string): string {
    if (this.form.controls[controlName].pristine) {
      return "";
    } else if (this.form.controls[controlName].valid) {
      return "form-control-success";
    } else if (!this.form.controls[controlName].valid) {
      return "form-control-danger";
    }
  }

  isValidOrPristine(controlName: string): boolean {
    return this.form.controls[controlName].valid
      || this.form.controls[controlName].pristine;
  }

  getCardOutlineClass(): string {
    if (!this.form.pristine && !this.form.valid) {
      return 'card-outline-danger'
    } else {
      return 'card-outline-success';
    }
  }
}
