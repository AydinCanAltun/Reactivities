import React from 'react'
import { Form, Button } from 'semantic-ui-react'
import { Form as FinalForm, Field } from 'react-final-form'
import { IProfile } from '../../app/models/profile';
import TextInput from '../../app/common/form/TextInput';
import TextAreaInput from '../../app/common/form/TextAreaInput';
import { combineValidators, isRequired } from 'revalidate';

const validate = combineValidators({
    displayName: isRequired({message: "Display Name is required"}),
    bio: isRequired({message: "Bio is required"})
})

interface IProbs{
    updateProfile : (profile: Partial<IProfile>) => void;
    profile: IProfile;
}

const ProfileEditForm: React.FC<IProbs> = ({updateProfile, profile}) => {

    return (

        <FinalForm 
            validate={validate}
            onSubmit={updateProfile}
            initialValues={profile!}
            render={ ({handleSubmit, invalid, pristine, submitting}) => (
                <Form
                    onSubmit={handleSubmit}
                    error
                >
                    <Field 
                        name="displayName"
                        component={TextInput}
                        placeholder="Display Name"
                        value={profile.displayName}
                    />
                    <Field 
                        name="bio"
                        component={TextAreaInput}
                        placeholder="Bio"
                        value={profile.bio}
                    />
                    <Button 
                        loading={submitting}
                        floated="right"
                        disabled={invalid || pristine}
                        positive
                        content="Update Profile"
                    />
                </Form>
            ) }
        />

    )
}

export default ProfileEditForm
