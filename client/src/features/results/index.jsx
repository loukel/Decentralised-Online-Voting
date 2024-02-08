import { useRef } from 'react'
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
  ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale)

  if (event === -1) {
    return 'no event'
  }

  console.log(event)

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
        <h1 className='card-title text-secondary'>{event.name}</h1>
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
      </div>
    </div>
  )
}

export default Results
