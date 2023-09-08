import supabase from '../../db'

export default eventHandler(async () => {
  // Fetch data from supabase
  const { data, error } = await supabase
    .from('test')
    .select()

  if (error) {
    // error handling
    return createError({
      statusCode: 500,
      statusMessage: error.message,
      statusText: 'Internal Server Error'
    })
  }

  // return data as response
  return data
})
