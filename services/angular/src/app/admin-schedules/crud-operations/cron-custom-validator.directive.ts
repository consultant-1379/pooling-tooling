import { AbstractControl, ValidatorFn, ValidationErrors} from '@angular/forms';
import { isValidCron  } from 'cron-validator';

export const cronScheduleValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (control.value !== undefined   && !isValidCron(control.value) )
    {
        return {invalidCronScheduleInput: true };
    }
    return null;
};
