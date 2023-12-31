import { z } from 'zod'
import supabase from '../../../db'
import { Database } from '../../../types/database'

const PayloadValidationSchema = z.object({
  test_string: z.string().nullable()
})

export default eventHandler(async (event) => {
  const payload = await readBody(
    event
  ) as Database['public']['Tables']['test']['Insert']

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

  // Fetch data from supabase
  const { data, error } = await supabase
    .from('test')
    .insert(payload)
    .select()

  if (error) {
    // error handling
    return createError({
      statusCode: 500,
      statusMessage: error.message,
      statusText: 'Internal Server Error'
    })
  }

  // Store table update to Redis cache
  const dataStorage = useStorage('table-updates')
  const cached = [await dataStorage.getItem('test')].flat() || []
  cached.push(`Inserted row ${data[0].id} with ${payload.test_string} at ${new Date().toISOString()}`)
  await dataStorage.setItem('test', cached)

  // return inserted data as response
  return { statusCode: 200, statusMessage: `Row ${data[0].id} insert successful.`, data: data[0] }
})
