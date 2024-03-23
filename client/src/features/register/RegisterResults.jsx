const RegisterResults = ({ voteTokens }) => {
  return (
    <>
      <h1 className='card-title text-secondary'>Register: Voting Tokens</h1>
      {voteTokens.map((T) => (
        <div className='form-control'>
          <span className='label-text font-bold'>{T.eventName}</span>
          <span>{T.signature}</span>
        </div>
      ))}
    </>
  )
}

export default RegisterResults
