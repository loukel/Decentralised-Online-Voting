import axios from 'axios'
import { apiUrl } from '../constants'

const createEvent = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${apiUrl}/events/`,
      data,
    })
    return res.data
  } catch (error) {
    console.error(error)
    return error
  }
}

const getEvents = async (id) => {
  try {
    const res = await axios.get(`${apiUrl}/events`)
    return res.data
  } catch (error) {
    console.error(error)
    return error
  }
}

export { createEvent, getEvents }
