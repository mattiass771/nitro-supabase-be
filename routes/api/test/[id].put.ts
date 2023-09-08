import { z } from 'zod'
import supabase from '../../../db'
import { Database } from '../../../types/database'

const PayloadValidationSchema = z.object({
  test_string: z.string().nullable()
})

export default eventHandler(async (event) => {
  // get ID
  const { id } = event.context.params
  const payload = await readBody(event) as Database['public']['Tables']['test']['Update']

  // Payload validation
  const payloadValidation = PayloadValidationSchema.safeParse(payload)

  // Error on payload invalid
  if (payloadValidation.success === false) {
    return createError({
      statusCode: 400,
      statusMessage: payloadValidation.error.message,
      statusText: 'Bad Request'
    })
  }

  // Store table update to Redis cache
  const dataStorage = useStorage('table-updates')
  await dataStorage.setItem('test', `Updated to ${payload.test_string} at ${new Date().toISOString()}`)

  // Fetch data from supabase
  const { data, error } = await supabase
    .from('test')
    .update(payload)
    .eq('id', id)
    .select()

  if (error) {
    // error handling
    return createError({
      statusCode: 500,
      statusMessage: error.message,
      statusText: 'Internal Server Error'
    })
  }

  // return updated data as response
  return { statusCode: 200, statusMessage: `Row ${id} update successful.`, data: data[0] }
})
