import supabase from '../../db'

export default eventHandler(async (event) => {
  // get ID
  const { id } = event.context.params

  // Fetch data from supabase
  const { error } = await supabase
    .from('test')
    .delete()
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
  return { statusCode: 200, statusMessage: `Row ${id} delete successful.` }
})
