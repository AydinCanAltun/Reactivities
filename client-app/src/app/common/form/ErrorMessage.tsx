import React from 'react'
import { Message } from 'semantic-ui-react';
import { AxiosResponse } from 'axios';

interface IProbs {
    error: AxiosResponse;
    message?: string;
}

const ErrorMessage: React.FC<IProbs> = ({ message, error }) => {
    return (
        <Message negative>
            <Message.Header>{error.statusText}</Message.Header>
            {error.data && Object.keys(error.data.errors).length > 0 && (
                <Message.List>
                    {Object.values(error.data.errors).flat().map((err, i) => (
                        <Message.Item key={i}>{err}</Message.Item>
                    ))}
                </Message.List>
            )}
            {message && <p>{message}</p>}
        </Message>
    )
}

export default ErrorMessage
