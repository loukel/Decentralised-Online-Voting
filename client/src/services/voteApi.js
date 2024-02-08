import axios from 'axios'
import { pollerUrls } from '../constants'

const sendVote = (pollerAddr, data) => {
  return axios({
    method: 'POST',
    url: `${pollerAddr}/transaction`,
    data,
  })
}

const broadcastVote = async (data) => {
  try {
    // Send to all pollers
    const requests = pollerUrls.map((addr) =>
      sendVote(addr, data).catch((err) => err)
    )

    // Send requests
    const responses = await Promise.all(requests)

    // Get requests that were successful
    const successfulResponses = responses.filter(
      (response) => response && response.status === 201
    )

    // Return number of pollers that received votes
    return successfulResponses.length
  } catch (error) {
    console.error(error)
    return error
  }
}

export { broadcastVote }
