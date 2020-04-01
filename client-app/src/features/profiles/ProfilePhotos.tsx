import React, { useContext, useState } from 'react'
import { Tab, Header, Card, Image, Button, Grid } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import { PhotoUploadWidget } from '../../app/common/photoUpload/PhotoUploadWidget';

const ProfilePhotos = () => {
    const rootStore = useContext(RootStoreContext);
    const { profile, isCurrentUser, setMainPhoto, deletePhoto, loadingProfilePhoto, loadingDelete, uploadPhoto, uploadingPhoto } = rootStore.profileStore;

    const [addPhotoMode, setAddPhotoMode] = useState(false);

    const [target, setTarget] = useState<string | undefined>(undefined);
    const [deleteTarget, setDeleteTarget] = useState<string | undefined>(undefined);

    const handleUploadImage = (image: Blob) => {
        uploadPhoto(image).then( () => setAddPhotoMode(false));

    }


    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16} style={{paddingBottom: 0}}>
                    <Header floated="left" icon="image" content="Photos" />
                    { isCurrentUser && 
                        <Button 
                        basic 
                        floated="right" 
                        content={addPhotoMode ? "Cancel" : "Add Photo"} 
                        onClick={() => setAddPhotoMode(!addPhotoMode)}    
                        /> 
                    }
                    
                </Grid.Column>
                <Grid.Column width={16}>
                    {addPhotoMode ? 
                        <PhotoUploadWidget
                            uploadPhoto={handleUploadImage}
                            loading={uploadingPhoto}
                        /> 
                    : (
                    <Card.Group itemsPerRow={5}>
                        {profile && profile.photos.map(photo => (
                            <Card key={photo.id}>
                                <Image src={photo.url} />
                                {isCurrentUser && 
                                    <Button.Group fluid widths={2}>
                                        <Button
                                            name={photo.id}
                                            basic 
                                            positive 
                                            content="Main"
                                            onClick={ (e) => {
                                                setMainPhoto(photo);
                                                setTarget(e.currentTarget.name)
                                            }}
                                            disabled={photo.isMain}
                                            loading={loadingProfilePhoto && target === photo.id }
                                        />
                                        <Button
                                            name={photo.id}
                                            basic 
                                            negative 
                                            icon="trash" 
                                            onClick={ (e) => {
                                                deletePhoto(photo);
                                                setDeleteTarget(e.currentTarget.name)
                                            }}
                                            disabled={photo.isMain}
                                            loading={loadingDelete && deleteTarget === photo.id}
                                        />
                                    </Button.Group>
                                }
                            </Card>
                        ))}
                    </Card.Group>
                    ) }
                    
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
}

export default observer(ProfilePhotos);
