import { useRef, useState } from 'react'
import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js'

const Results = ({ event, chain }) => {
  const [countdown, setCountdown] = useState('')

  ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale)

  if (event === -1) {
    return 'no event'
  }

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
          `Starting in ${days == 0 ? '' : days + ' days'}  ${
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
        setCountdown('Finished')
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((difference / 1000 / 60) % 60)
      const seconds = Math.floor((difference / 1000) % 60)

      setCountdown(
        `Ending in ${days == 0 ? '' : days + ' days'}  ${
          hours == 0 ? '' : hours + ' hours'
        } ${minutes == 0 ? '' : minutes + ' minutes'} ${
          seconds == 0 ? '' : seconds + ' seconds'
        }`
      )
    }
  }
  const intervalId = setInterval(updateCountdown, 1000)

  const votesData = chain
    .slice(1)
    .reduce((acc, obj) => acc.concat(obj.transactions), [])

  let options = [...new Set(votesData.map((vote) => vote.receiver))]
  const votes = options.map(
    (id) => votesData.filter((vote) => vote.receiver == id).length
  )

  // Clean up the display of options
  options = options.map((id) => {
    const candidateDetails = event.candidates.filter(
      (candidate) => candidate.id == id
    )

    if (candidateDetails.length) {
      return candidateDetails[0].name
    } else {
      return id
    }
  })

  const totalVotes = votes.reduce((acc, curr) => acc + curr, 0)

  const data = {
    labels: options,
    datasets: [
      {
        label: totalVotes,
        data: votes,
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
        ],
      },
    ],
  }

  const chartRef = useRef()

  return (
    <div className='card w-full bg-base-100 shadow-xl'>
      <div className='card-body'>
        <h1 className='card-title text-secondary'>
          {event.name} - {countdown}
        </h1>
        <div className='h-96 flex justify-center m-5'>
          <Pie ref={chartRef} data={data} />
        </div>
        <div className='flex gap-5 justify-center flex-wrap'>
          {options.map((option, index) => (
            <div className='overflow-hidden text-ellipsis break-normal w-1/3'>
              <b>{option}:</b>{' '}
              {Math.round(((votes[index] * 100) / totalVotes) * 10) / 10}%
            </div>
          ))}
        </div>
        <div className='flex gap-5 justify-center flex-wrap'>
          <h1 className='card-title text-secondary'>
            {totalVotes} / {chain[0].transactions.length}
          </h1>
        </div>
      </div>
    </div>
  )
}

export default Results
