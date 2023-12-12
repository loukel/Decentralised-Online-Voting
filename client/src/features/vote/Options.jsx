const Options = ({ options, selectedOption, setSelectedOption }) => {
  return (
    <div className='overflow-x-auto my-4 cursor-pointer'>
      <table className='table'>
        {/* head */}
        <thead>
          <tr>
            <th className='w-4'></th>
            <th>Name</th>
            <th>ID</th>
          </tr>
        </thead>
        <tbody>
          {options.map((option) => (
            <tr
              className={
                option.id === selectedOption?.id
                  ? 'select-none bg-secondary text-white'
                  : 'select-none hover:bg-base-200'
              }
              onClick={(e) => setSelectedOption(option)}
            >
              <th>
                <label>
                  <input
                    type='checkbox'
                    className={
                      option.id === selectedOption?.id
                        ? 'checkbox checkbox-secondary'
                        : 'checkbox'
                    }
                    checked={option.id === selectedOption?.id}
                  />
                </label>
              </th>
              <td>
                <div className='flex items-center gap-3'>
                  <div>
                    <div className='font-bold'>{option.name}</div>
                    <div className='text-sm opacity-50'>{option.group}</div>
                  </div>
                </div>
              </td>
              <td>#{option.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Options
