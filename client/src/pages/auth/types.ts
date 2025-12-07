import { RegisterOptions } from 'react-hook-form';
import { LoginFieldsNames, SignupFieldsNames } from './scheme';

export interface LoginFormValues {
    [LoginFieldsNames.email]: string;
    [LoginFieldsNames.password]: string;
}

export interface SignupFormValues {
    [SignupFieldsNames.name]: string;
    [SignupFieldsNames.surname]: string;
    [SignupFieldsNames.email]: string;
    [SignupFieldsNames.age]: number;
    [SignupFieldsNames.height]: number;
    [SignupFieldsNames.waist]: number;
    [SignupFieldsNames.chest]: number;
    [SignupFieldsNames.hips]: number;
    [SignupFieldsNames.arm]: number;
    [SignupFieldsNames.leg]: number;
    [SignupFieldsNames.results]: string;
    [SignupFieldsNames.medical]: string;
    [SignupFieldsNames.experience]: string;
    [SignupFieldsNames.diet]: string;
    [SignupFieldsNames.photos]: File[];
    [SignupFieldsNames.password]: string;
    [SignupFieldsNames.repeatPassword]: string;
}

type FormFieldType = 'input' | 'textarea' | 'file';

export interface SignupFormFieldConfig {
    name: keyof SignupFormValues;
    label: string;
    placeholder: string;
    rules?: RegisterOptions<SignupFormValues, keyof SignupFormValues>;
    type: FormFieldType;
}
