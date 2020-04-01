import React from 'react'
import { List, Image, Popup } from 'semantic-ui-react'
import { IAttendee } from '../../../app/models/activity'

interface IProbs{
    attendees: IAttendee[];
}

const styles = {
    borderColor: 'orange',
    borderWidth: 2
}

const ActivityListItemAttendee:React.FC<IProbs> = ({attendees}) => {
    return (
        <List horizontal>
            {attendees.map(attendee => (
                <List.Item key={attendee.username}>
                    <Popup 
                        header={attendee.displayName}
                        trigger={
                            <Image 
                                size="mini" 
                                circular 
                                src={attendee.image || "/assets/user.png" }
                                bordered
                                style={attendee.following ? styles : null}
                            />
                        }
                    />
                    
                </List.Item>
            ))}
            
            
        </List>
    )
}

export default ActivityListItemAttendee