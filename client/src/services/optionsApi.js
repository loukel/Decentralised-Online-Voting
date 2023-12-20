import axios from 'axios'
import { apiUrl } from '@/constants'

const createOption = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${apiUrl}/options/`,
      data,
    })
    return res.data
  } catch (error) {
    console.error(error)
    return error
  }
}

const getOption = async (id) => {
  try {
    const res = await axios.get(`${apiUrl}/options/${id}`)
    return res.data
  } catch (error) {
    console.error(error)
    return error
  }
}

export { createOption, getOption }
