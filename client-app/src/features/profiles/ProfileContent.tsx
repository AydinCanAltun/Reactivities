import React from 'react'
import { Tab } from 'semantic-ui-react';
import ProfilePhotos from './ProfilePhotos';
import { observer } from 'mobx-react-lite';
import ProfileBio from './ProfileBio';
import ProfileFollowings from './ProfileFollowings';
import ProfileActivities from './ProfileActivities';

interface IProbs{
    setActiveTab: (activeIndex: any) => void;
    getActiveTab: number;
}

const panes = [
    {
        menuItem: "About",
        render: () => <ProfileBio />
    },
    {
        menuItem: "Photos",
        render: () => <ProfilePhotos />
    },
    {
        menuItem: "Activities",
        render: () => <ProfileActivities />
    },
    {
        menuItem: "Followers",
        render: () => <ProfileFollowings />
    },
    {
        menuItem: "Following",
        render: () => <ProfileFollowings />
    }
]

const ProfileContent: React.FC<IProbs> = ({setActiveTab, getActiveTab}) => {
    return (
        <Tab 
            menu={{fluid: true, vertical: true}}
            menuPosition="right"
            panes={panes}
            activeIndex={getActiveTab}
            onTabChange={ (e, data) => setActiveTab(data.activeIndex)}
        />
    )
}

export default observer(ProfileContent);
