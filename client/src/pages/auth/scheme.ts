import { SignupFormFieldConfig } from './types';

export enum AuthPageFormsNames {
    login = '/login',
    signup = '/signup',
}

export enum LoginFieldsNames {
    email = 'email',
    password = 'password',
}

export enum SignupFieldsNames {
    name = 'name',
    surname = 'surname',
    email = 'email',
    age = 'age',
    height = 'height',
    waist = 'waist',
    chest = 'chest',
    hips = 'hips',
    arm = 'arm',
    leg = 'leg',
    results = 'results',
    medical = 'medical',
    experience = 'experience',
    diet = 'diet',
    photos = 'photos',
    password = 'password',
    repeatPassword = 'repeatPassword',
}

export const formFields: SignupFormFieldConfig[] = [
    {
        name: SignupFieldsNames.name,
        label: 'Имя',
        placeholder: 'Иван',
        rules: {
            required: 'Имя обязательно',
            minLength: {
                value: 2,
                message: 'Имя должно быть не короче 2 символов',
            },
            maxLength: {
                value: 50,
                message: 'Имя слишком длинное',
            },
        },
        type: 'input',
    },
    {
        name: SignupFieldsNames.surname,
        label: 'Фамилия',
        placeholder: 'Иванов',
        rules: {
            required: 'Фамилия обязательна',
            minLength: {
                value: 2,
                message: 'Имя должно быть не короче 2 символов',
            },
            maxLength: {
                value: 50,
                message: 'Имя слишком длинное',
            },
        },
        type: 'input',
    },
    {
        name: SignupFieldsNames.email,
        label: 'Email',
        placeholder: 'example@mail.com',
        rules: {
            required: 'Email обязателен',
            pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Некорректный формат email',
            },
        },
        type: 'input',
    },
    {
        name: SignupFieldsNames.age,
        label: 'Возраст',
        placeholder: '21',
        rules: {
            required: 'Укажите возраст',
            pattern: {
                value: /^\d+$/,
                message: 'Некорректное значение',
            },
        },
        type: 'input',
    },
    {
        name: SignupFieldsNames.height,
        label: 'Рост',
        placeholder: '180',
        rules: {
            required: 'Укажите рост',
            pattern: {
                value: /^\d+$/,
                message: 'Некорректное значение',
            },
        },
        type: 'input',
    },
    {
        name: SignupFieldsNames.chest,
        label: 'Обхват груди',
        placeholder: '90',
        rules: {
            required: 'Укажите обхват груди',
            pattern: {
                value: /^\d+$/,
                message: 'Некорректное значение',
            },
        },
        type: 'input',
    },
    {
        name: SignupFieldsNames.waist,
        label: 'Обхват талии',
        placeholder: '60',
        rules: {
            required: 'Укажите обхват талии',
            pattern: {
                value: /^\d+$/,
                message: 'Некорректное значение',
            },
        },
        type: 'input',
    },
    {
        name: SignupFieldsNames.hips,
        label: 'Обхват бедер',
        placeholder: '90',
        rules: {
            required: 'Укажите обхват бедер',
            pattern: {
                value: /^\d+$/,
                message: 'Некорректное значение',
            },
        },
        type: 'input',
    },
    {
        name: SignupFieldsNames.arm,
        label: 'Обхват руки',
        placeholder: '20',
        rules: {
            required: 'Укажите обхват руки',
            pattern: {
                value: /^\d+$/,
                message: 'Некорректное значение',
            },
        },
        type: 'input',
    },
    {
        name: SignupFieldsNames.leg,
        label: 'Обхват ноги',
        placeholder: '70',
        rules: {
            required: 'Укажите обхват ноги',
            pattern: {
                value: /^\d+$/,
                message: 'Некорректное значение',
            },
        },
        type: 'input',
    },
    {
        name: SignupFieldsNames.results,
        label: 'Цель и ожидаемый результат',
        placeholder: 'Жим лежа 100кг',
        rules: {
            required: 'Цель обязательна',
            minLength: {
                value: 2,
                message: 'Цель должна быть не короче 2 символов',
            },
        },
        type: 'textarea',
    },
    {
        name: SignupFieldsNames.medical,
        label: 'Противопоказания, заболевания и ограничения',
        placeholder: 'Расскажите о своем здоровье',
        rules: {
            required: 'Данные о здоровье обязательны',
            minLength: {
                value: 2,
                message: 'Цель должна быть не короче 2 символов',
            },
        },
        type: 'textarea',
    },
    {
        name: SignupFieldsNames.experience,
        label: 'Опыт тренировок',
        placeholder: 'Расскажите о своем опыте',
        rules: {
            required: 'Данные об опыте обязательны',
            minLength: {
                value: 2,
                message: 'Цель должна быть не короче 2 символов',
            },
        },
        type: 'textarea',
    },
    {
        name: SignupFieldsNames.diet,
        label: 'Текущий рацион питания',
        placeholder: 'Расскажите о своем рационе',
        rules: {
            required: 'Данные о рационе обязательны',
            minLength: {
                value: 2,
                message: 'Цель должна быть не короче 2 символов',
            },
        },
        type: 'textarea',
    },
    {
        name: SignupFieldsNames.photos,
        label: 'Прикрепите фотографии в полный рост: спереди, сбооку, со спины',
        placeholder: 'Загрузить фото',
        rules: {
            required: 'Фотографии обязательны',
        },
        type: 'file',
    },
    {
        name: SignupFieldsNames.password,
        label: 'Пароль',
        placeholder: 'Придумайте пароль',
        rules: {
            required: 'Пароль обязателен',
            minLength: {
                value: 8,
                message: 'Пароль должен содержать не менее 8 символов',
            },
            pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/,
                message: 'Пароль должен содержать хотя бы одну букву и одну цифру',
            },
        },
        type: 'input',
    },
    {
        name: SignupFieldsNames.repeatPassword,
        label: 'Повторите пароль',
        placeholder: 'Повторите пароль',
        type: 'input',
    },
];
