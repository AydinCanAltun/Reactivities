import React, { useContext, useEffect } from 'react'
import ProfileHeader from './ProfileHeader'
import { Grid } from 'semantic-ui-react'
import ProfileContent from './ProfileContent'
import { RootStoreContext } from '../../app/stores/rootStore'
import { RouteComponentProps } from 'react-router-dom'
import { LoadingComponent } from '../../app/layout/LoadingComponent'
import { observer } from 'mobx-react-lite'

interface RouteParams {
    username: string;
}

interface IProbs extends RouteComponentProps<RouteParams> {

}

const ProfilePage: React.FC<IProbs> = ({ match }) => {
    const rootStore = useContext(RootStoreContext);
    const { 
        loadProfile, 
        loadingProfile, 
        profile, 
        follow, 
        unfollow, 
        followLoading, 
        isCurrentUser, 
        setActiveTab,
        getActiveTab
    } = rootStore.profileStore;


    useEffect(() => {
        loadProfile(match.params.username);
        setActiveTab(0);
    }, [loadProfile, match, setActiveTab]);

    if (loadingProfile) {
        return (
            <LoadingComponent content="Loading Profile..." />
        )
    }


    return (
        <Grid>
            <Grid.Column width={16}>
                <ProfileHeader
                    profile={profile!}
                    follow={follow}
                    unfollow={unfollow}
                    followLoading={followLoading}
                    isCurrentUser={isCurrentUser}
                />
                <ProfileContent
                    setActiveTab={setActiveTab}
                    getActiveTab={getActiveTab}
                />
            </Grid.Column>
        </Grid>
    )
}

export default observer(ProfilePage);
