import React from 'react';
import { Segment, Item, Header, Button, Grid, Statistic, Divider, Reveal } from 'semantic-ui-react';
import { IProfile } from '../../app/models/profile';
import { observer } from 'mobx-react-lite';

interface IProbs {
  profile: IProfile;
  follow: (username: string) => void;
  unfollow: (username: string) => void;
  isCurrentUser: boolean;
  followLoading: boolean
}


const ProfileHeader: React.FC<IProbs> = (
  {
    profile,
    follow,
    unfollow,
    isCurrentUser,
    followLoading
  }) => {
  return (
    <Segment>
      <Grid>
        <Grid.Column width={12}>
          <Item.Group>
            <Item>
              <Item.Image
                avatar
                size='small'
                src={profile.image || '/assets/user.png'}
              />
              <Item.Content verticalAlign='middle'>
                <Header as='h1'>{profile.displayName} </Header>
              </Item.Content>
            </Item>
          </Item.Group>
        </Grid.Column>
        <Grid.Column width={4}>
          <Statistic.Group widths={2}>
            <Statistic label='Followers' value={profile.followersCount} />
            <Statistic label='Following' value={profile.followingCount} />
          </Statistic.Group>
          <Divider />
          {!isCurrentUser && (
            <Reveal animated='move'>
              <Reveal.Content visible style={{ width: '100%' }}>
                <Button
                  fluid
                  color='teal'
                  content={profile.follower ? 'Following' : 'Not Following'}
                />
              </Reveal.Content>
              <Reveal.Content hidden>
                <Button
                  fluid
                  basic
                  loading={followLoading}
                  color={profile.follower   ? 'red' : 'green'}
                  content={profile.follower ? 'Unfollow' : 'Follow'}
                  onClick={
                    profile.follower 
                      ? () => unfollow(profile.userName) 
                      : () => follow(profile.userName) 
                    }
                  
                />
              </Reveal.Content>
            </Reveal>
          )}

        </Grid.Column>
      </Grid>
    </Segment>
  );
};

export default observer(ProfileHeader);
