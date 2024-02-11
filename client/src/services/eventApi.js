import axios from 'axios'
import { pollerUrls } from '../constants'

const getEvent = async () => {
  // Send request to every trusted poller
  const requests = pollerUrls.map((addr) =>
    axios.get(`${addr}/event`).catch((err) => console.log(err))
  )

  const responses = await Promise.all(requests)
  const successfulResponses = responses.filter(
    (response) => response && response.status === 200
  )

  const events = successfulResponses.map((res) => res.data)

  // Get the mode event

  return events[0]
}

export { getEvent }
