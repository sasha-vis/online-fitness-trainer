/* eslint-disable no-console */
import React, { Component, type ReactNode } from 'react';
import { ErrorMessage } from '../error-message/error-message';

interface ErrorBoundaryState {
    hasError: boolean;
}

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    errorText?: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        console.log(error);
        return {
            hasError: true,
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error('error: ', error);
        console.error('error info: ', errorInfo);
    }

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback != undefined) {
                return this.props.fallback;
            }

            const errorMessage =
                this.props.errorText ?? 'При загрузке компонента что-то пошло не так';

            return <ErrorMessage message="Ошибка" description={errorMessage} showIcon />;
        }

        return this.props.children;
    }
}
