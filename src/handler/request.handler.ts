import axios from 'axios'
import authConfig from 'src/configs/auth'

const instance = axios.create({
  baseURL: process.env.baseURL
})

const get = async (url: string, data = {}, lang = 'en') => {
  const token = window.localStorage.getItem(authConfig.storageTokenKeyName)!
  let res
  try {
    res = await instance.get(url, {
      params: data,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Accept-Language': lang
      }
    })
  } catch (error) {
    console.log(error)

    return null
  }

  return res?.data
}

const getFile = async (url: string) => {
  let res
  const token = window.localStorage.getItem(authConfig.storageTokenKeyName)!
  try {
    res = await instance.get(url, {
      headers: {
        responseType: 'blob', // important
        Authorization: `Bearer ${token}`,
        'Access-Control-Allow-Origin': '*',
        'Accept-Language': 'en'
      }
    })
    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), res.data], { type: 'text/csv;charset=utf-8;' })

    const file_url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = file_url
    link.setAttribute('download', 'data.csv') //or any other extension
    document.body.appendChild(link)
    link.click()
  } catch (error) {
    console.log(error)
  }
}
const getFileWithData = async (url: string, form_data: any) => {
  let res
  const token = window.localStorage.getItem(authConfig.storageTokenKeyName)!
  try {
    res = await instance.post(url, form_data, {
      headers: {
        responseType: 'blob', // important
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
        'Access-Control-Allow-Origin': '*',
        'Accept-Language': 'en'
      }
    })
    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), res.data], { type: 'text/csv;charset=utf-8;' })

    const file_url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = file_url
    link.setAttribute('download', 'data.csv') //or any other extension
    document.body.appendChild(link)
    link.click()
  } catch (error) {
    console.log(error)
  }
}

const post = async (url: string, form_data: any, lang = 'en') => {
  let res
  const token = window.localStorage.getItem(authConfig.storageTokenKeyName)!
  try {
    res = await instance.post(url, form_data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Accept-Language': lang
      }
    })
  } catch (error) {
    console.log(error)

    return error
  }

  return res?.data
}

const put = async (url: string, form_data: any, lang = 'en') => {
  let res
  const token = window.localStorage.getItem(authConfig.storageTokenKeyName)!
  try {
    res = await instance.put(url, form_data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Accept-Language': lang
      }
    })
  } catch (error) {
    console.log(error)

    return error
  }

  return res?.data
}

const multipart = async (url: string, form_data: any, lang = 'en') => {
  const token = window.localStorage.getItem(authConfig.storageTokenKeyName)!
  let res
  try {
    res = await instance.post(url, form_data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
        'Accept-Language': lang
      }
    })
  } catch (error: any) {
    console.log(error?.response)

    return error
  }

  return res?.data
}

const destroy = async (url: string, lang = 'en') => {
  const token = window.localStorage.getItem(authConfig.storageTokenKeyName)!

  let res
  try {
    res = await instance.delete(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Accept-Language': lang
      }
    })
  } catch (error) {
    console.log(error)

    return null
  }

  return res?.data
}

export { get, getFile, getFileWithData, post, put, multipart, destroy }
