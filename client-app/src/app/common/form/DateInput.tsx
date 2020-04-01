import React from 'react'
import { FieldRenderProps } from 'react-final-form'
import { FormFieldProps, Form, Label } from 'semantic-ui-react'
import {DateTimePicker} from 'react-widgets';

interface IProbs extends FieldRenderProps<Date>, FormFieldProps {

}

const DateInput: React.FC<IProbs> = ({
    input,
    width,
    placeholder,
    meta: { touched, error },
    id = null,
    date = false,
    time = false,
    ...rest
}) => {
    return (
        <Form.Field error={touched && !!error } width={width}>
            <DateTimePicker 
                placeholder={placeholder}
                value={input.value || null}
                onChange={input.onChange}
                onBlur={input.onBlur}
                onKeyDown={(e) => e.preventDefault() }
                date={date}
                time={time}
                {...rest}
            />
            {touched && error && (
                <Label basic color='red'>{error}</Label>
            )}
        </Form.Field>
    )
}

export default DateInput
