// ** React Imports
import { useState, SyntheticEvent, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import { styled } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'
import {  Grid, List } from '@mui/material'

interface FileProp {
  name: string
  type: string
  size: number
}

// Styled component for the upload image inside the dropzone area
const Img = styled('img')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    marginRight: theme.spacing(15.75)
  },
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  },
  [theme.breakpoints.down('sm')]: {
    width: 160
  }
}))

// Styled component for the heading inside the dropzone area
const HeadingTypography = styled(Typography)<TypographyProps>(({ theme }) => ({
  marginBottom: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(4)
  }
}))

type UploaderPropType = {
  action: (data: File[]) => void
}

const FileUploaderSingle = ({ action }: UploaderPropType) => {
  // ** State
  const [files, setFiles] = useState<File[]>([])

  // ** Hook
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    
    onDrop: (acceptedFiles: File[]) => {
      const files=acceptedFiles.map((file: File) => Object.assign(file));
      action(files)
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))

    }
  })

  const handleLinkClick = (event: SyntheticEvent) => {
    event.preventDefault()
  }

  const fileRender = files.map((file: FileProp) => (
    <Grid key={file.name} className='single-file-image'>
      {file.name}
    </Grid>
  ))



  return (
    <Box>
      <Box {...getRootProps({ className: 'dropzone' })} sx={acceptedFiles.length ? {  } : {}}>
        <input {...getInputProps()} />
        <Box sx={{ display: 'flex', flexDirection: ['column', 'column', 'row'], alignItems: 'center' }}>
          <Img alt='Upload img' src='/images/misc/upload.png' />
          <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: ['center', 'center', 'inherit'] }}>
            <HeadingTypography variant='h5'>Drop files here or click to upload.</HeadingTypography>
            <Typography color='textSecondary'>
              Drop documents here or click{' '}
              <Link href='/' onClick={handleLinkClick}>
                browse
              </Link>{' '}
              thorough your machine
            </Typography>
          </Box>
        </Box>
      </Box>
      {files.length ? (
        <Fragment>
          <List>{fileRender}</List>
          {/* <div className='buttons'>
            <Button color='error' variant='outlined' onClick={handleRemoveFile}>
              Remove
            </Button>
            <Button
              variant='contained'
              onClick={() => {
                action(files)
              }}
            >
              Upload File
            </Button>
          </div> */}
        </Fragment>
      ) : null}
    </Box>
  )
}

export default FileUploaderSingle
