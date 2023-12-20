import { useState } from 'react'
import { createEvent } from '../../services/eventApi'
import { useNavigate } from 'react-router-dom'

const Admin = ({ events }) => {
  // Check if event is currently running
  // If not enable the creation of another + options
  const navigate = useNavigate()
  const today = new Date()
  let tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)

  // Function Copied from generative AI (GPT)
  function formatDate(date) {
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear().toString().substr(-2)

    day = day < 10 ? '0' + day : day
    month = month < 10 ? '0' + month : month

    return day + '/' + month + '/' + year
  }

  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState(formatDate(today))
  const [startTime, setStartTime] = useState('00:00')
  const [endDate, setEndDate] = useState(formatDate(tomorrow))
  const [endTime, setEndTime] = useState('00:00')

  const [options, setOptions] = useState([
    {
      id: 0,
      name: '',
      descriptor: '',
    },
  ])

  const addOption = () => {
    setOptions([
      ...options,
      {
        id: crypto.randomUUID(),
        name: '',
        descriptor: '',
      },
    ])
  }

  const updateName = (id, name) => {
    if (name === '' && id !== 0) {
      return setOptions(options.filter((option) => option.id !== id))
    }

    setOptions(
      options.map((option) => {
        if (option.id === id) {
          return {
            ...option,
            name,
          }
        }
        return option
      })
    )
  }

  const updateDescriptor = (id, descriptor) => {
    setOptions(
      options.map((option) => {
        if (option.id === id) {
          return {
            ...option,
            descriptor,
          }
        }
        return option
      })
    )
  }

  const validateDate = (date) => {
    const regex = /^\d{2}\/\d{2}\/\d{2,4}$/

    return regex.test(date)
  }

  // Function created using generative AI (chatGPT)
  function createDateTime(dateString, timeString) {
    // Split the date string and rearrange it into YYYY-MM-DD format
    let [day, month, year] = dateString.split('/')
    year = '20' + year // Adjusting YY to YYYY (assuming 2000s)
    let formattedDate = `${year}-${month}-${day}`

    // Combine with time string (assumed to be in HH:MM format)
    let dateTimeString = `${formattedDate}T${timeString}:00`

    // Create a new Date object
    return new Date(dateTimeString)
  }

  const onSubmit = async () => {
    let filteredOptions = options.filter((option) => option.name !== '')
    filteredOptions = filteredOptions.map((option) => {
      delete option.id
      return option
    })

    if (!name) {
      return alert('Missing Name')
    } else if (!validateDate(startDate)) {
      console.log(startDate)
      return alert('Incorrect Start Date')
    } else if (!validateDate(endDate)) {
      return alert('Incorrect End Date')
    } else if (filteredOptions.length < 2) {
      return alert('Need more than 2 options')
    }

    const data = {
      name,
      startDateTime: createDateTime(startDate, startTime),
      endDateTime: createDateTime(endDate, endTime),
      options: filteredOptions,
    }

    // Check if an event already takes place at this time
    let timeTaken = false
    events.forEach((e) => {
      if (
        data.startDateTime >= new Date(e.startDateTime) &&
        data.endDateTime <= new Date(e.endDateTime)
      ) {
        return (timeTaken = true)
      } else if (
        new Date(data.startDateTime) >= new Date(e.startDateTime) &&
        new Date(data.startDateTime) <= new Date(e.endDateTime)
      ) {
        return (timeTaken = true)
      } else if (
        new Date(data.endDateTime) >= new Date(e.startDateTime) &&
        new Date(data.endDateTime) <= new Date(e.endDateTime)
      ) {
        return (timeTaken = true)
      }
    })

    if (timeTaken) {
      return alert('Event already taking place at this time')
    }

    await createEvent(data)
    navigate('/')
  }

  return (
    <div className='card w-full bg-base-100 shadow-xl'>
      <div className='card-body'>
        <h1 className='card-title text-secondary'>Event Form</h1>
        {/* Name input */}
        <label className='form-control w-full'>
          <div className='label'>
            <span className='label-text text-secondary'>Name</span>
          </div>
          <input
            type='text'
            placeholder='Type here'
            className='input input-bordered w-full'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        {/* Start datetime */}
        <div className='flex gap-5'>
          <label className='form-control w-full'>
            <div className='label'>
              <span className='label-text text-secondary'>Start Date</span>
            </div>
            <input
              type='text'
              placeholder='Type here'
              className='input input-bordered'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label className='form-control w-full'>
            <div className='label'>
              <span className='label-text text-secondary'>Start Time</span>
            </div>
            <input
              type='text'
              placeholder='Type here'
              className='input input-bordered'
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </label>
        </div>

        {/* End datetime */}
        <div className='flex gap-5 mb-5'>
          <label className='form-control w-full'>
            <div className='label'>
              <span className='label-text text-secondary'>End Date</span>
            </div>
            <input
              type='text'
              placeholder='Type here'
              className='input input-bordered'
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
          <label className='form-control w-full'>
            <div className='label'>
              <span className='label-text text-secondary'>End Time</span>
            </div>
            <input
              type='text'
              placeholder='Type here'
              className='input input-bordered'
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </label>
        </div>

        {/* Options */}
        <h2 className='text-secondary text-lg'>Options</h2>
        <div className='flex gap-5 mb-5'>
          <label className='form-control w-full'>
            <div className='label'>
              <span className='label-text text-secondary'>Name</span>
            </div>
            <input
              type='text'
              placeholder='Type here'
              className='input input-bordered'
              onBlur={(e) => updateName(0, e.target.value)}
            />
          </label>
          <label className='form-control w-full'>
            <div className='label'>
              <span className='label-text text-secondary'>Descriptor</span>
            </div>
            <input
              type='text'
              placeholder='Type here'
              className='input input-bordered'
              onBlur={(e) => updateDescriptor(0, e.target.value)}
            />
          </label>
        </div>
        {options.slice(1).map((option) => (
          <div className='flex gap-5 mb-5' key={option.id}>
            <label className='form-control w-full'>
              <input
                type='text'
                placeholder='Type here'
                className='input input-bordered'
                onBlur={(e) => updateName(option.id, e.target.value)}
              />
            </label>
            <label className='form-control w-full'>
              <input
                type='text'
                placeholder='Type here'
                className='input input-bordered'
                onBlur={(e) => updateDescriptor(option.id, e.target.value)}
              />
            </label>
          </div>
        ))}
        <button className='btn mb-5' onClick={addOption}>
          Add Option
        </button>

        <div className='card-actions mx-auto'>
          <button className='btn btn-secondary w-40' onClick={onSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default Admin
