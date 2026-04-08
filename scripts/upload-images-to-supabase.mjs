import { createClient } from '@supabase/supabase-js'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const BUCKET = 'meals'
const ASSETS_DIR = join(__dirname, '..', 'assets')

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

async function main() {
  // Create bucket if it doesn't exist
  const { data: buckets } = await supabase.storage.listBuckets()
  const exists = buckets?.some(b => b.name === BUCKET)

  if (!exists) {
    const { error } = await supabase.storage.createBucket(BUCKET, { public: true })
    if (error) { console.error('Create bucket error:', error.message); process.exit(1) }
    console.log(`✓ Created public bucket "${BUCKET}"`)
  } else {
    // Ensure bucket is public
    await supabase.storage.updateBucket(BUCKET, { public: true })
    console.log(`✓ Bucket "${BUCKET}" already exists (ensured public)`)
  }

  // Upload all image files from assets/
  const imageExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
  const files = readdirSync(ASSETS_DIR).filter(f => imageExts.includes(extname(f).toLowerCase()))

  for (const file of files) {
    const filePath = join(ASSETS_DIR, file)
    const buffer = readFileSync(filePath)
    const ext = extname(file).toLowerCase()
    const contentType = ext === '.png' ? 'image/png' : ext === '.gif' ? 'image/gif' : 'image/jpeg'

    const { error } = await supabase.storage.from(BUCKET).upload(file, buffer, {
      contentType,
      upsert: true,
    })

    if (error) {
      console.error(`  ✗ Failed to upload ${file}: ${error.message}`)
    } else {
      console.log(`  ✓ Uploaded ${file}`)
    }
  }

  console.log('\nDone! Supabase Storage public URL pattern:')
  console.log(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/<filename>`)
}

main().catch(err => { console.error(err); process.exit(1) })
