import axios from 'axios'
import { pollerUrls } from '../constants'

const getEvent = async () => {
  // Send request to every trusted poller
  const requests = pollerUrls.map((addr) =>
    axios.get(`${addr}/event`).catch((err) => err)
  )

  const responses = await Promise.all(requests)

  const successfulResponses = responses.filter(
    (response) => response && response.status === 200
  )

  const event = successfulResponses[0]
  if (successfulResponses.every((element) => element == event)) {
    return event.data
  } else {
    return {}
  }
}

export { getEvent }
