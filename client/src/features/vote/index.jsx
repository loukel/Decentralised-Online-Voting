import { useState } from 'react'
import Options from './Options'
import { broadcastVote } from '../../services/voteApi'
import { useNavigate } from 'react-router-dom'

const Vote = ({ event }) => {
  const navigate = useNavigate()

  const [id, setId] = useState('')
  // const [secretKey, setSecretKey] = useState('')
  const [selectedOption, setSelectedOption] = useState(-1)
  const [countdown, setCountdown] = useState('')
  const [disabled, setDisabled] = useState(true)

  const startDate = new Date(event.start_date)
  const endDate = new Date(event.end_date)

  const updateCountdown = () => {
    const now = new Date()
    if (now < startDate) {
      const difference = startDate - now
      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((difference / 1000 / 60) % 60)
      const seconds = Math.floor((difference / 1000) % 60)

      if (seconds == 0) {
        setCountdown('Started')
      } else {
        setCountdown(
          ` - Starting in ${days == 0 ? '' : days + ' days'}  ${
            hours == 0 ? '' : hours + ' hours'
          } ${minutes == 0 ? '' : minutes + ' minutes'} ${
            seconds == 0 ? '' : seconds + ' seconds'
          }`
        )
      }
    } else {
      const difference = endDate - now

      if (difference <= 0) {
        clearInterval(intervalId)
        setCountdown(' - Finished')
        setDisabled(true)
        return
      } else {
        setDisabled(false)
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((difference / 1000 / 60) % 60)
      const seconds = Math.floor((difference / 1000) % 60)

      setCountdown(
        ` - Ending in ${days == 0 ? '' : days + ' days'}  ${
          hours == 0 ? '' : hours + ' hours'
        } ${minutes == 0 ? '' : minutes + ' minutes'} ${
          seconds == 0 ? '' : seconds + ' seconds'
        }`
      )
    }
  }
  const intervalId = setInterval(updateCountdown, 1000)

  const onSubmit = async () => {
    if (!id) {
      return alert('Missing ID')
    } else if (selectedOption === -1) {
      return alert('Select an option to vote for')
    }

    const txData = {
      amount: 1,
      sender: id,
      receiver: selectedOption.id,
    }
    const received = await broadcastVote(txData)
    setId('')
    setSelectedOption(-1)
    console.log(received)
    // navigate(`/results`)
  }

  if (event === -1) {
    return (
      <div class='card w-full bg-base-100 shadow-xl'>
        <div class='card-body'>
          <h1 class='card-title text-secondary'>No Event</h1>
        </div>
      </div>
    )
  }

  return (
    <div class='card w-full bg-base-100 shadow-xl'>
      <div class='card-body'>
        <h1 class='card-title text-secondary'>
          Voting Form: {event.name} {countdown}
        </h1>
        {/* ID input */}
        <label className='form-control w-full'>
          <div className='label'>
            <span className='label-text text-secondary'>ID</span>
          </div>
          <input
            type='text'
            placeholder='Type here'
            className='input input-bordered w-full'
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </label>
        {/* Secret Key input */}
        {/* <label className='form-control w-full'>
          <div className='label'>
            <span className='label-text text-secondary'>Secret Key</span>
          </div>
          <input
            type='password'
            placeholder='Type here'
            className='input input-bordered w-full'
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
          />
        </label> */}
        <Options
          options={event.candidates}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
        <div className='card-actions mx-auto'>
          <button
            className='btn btn-secondary w-40'
            onClick={onSubmit}
            disabled={disabled}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default Vote
