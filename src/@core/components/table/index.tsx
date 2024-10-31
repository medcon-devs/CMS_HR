import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import Icon from 'src/@core/components/icon'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import Image from 'next/image'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import { Send } from '@mui/icons-material'
import { LoaderIcon } from 'react-hot-toast'
import CircularProgressWithLabel from 'src/components/common/progress'
import authConfig from 'src/configs/auth'
import { get, post } from 'src/handler/request.handler'
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 380,
  maxHeight: 800,
  bgcolor: 'background.paper',
  border: '2px solid #e3e3e333',
  boxShadow: 24,
  p: 5,
  overflowY: 'scroll'
}

function CustomizeTable({
  additionalParam,
  id,
  columns,
  url,
  route,
  actions,
  refresh,
  setRefresh,
  deleteItemHandler,
  pushNotificationHandler,
  setAlert,
  isShow
}: any) {
  // ** Hooks
  const router = useRouter()

  //Variables
  const [rows, setRows] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, isLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(30)
  const selectedItem = null

  //Notification
  const [openNotification, setOpenNotification] = useState(false)
  const [notification, setNotification] = useState({
    title: ''
  })

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
    handle(errorCallback)
  }

  //Handle content of notification
  const onChangeNotificationHandle = (value: any) => {
    setNotification(value)
  }

  const handleNotificationClose = () => {
    setOpenNotification(false)
  }

  // const pushNotification = async (id: any) => {
  //   setSelectedItem(id)
  //   setOpenNotification(true)
  // }

  const handle = async (errorCallback: any) => {
    isLoading(true)
    try {
      const res = await get(url, {
        page: page + 1
      })

      if (res && res.status_code == 200) {
        setRows(res.data)
        setTotal(res.total)
        isLoading(false)
      }
    } catch (e) {
      if (errorCallback) errorCallback(e)
      isLoading(false)
    }
  }

  const errorCallback = (err: any) => {
    console.log(err)
    isLoading(false)
  }

  const editItem = async (id: any) => {
    router.push({
      pathname: route + '/details',
      query: { id: id, ...additionalParam }
    })
  }

  const approveItem = async (id: any) => {
    try {
      isLoading(true)
      const data = {
        'new-status': 'approved'
      }
      const res = await post(authConfig.requestStatus + '/' + id, data)
      if (res && res.status_code == 200) {
        isLoading(false)
        setAlert({
          type: 'success',
          message: 'Leave request is approved'
        })
        handle(errorCallback)
      } else {
        setAlert({
          type: 'error',
          message: 'Error in request, please try again'
        })
        isLoading(false)
        isShow(true)
      }
    } catch (e) {
      console.log(e)
      isLoading(false)
      setAlert({
        type: 'error',
        message: 'Error in request, please try again'
      })
      isShow(true)
    }
  }

  const rejectItem = async (id: any) => {
    try {
      isLoading(true)
      const data = {
        'new-status': 'rejected'
      }
      const res = await post(authConfig.requestStatus + '/' + id, data)
      if (res && res.status_code == 200) {
        setAlert({
          type: 'success',
          message: 'Leave request is rejected'
        })
        handle(errorCallback)
      } else {
        setAlert({
          type: 'error',
          message: 'Error in request, please try again'
        })
        isLoading(false)
        isShow(true)
      }
    } catch (e) {
      console.log(e)
      isLoading(false)
      setAlert({
        type: 'error',
        message: 'Error in request, please try again'
      })
      isShow(true)
    }
  }

  const changeStatus = async (id: any) => {
    try {
      isLoading(true)

      const res = await post(authConfig.changeStatus + '/' + id, {})
      if (res && res.status_code == 200) {
        setAlert({
          type: 'success',
          message: 'Request status has been updated'
        })
        handle(errorCallback)
      } else {
        setAlert({
          type: 'error',
          message: 'Error in request, please try again'
        })
        isLoading(false)
        isShow(true)
      }
    } catch (e) {
      console.log(e)
      isLoading(false)
      setAlert({
        type: 'error',
        message: 'Error in request, please try again'
      })
      isShow(true)
    }
  }
  const pushNotificationSubmit = async () => {
    try {
      isLoading(true)

      const data = {
        notification: notification,
        notification_type: 'event'
      }
      const res = await pushNotificationHandler(selectedItem, data)
      if (res && res.status_code == 200) {
        setAlert({
          type: 'success',
          message: 'The Notification has been successfully pushed to invited users'
        })
        handle(errorCallback)
        isLoading(false)
        setOpenNotification(false)
        isShow(true)
      } else {
        setAlert({
          type: 'error',
          message: 'Error in request, please try again'
        })
        isLoading(false)
        isShow(true)
      }
    } catch (e) {
      console.log(e)
      isLoading(false)
      setAlert({
        type: 'error',
        message: 'Error in request, please try again'
      })
      isShow(true)
    }
  }

  const deleteItem = async (id: any) => {
    try {
      isLoading(true)
      const res = await deleteItemHandler(id)
      isLoading(false)
      if (res && res.status_code == 200) {
        setAlert({
          type: 'success',
          message: 'Item has been deleted successfully'
        })
        handle(errorCallback)
        isShow(true)
      } else {
        isLoading(false)
        setAlert({
          type: 'error',
          message: 'Error in request, please try again'
        })
        isShow(true)
      }
    } catch (e) {
      console.log(e)
      setAlert({
        type: 'error',
        message: 'Error in request, please try again'
      })
      isShow(true)
      isLoading(false)
    }
  }

  const confirmDelete = (id: any) => {
    const options = {
      closeOnEscape: true,
      closeOnClickOutside: true,
      keyCodeForClose: [8, 32],
      overlayClassName: 'overlay-custom-class-name',
      customUI: ({ onClose }: any) => {
        return (
          <Card sx={{ width: 400, p: 2 }}>
            <CardContent>
              <Grid item xs={12}>
                <Typography color={'error'} mt={2} variant={'h4'}>
                  Warning
                </Typography>
                <Typography variant={'subtitle1'}>Are you sure,You want to delete this record?</Typography>
              </Grid>
              <Grid display={'flex'} justifyContent={'flex-end'}>
                <Button sx={{ m: 1 }} variant='contained' color='error' onClick={onClose}>
                  No
                </Button>
                <Button
                  sx={{ m: 1 }}
                  variant='contained'
                  color='info'
                  onClick={() => {
                    deleteItem(id)
                    onClose()
                  }}
                >
                  Yes, Delete it!
                </Button>
              </Grid>
            </CardContent>
          </Card>
        )
      }
    }

    confirmAlert(options)
  }

  useEffect(() => {
    handle(errorCallback)
  }, [page])

  useEffect(() => {
    if (refresh) {
      handle(errorCallback)
      setRefresh(false)
    }
  }, [refresh])

  return (
    <>
      {loading ? (
        <>
          <Grid
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <CircularProgress
              disableShrink
              sx={{
                mt: 2
              }}
            />
          </Grid>
        </>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
            <Table stickyHeader aria-label='sticky table'>
              <TableHead>
                <TableRow>
                  {columns.map((column: any) => (
                    <TableCell
                      key={column.id + Math.floor(Math.random() * 100)}
                      align={column.align}
                      sx={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                  {actions?.edit || actions?.delete || actions?.approve || actions?.reject || actions?.status ? (
                    <>
                      <TableCell align={'center'}>Action</TableCell>
                    </>
                  ) : (
                    <></>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows &&
                  rows.map((item: any, key: number) => {
                    return (
                      <TableRow hover tabIndex={-1} key={Math.floor(Math.random() * 10000)}>
                        {columns.map((column: any) => (
                          <TableCell
                            key={column.id + '-' + key + Math.floor(Math.random() * 100)}
                            align={column.align}
                            sx={{ minWidth: column.minWidth, maxWidth: column.maxWidth }}
                          >
                            {column.type == 'image' ? (
                              <>
                                <Grid
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                  }}
                                >
                                  {item[column.id] != '' ? (
                                    <>
                                      <Image
                                        loading='lazy'
                                        src={column.key ? item[column.id][column.key] : item[column.id]}
                                        alt='Image Alt'
                                        width={100}
                                        height={100}
                                        style={{ objectFit: 'contain' }}
                                      />
                                    </>
                                  ) : (
                                    <>--</>
                                  )}
                                </Grid>
                              </>
                            ) : (
                              <>
                                {column.type == 'object' ? (
                                  <>
                                    {column.message ? (
                                      <>
                                        <Chip
                                          label={item[column.id][column.key]}
                                          variant='filled'
                                          color={item[column.id][column.message]}
                                        />
                                      </>
                                    ) : (
                                      <>
                                        <Typography
                                          dangerouslySetInnerHTML={{ __html: item[column.id][column.key] }}
                                        ></Typography>
                                      </>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    {column.type == 'array' ? (
                                      <List dense sx={{ width: '100%', textAlign: 'center' }}>
                                        {item[column.id]?.map((arrItem: any, arrKey: any) => {
                                          return (
                                            <ListItem sx={{ textAlign: 'center' }} key={arrKey} disablePadding>
                                              <ListItemText primary={arrItem[column.key]} />
                                            </ListItem>
                                          )
                                        })}
                                      </List>
                                    ) : (
                                      <>
                                        {column.type == 'date' ? (
                                          dayjs(item[column.id]).format('DD MMM YYYY HH:mmA')
                                        ) : column.type == 'text' ? (
                                          column.colored ? (
                                            <Chip
                                              label={item[column.id]}
                                              variant='filled'
                                              sx={{ textTransform: 'capitalize' }}
                                              color={column.colored}
                                            />
                                          ) : (
                                            item[column.id]
                                          )
                                        ) : column.type == 'progress' ? (
                                          <CircularProgressWithLabel value={item[column.id]} />
                                        ) : null}
                                      </>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </TableCell>
                        ))}
                        {actions?.edit || actions?.delete || actions?.approve || actions?.reject || actions?.status ? (
                          <>
                            <TableCell sx={{ minWidth: 200 }} align={'center'}>
                              {actions?.approve ? (
                                <Tooltip title='Approve the request'>
                                  <IconButton
                                    sx={{ m: 1 }}
                                    color='success'
                                    size='small'
                                    disabled={item.status.value != 'pending'}
                                    onClick={() => {
                                      approveItem(item[id])
                                    }}
                                  >
                                    <Icon icon='mdi:check' />
                                  </IconButton>
                                </Tooltip>
                              ) : null}
                              {actions?.reject ? (
                                <Tooltip title='Reject the request'>
                                  <IconButton
                                    color='error'
                                    size='small'
                                    disabled={item.status.value != 'pending'}
                                    onClick={() => {
                                      rejectItem(item[id])
                                    }}
                                  >
                                    <Icon icon='mdi:close' />
                                  </IconButton>
                                </Tooltip>
                              ) : null}
                              {actions?.status ? (
                                <Tooltip title='Change the status of record'>
                                  <IconButton
                                    color={item._status ? 'error' : 'info'}
                                    onClick={() => {
                                      changeStatus(item[id])
                                    }}
                                  >
                                    <ChangeCircleIcon color={item._status ? 'error' : 'info'} />
                                  </IconButton>
                                </Tooltip>
                              ) : null}
                              {actions?.edit ? (
                                <Tooltip title='Edit the record'>
                                  <IconButton
                                    color='info'
                                    onClick={() => {
                                      editItem(item[id])
                                    }}
                                  >
                                    <Icon icon='mdi:edit' />
                                  </IconButton>
                                </Tooltip>
                              ) : (
                                <></>
                              )}
                              {actions?.delete ? (
                                <Tooltip title='Delete the record'>
                                  <IconButton
                                    color='error'
                                    onClick={() => {
                                      confirmDelete(item[id])
                                    }}
                                  >
                                    <Icon icon='mdi:delete' />
                                  </IconButton>
                                </Tooltip>
                              ) : (
                                <></>
                              )}
                            </TableCell>
                          </>
                        ) : (
                          <></>
                        )}
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[30]}
            component='div'
            rowsPerPage={rowsPerPage}
            count={total}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          <Modal
            open={openNotification}
            onClose={handleNotificationClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Box sx={style}>
              <Typography sx={{ display: 'flex', justifyContent: 'center' }} variant='h5' mt={2}>
                Push Notification
              </Typography>
              <Grid item xs={12} mt={6}>
                <TextField
                  value={notification?.title}
                  helperText='Please enter notification title'
                  fullWidth
                  multiline
                  minRows={4}
                  onChange={input => {
                    onChangeNotificationHandle(input.target.value)
                  }}
                  label='Notification title'
                  variant='standard'
                />
              </Grid>
              {loading ? (
                <>
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}
                  >
                    <CircularProgress
                      disableShrink
                      sx={{
                        mt: 2
                      }}
                    />
                  </Box>
                </>
              ) : (
                <>
                  <Grid sx={{ display: 'flex', justifyContent: 'flex-end' }} item xs={12} mt={6}>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={pushNotificationSubmit}
                      endIcon={!loading ? <Send /> : <LoaderIcon />}
                    >
                      Push
                    </Button>
                    <Button onClick={handleNotificationClose}>Cancel</Button>
                  </Grid>
                </>
              )}
            </Box>
          </Modal>
        </>
      )}
    </>
  )
}

export default CustomizeTable
