import React, { useContext } from 'react'
import { Item, Button, Segment, Icon, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { IActivity } from '../../../app/models/activity';
import { format } from 'date-fns';
import ActivityListItemAttendee from './ActivityListItemAttendee';
import { RootStoreContext } from '../../../app/stores/rootStore';



const ActivityListItem: React.FC<{ activity: IActivity }> = ({ activity }) => {
    const host = activity.attendees.filter(x => x.isHost)[0];
    const rootStore = useContext(RootStoreContext);
    const { deleteActivity, submitting } = rootStore.activityStore;
    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size='tiny' circular src={host.image || 'assets/user.png'} style={{ marginBottom: 3 }} />
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${activity.id}`}> {activity.title} </Item.Header>
                            <Item.Description>
                                Hosted by <Link to={`/profile/${host.username}`}>{host.displayName}</Link>  
                            </Item.Description>

                            {activity.isHost && (
                                <Item.Description>
                                    <Label basic color="orange" content="You are hosting this activitiy" />
                                </Item.Description>
                            )}

                            {activity.isGoing && !activity.isHost && (
                                <Item.Description>
                                    <Label basic color="green" content="You are going to this activitiy" />
                                </Item.Description>
                            )}

                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <Icon name='clock' /> {format(activity.date, 'dd/LL/yyyy, k:mm')}
                <Icon style={{ marginLeft: '10px' }} name='marker' /> {activity.venue}, {activity.city}
            </Segment>
            <Segment secondary>
                <ActivityListItemAttendee attendees={activity.attendees} />
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button
                    as={Link}
                    to={`/activities/${activity.id}`}
                    floated="right"
                    content="View"
                    color="blue"
                />
                {activity.isHost && (
                    <Button
                    loading={submitting}
                    onClick={ (e) => deleteActivity(e, activity.id)  }
                    floated="right"
                    content="Delete"
                    color="red"
                    />
                )}
            </Segment>
        </Segment.Group>

    )
}

export default ActivityListItem
