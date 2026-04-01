import { AbstractControl, ValidationErrors } from "@angular/forms";

export default function passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get("password");
    const rePassword = form.get("rePassword");

    if (password?.value !== rePassword?.value) {
        return { passwordsMismatch: true };
    }

    return null;
}
