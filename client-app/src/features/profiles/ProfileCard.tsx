import React from 'react';
import { Card, Image, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { IProfile } from '../../app/models/profile';
import { observer } from 'mobx-react-lite';

interface IProbs{
    profile: IProfile
}

const ProfileCard: React.FC<IProbs> = ({profile}) => {
    return (
        <Card as={Link} to={`/profile/${profile.userName}`}>
            <Image src={profile.image || '/assets/user.png'} />
            <Card.Content>
                <Card.Header>{profile.displayName}</Card.Header>
            </Card.Content>
            <Card.Content extra>
                <div>
                    <Icon name='user' />
                    {profile.followersCount} followers
                </div>
            </Card.Content>
        </Card>
    );
};

export default observer(ProfileCard);
