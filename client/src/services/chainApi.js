import axios from 'axios'
import { pollerUrls } from '../constants'

const getChain = async () => {
  // Send request to every trusted poller
  const requests = pollerUrls.map((addr) =>
    axios.get(`${addr}/chain`).catch((err) => err)
  )

  const responses = await Promise.all(requests)

  const successfulResponses = responses.filter(
    (response) => response && response.status === 200
  )

  const chains = successfulResponses.map((res) => res.data)

  // Get the mode chain

  return chains[0]
}

export { getChain }
