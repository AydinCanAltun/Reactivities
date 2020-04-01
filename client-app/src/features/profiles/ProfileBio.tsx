import React, { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite';
import { Tab, Grid, Header, Button } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import ProfileEditForm from './ProfileEditForm';

const ProfileBio = () => {

    const [editMode, setEditMode] = useState(false);
    
    const rootStore = useContext(RootStoreContext);
    const { isCurrentUser, profile, updateProfile } = rootStore.profileStore;

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16} style={{paddingBottom: 0}}>
                    <Header floated="left" content={`${profile!.displayName}'s Bio`} />
                    {
                        isCurrentUser && 
                        (editMode ?
                            (
                                <Button 
                                    basic
                                    floated="right"
                                    content="Cancel"
                                    onClick = { () => {
                                        setEditMode(false)
                                    } }
                                />   
                            ) : (
                                <Button 
                                    basic
                                    floated="right"
                                    content="Edit Bio"
                                    onClick = { () => {
                                        setEditMode(true)
                                    } }
                                />
                            )
                        )
                    }
                </Grid.Column>
                <Grid.Column width={16}>
                    {
                        editMode ? (
                            <ProfileEditForm updateProfile={updateProfile} profile={profile!} />
                        ) 
                        : (
                            profile!.bio
                        )
                    }
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
}

export default observer(ProfileBio);
