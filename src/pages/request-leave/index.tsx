// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CustomizeTable from 'src/@core/components/table'
import authConfig from 'src/configs/auth'
import { Alert, Button, Fab, Snackbar, Tab } from '@mui/material'
import { SyntheticEvent, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'
import { destroy } from 'src/handler/request.handler'
import AppCalendar from './calendar'
import { TabContext, TabList, TabPanel } from '@mui/lab'

const columns = [
  { id: 'id', label: 'ID', align: 'center', type: 'text' },
  { id: 'user', label: 'Employee', align: 'center', maxWidth: 140, type: 'text', colored: 'default' },
  { id: 'leave_time', label: 'Leave Time', align: 'center', type: 'text', colored: 'default' },
  { id: 'type', label: 'Leave Type', align: 'center', type: 'text', colored: 'default', maxWidth: 140, },
  { id: 'ask_for_ticket', label: 'Ticket', align: 'center', type: 'text' },
  { id: 'numberOfDays', label: 'Requested days', align: 'center', type: 'text', },
  {
    id: 'days_available',
    label: 'Available days',

    align: 'center',
    type: 'text',
  },
  { id: 'manager', label: 'Manager', key: 'value', message: 'message', align: 'center', type: 'object' },
  { id: 'created_at', label: 'Submitted At', align: 'center', type: 'text', colored: 'default', }
]

const archiveColumns = [
  { id: 'id', label: 'ID', align: 'center', type: 'text' },
  { id: 'user', label: 'Employee', align: 'center', maxWidth: 140, type: 'text', colored: 'default' },
  { id: 'leave_time', label: 'Leave Time', align: 'center', type: 'text', colored: 'default' },
  { id: 'type', label: 'Leave Type', align: 'center', type: 'text', colored: 'default', maxWidth: 140, },
  { id: 'ask_for_ticket', label: 'Ticket', align: 'center', type: 'text' },
  { id: 'numberOfDays', label: 'Requested days', align: 'center', type: 'text', }, 
  { id: 'manager', label: 'Manager', key: 'value', message: 'message', align: 'center', type: 'object' },
  { id: 'status', label: 'Status', key: 'value', message: 'message', align: 'center', type: 'object',  },
  { id: 'created_at', label: 'Submitted At', align: 'center', type: 'text', colored: 'default', }
]

const fabStyle = {
  position: 'fixed',
  bottom: 40,
  right: 40
}

const RequestLeave = () => {
  const router = useRouter()
  const auth = useAuth()

  const [value, setValue] = useState<string>('1')

  const [show, isShow] = useState(false)

  const [alert, setAlert] = useState({} as any)

  const fabs = [
    {
      color: 'primary',
      sx: fabStyle,
      icon: <AddIcon />,
      label: 'Add',
      action: () => {
        router.push({
          pathname: 'request-leave/new',
          query: {}
        })
      }
    }
  ]

  const deleteItem = async (id: number) => {
    return await destroy(authConfig.request + '/' + id)
  }

  const handleShankbarClose = () => {
    isShow(false)
  }

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={show}
        onClose={() => {
          isShow(false)
        }}
      >
        <Alert variant='filled' onClose={handleShankbarClose} severity={alert?.type} sx={{ width: '100%' }}>
          {alert?.message}
        </Alert>
      </Snackbar>

      <Grid container>
        <Grid item xs={12}>
          <TabContext value={value}>
            <TabList onChange={handleChange} aria-label='simple tabs example'>
              <Tab value='1' label='Request List' />
              <Tab value='2' label='Archive' />
              <Tab value='3' label='Calendar' />
            </TabList>
            <TabPanel value='1'>
              <Card>
                <CardHeader
                  title='List of Requests Leave'
                  action={
                    <Button
                      onClick={() => {
                        router.push({
                          pathname: 'request-leave/emergency',
                          query: {}
                        })
                      }}
                      variant='contained'
                      color='error'
                      size='small'
                    >
                      Emergency Leave
                    </Button>
                  }
                />
                <CardContent>
                  <CustomizeTable
                    isShow={isShow}
                    setAlert={setAlert}
                    deleteItemHandler={deleteItem}
                    id={'id'}
                    url={authConfig.request}
                    columns={columns}
                    route={'request-leave'}
                    actions={{
                      delete: auth.user?.role == 'admin' || auth.user?.role == 'user',
                      approve: auth.user?.role == 'admin' || auth.user?.role == 'manager',
                      reject: auth.user?.role == 'admin' || auth.user?.role == 'manager'
                    }}
                  />
                </CardContent>
              </Card>
              {fabs.map((fab, index) => (
                <Fab key={index} sx={fab.sx} onClick={fab.action} aria-label={fab.label} size={'large'}>
                  {fab.icon}
                </Fab>
              ))}
            </TabPanel>
            <TabPanel value='2'>
              <Card>
                <CardHeader
                  title='Previous Leave Requests'
               
                />
                <CardContent>
                  <CustomizeTable
                    isShow={isShow}
                    setAlert={setAlert}
                    deleteItemHandler={deleteItem}
                    id={'id'}
                    url={authConfig.archiveRequest}
                    columns={archiveColumns}
                    route={'request-leave'}
                   
                  />
                </CardContent>
              </Card>
            </TabPanel>
            <TabPanel value='3'>
              <AppCalendar />
            </TabPanel>
          </TabContext>
        </Grid>
      </Grid>
    </>
  )
}

export default RequestLeave
