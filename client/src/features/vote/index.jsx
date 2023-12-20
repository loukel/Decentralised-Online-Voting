import { useState } from 'react'
import Options from './Options'

const Vote = ({ event }) => {
  const [selectedOption, setSelectedOption] = useState()

  // const options = [
  //   {
  //     name: 'Hart Hagerty',
  //     group: 'Liberal Democrats',
  //     id: '3',
  //   },
  //   {
  //     name: 'Brice Swyre',
  //     group: 'Green Party',
  //     id: '2',
  //   },
  //   {
  //     name: 'Marjy Ferencz',
  //     group: 'Labour',
  //     id: '1',
  //   },
  //   {
  //     name: 'Yancy Tear',
  //     group: 'Conservative',
  //     id: '4',
  //   },
  // ]

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
        <h1 class='card-title text-secondary'>Voting Form - {event.name}</h1>
        {/* ID input */}
        <label className='form-control w-full'>
          <div className='label'>
            <span className='label-text text-secondary'>ID</span>
          </div>
          <input
            type='text'
            placeholder='Type here'
            className='input input-bordered w-full'
          />
        </label>
        {/* Secret Key input */}
        <label className='form-control w-full'>
          <div className='label'>
            <span className='label-text text-secondary'>Secret Key</span>
          </div>
          <input
            type='password'
            placeholder='Type here'
            className='input input-bordered w-full'
          />
        </label>
        <Options
          options={event.options}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
        <div className='card-actions mx-auto'>
          <button className='btn btn-secondary w-40'>Submit</button>
        </div>
      </div>
    </div>
  )
}

export default Vote
