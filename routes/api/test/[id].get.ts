import supabase from '../../../db'

export default eventHandler(async (event) => {
  // get ID
  const { id } = event.context.params
  // Fetch data from supabase
  const { data, error } = await supabase
    .from('test')
    .select()
    .eq('id', id)

  if (error) {
    // error handling
    return createError({
      statusCode: 500,
      statusMessage: error.message,
      statusText: 'Internal Server Error'
    })
  }

  // return data as response
  return data[0]
})
