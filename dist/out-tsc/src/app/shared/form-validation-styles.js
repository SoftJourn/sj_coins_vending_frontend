export var FormValidationStyles = (function () {
    function FormValidationStyles(form) {
        this.form = form;
    }
    FormValidationStyles.prototype.getValidationClass = function (controlName) {
        if (this.form.controls[controlName].pristine) {
            return "";
        }
        else if (this.form.controls[controlName].valid) {
            return "has-success";
        }
        else if (!this.form.controls[controlName].valid) {
            return "has-danger";
        }
    };
    FormValidationStyles.prototype.getValidationIcon = function (controlName) {
        if (this.form.controls[controlName].pristine) {
            return "";
        }
        else if (this.form.controls[controlName].valid) {
            return "form-control-success";
        }
        else if (!this.form.controls[controlName].valid) {
            return "form-control-danger";
        }
    };
    FormValidationStyles.prototype.isValidOrPristine = function (controlName) {
        return this.form.controls[controlName].valid
            || this.form.controls[controlName].pristine;
    };
    FormValidationStyles.prototype.getCardOutlineClass = function () {
        if (!this.form.pristine && !this.form.valid) {
            return 'card-outline-danger';
        }
        else {
            return 'card-outline-success';
        }
    };
    return FormValidationStyles;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/shared/form-validation-styles.js.map