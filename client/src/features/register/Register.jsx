import { useState } from 'react'

const Register = ({ register }) => {
  const [newAccount, setNewAccount] = useState(true)
  const [address, setAddress] = useState('')
  const [credential1, setCredentrial1] = useState('')
  const [credential2, setCredentrial2] = useState('')

  return (
    <>
      <h1 className='card-title text-secondary'>Register: Authentication</h1>
      <div className='flex justify-center gap-10'>
        <div className='form-control'>
          <span className='label-text'>New Account</span>
          <input
            type='radio'
            name='address'
            className='radio checked:bg-blue-500 mt-2 m-auto'
            onChange={(e) => (e.target.checked ? setNewAccount(true) : null)}
            defaultChecked
          />
        </div>
        <div className='form-control'>
          <span className='label-text'>Existing Account</span>
          <input
            type='radio'
            name='address'
            className='radio checked:bg-blue-500 mt-2 m-auto'
            onChange={(e) => (e.target.checked ? setNewAccount(false) : null)}
          />
        </div>
      </div>
      {!newAccount && (
        <label className='form-control w-full'>
          <div className='label'>
            <span className='label-text text-secondary'>Account Address</span>
          </div>
          <input
            placeholder='Type here'
            className='input input-bordered w-full'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
      )}
      <label className='form-control w-full'>
        <div className='label'>
          <span className='label-text text-secondary'>Passport Number</span>
        </div>
        <input
          placeholder='Type here'
          className='input input-bordered w-full'
          value={credential1}
          onChange={(e) => setCredentrial1(e.target.value)}
        />
      </label>
      <label className='form-control w-full'>
        <div className='label'>
          <span className='label-text text-secondary'>
            National Insurance Number
          </span>
        </div>
        <input
          placeholder='Type here'
          className='input input-bordered w-full'
          value={credential2}
          onChange={(e) => setCredentrial2(e.target.value)}
        />
      </label>
      <div className='card-actions mx-auto mt-5'>
        <button className='btn btn-secondary w-40' onClick={register}>
          Submit
        </button>
      </div>
    </>
  )
}

export default Register
