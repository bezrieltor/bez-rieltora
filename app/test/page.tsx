import { supabase } from '@/lib/supabase'

export default async function TestPage() {
  const { data, error } = await supabase
    .from('listings')
    .select('*')

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>❌ Error</h1>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>✅ Supabase працює</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
