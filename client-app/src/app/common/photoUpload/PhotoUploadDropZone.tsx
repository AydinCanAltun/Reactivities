import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { Icon, Header } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'

interface IProbs{
    setFiles: (files: object[]) => void;
}

const dropzoneStyles = {
    border: '3px dashed',
    borderColor: '#eee',
    borderRadius: '5px',
    paddingTop: '30px',
    textAlign: 'center' as 'center',
    height: '200px'
}

const dropzoneActive = {
    borderColor: "green"
}

const PhotoUploadDropZone: React.FC<IProbs> = ({setFiles}) => {
  const onDrop = useCallback(acceptedFiles => {
    setFiles( acceptedFiles.map( (file: object) => Object.assign(file, {
        preview: URL.createObjectURL(file)
    })))
  }, [setFiles])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()} style={ isDragActive ? {...dropzoneStyles, ...dropzoneActive} : dropzoneStyles } >
      <input {...getInputProps()} />
    
        <Icon name="upload" size="huge" />
        <Header content="Drop image here" />

    </div>
  )
}

export default observer(PhotoUploadDropZone);