import React from 'react'
import FileUploaderMultiple from 'src/views/forms/form-elements/file-uploader/FileUploaderMultiple'

function Fileuploader() {

  const uploadFile = async (files: any[]) => {
    console.log(files)
  }

  return (
    <>
      <FileUploaderMultiple action={uploadFile} />
    </>
  )
}

export default Fileuploader
