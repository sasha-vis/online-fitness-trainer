import { useLocation } from 'react-router-dom';
import { LoginForm } from './components/login-form';
import { SignupForm } from './components/signup-form';
import { AuthPageFormsNames } from './scheme';

const forms = {
    [AuthPageFormsNames.login]: <LoginForm />,
    [AuthPageFormsNames.signup]: <SignupForm />,
};

export const Auth = () => {
    const location = useLocation();

    return <>{forms[location.pathname as AuthPageFormsNames]}</>;
};
