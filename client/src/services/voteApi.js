import axios from 'axios'
import { apiUrl } from '@/constants'

const createVote = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${apiUrl}/votes/`,
      data,
    })
    return res.data
  } catch (error) {
    console.error(error)
    return error
  }
}

const getVote = async (id) => {
  try {
    const res = await axios.get(`${apiUrl}/votes/${id}`)
    return res.data
  } catch (error) {
    console.error(error)
    return error
  }
}

export { createVote, getVote }
