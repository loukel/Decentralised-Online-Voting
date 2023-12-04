const Vote = () => {
  return (
    <div class='card w-full bg-base-100 shadow-xl'>
      <div class='card-body'>
        <h1 class='card-title text-secondary'>Voting Form</h1>
        {/* ID input */}
        <label className='form-control w-full'>
          <div className='label'>
            <span className='label-text text-secondary'>ID?</span>
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
            <span className='label-text text-secondary'>Secret Key?</span>
          </div>
          <input
            type='password'
            placeholder='Type here'
            className='input input-bordered w-full'
          />
        </label>
        {/* Table of options */}
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
              {/* row 1 */}
              <tr className='hover:bg-base-200 bg-secondary text-white'>
                <th>
                  <label>
                    <input
                      type='checkbox'
                      className='checkbox  checkbox-secondary'
                    />
                  </label>
                </th>
                <td>
                  <div className='flex items-center gap-3'>
                    <div>
                      <div className='font-bold'>Hart Hagerty</div>
                      <div className='text-sm opacity-50'>
                        Liberal Democrats
                      </div>
                    </div>
                  </div>
                </td>
                <td>#3</td>
              </tr>
              {/* row 2 */}
              <tr className='hover:bg-base-200'>
                <th>
                  <label>
                    <input type='checkbox' className='checkbox' />
                  </label>
                </th>
                <td>
                  <div className='flex items-center gap-3'>
                    <div>
                      <div className='font-bold'>Brice Swyre</div>
                      <div className='text-sm opacity-50'>Green Party</div>
                    </div>
                  </div>
                </td>
                <td>#2</td>
              </tr>
              {/* row 3 */}
              <tr className='hover:bg-base-200'>
                <th>
                  <label>
                    <input type='checkbox' className='checkbox' />
                  </label>
                </th>
                <td>
                  <div className='flex items-center gap-3'>
                    <div>
                      <div className='font-bold'>Marjy Ferencz</div>
                      <div className='text-sm opacity-50'>Labour</div>
                    </div>
                  </div>
                </td>
                <td>#1</td>
              </tr>
              {/* row 4 */}
              <tr>
                <th>
                  <label>
                    <input type='checkbox' className='checkbox' />
                  </label>
                </th>
                <td>
                  <div className='flex items-center gap-3'>
                    <div>
                      <div className='font-bold'>Yancy Tear</div>
                      <div className='text-sm opacity-50'>Conservative</div>
                    </div>
                  </div>
                </td>
                <td>#4</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='card-actions items-center'>
          <button className='btn btn-secondary w-40'>Submit</button>
        </div>
      </div>
    </div>
  )
}

export default Vote
