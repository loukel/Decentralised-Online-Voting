import { useState } from 'react'
import Register from './Register'
import RegisterResults from './RegisterResults'

const RegisterForm = () => {
  const [voteTokens, setVoteTokens] = useState([])
  const register = ({ newAccount = false, address = '', c1, c2 }) => {
    // Generate vote token for each event
    // Send c1 to r1
    // c2 to r2
    // Receive vote tokens (signature) from r2
    if (newAccount) {
      // Generate public/private keys
      address = '321'
    }

    const tokens = [
      {
        eventName: '1',
        signature: 'A1',
        address,
      },
      {
        eventName: '2',
        signature: 'B1',
        address,
      },
    ]

    setVoteTokens(tokens)
  }

  return (
    <div className='card w-full bg-base-100 shadow-xl'>
      <div className='card-body'>
        {voteTokens.length == 0 ? (
          <Register register={register} />
        ) : (
          <RegisterResults voteTokens={voteTokens} />
        )}
      </div>
    </div>
  )
}

export default RegisterForm
