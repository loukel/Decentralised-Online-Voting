import axios from 'axios'
import { apiUrl } from '@/constants'

const createUser = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${apiUrl}/users/`,
      data,
    })
    return res.data
  } catch (error) {
    console.error(error)
    return error
  }
}

export { createUser }
