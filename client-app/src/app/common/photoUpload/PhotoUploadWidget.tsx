import React, { Fragment, useState, useEffect } from 'react';
import { Header, Grid, Button } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import PhotoUploadDropZone from './PhotoUploadDropZone';
import PhotoWidgetCropper from './PhotoWidgetCropper';

interface IProbs {
  uploadPhoto: (file: Blob) => void;
  loading: boolean;
}

export const PhotoUploadWidget: React.FC<IProbs> = ({ uploadPhoto, loading }) => {

  const [files, setFiles] = useState<any[]>([]);
  const [image, setImage] = useState<Blob | null>(null);

  useEffect(() => {
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    }
  }, [files])

  return (
    <Fragment>
      <Grid>
        <Grid.Column width={4}>
          <Header color='teal' sub content='Step 1 - Add Photo' />
          <PhotoUploadDropZone setFiles={setFiles} />
        </Grid.Column>
        <Grid.Column width={1} />
        <Grid.Column width={4}>
          <Header sub color='teal' content='Step 2 - Resize image' />
          {files.length > 0 &&
            <PhotoWidgetCropper setImage={setImage} imagePreview={files[0].preview} />
          }
        </Grid.Column>
        <Grid.Column width={1} />
        <Grid.Column width={4}>
          <Header sub color='teal' content='Step 3 - Preview & Upload' />
          {files.length > 0 &&
            <Fragment>
              <div className="img-preview" style={{ minHeight: "200px", overflow: "hidden" }} />
              <Button.Group fluid widths={2} >
                <Button 
                    positive 
                    icon="check" 
                    loading={loading} 
                    onClick={ () => {
                      uploadPhoto(image!);
                    }} 
                />
                <Button 
                    icon="close" 
                    disabled={loading} 
                    onClick={ () => {
                      setFiles([]);
                    }} 
                />
              </Button.Group>
            </Fragment>

          }
        </Grid.Column>
      </Grid>
    </Fragment>
  )

};

export default observer(PhotoUploadWidget);
