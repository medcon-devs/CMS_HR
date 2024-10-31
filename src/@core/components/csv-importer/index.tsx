import { Button, Grid, Typography } from '@mui/material'
import React, { useState } from 'react'
import { BaseRow, Importer, ImporterField } from 'react-csv-importer'

type CSVDataType = {
  action: (data: BaseRow[]) => void
}

function CSVImporter(props: CSVDataType) {
  const [data, setData] = useState<BaseRow[]>([])
  const { action } = props

  return (
    <Grid>
      <Importer
        dataHandler={async (rows) => {
          setData(rows)
        }}
        skipEmptyLines={true}
        defaultNoHeader={false} // optional, keeps "data has headers" checkbox off by default
        restartable={true} // optional, lets user choose to upload another file when import is complete
      >
        <ImporterField name='email' label='email' />
        <ImporterField name='status' label='status' />
        <ImporterField name='Content Title' label='Content Title' />
      </Importer>
      <Grid mt={3} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        <Typography sx={{}} variant='caption' mt={2}>
          file format .csv*
        </Typography>
        {data.length > 0 ? (
          <Button
            onClick={() => {
              action(data)
            }}
            size='large'
            variant='contained'
          >
            Upload
          </Button>
        ) : null}
      </Grid>
    </Grid>
  )
}

export default CSVImporter
