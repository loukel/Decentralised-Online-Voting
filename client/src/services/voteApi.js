import axios from 'axios'
import { pollerUrls } from '../constants'

const submitVote = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${pollerUrls[0]}/transaction`,
      data,
    })
    return res.data
  } catch (error) {
    console.error(error)
    return error
  }
}

// const getVote = async (id) => {
//   try {
//     const res = await axios.get(`${apiUrl}/votes/${id}`)
//     return res.data
//   } catch (error) {
//     console.error(error)
//     return error
//   }
// }

export { submitVote }
