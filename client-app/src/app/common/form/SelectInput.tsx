import React from 'react'
import { FieldRenderProps } from 'react-final-form'
import { FormFieldProps, Form, Label, Select} from 'semantic-ui-react'

interface IProbs extends FieldRenderProps<string, any>, FormFieldProps { 

}

const SelectInput: React.FC<IProbs> = ({ 
    input, 
    width,
    options,
    placeholder, 
    meta: { touched, error } 
}) => {
    return (
        <Form.Field error={touched && !!error } width={width}>
            <Select
                value={input.value}
                placeholder={placeholder}
                onChange={ (e, data) => input.onChange(data.value) }
                options={options}
            />
            {touched && error && (
                <Label basic color='red'>{error}</Label>
            )}
        </Form.Field>
    )
}

export default SelectInput

