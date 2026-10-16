import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { randomUUID } from 'node:crypto'
import { fileURLToPath } from 'node:url'

process.loadEnvFile(fileURLToPath(new URL('../.env.local', import.meta.url)))
const client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
})
const key = `website/_connection-tests/${randomUUID()}.txt`
const body = 'The Robot Age R2 connection test'
const target = { Bucket: process.env.R2_BUCKET, Key: key }
let uploaded = false
let stage = 'Upload'
try {
  await client.send(new PutObjectCommand({ ...target, Body: body, ContentType: 'text/plain', CacheControl: 'no-store' }))
  uploaded = true
  console.log('Upload: PASS')
  stage = 'Authenticated read'
  const result = await client.send(new GetObjectCommand(target))
  if (await result.Body.transformToString() !== body) throw new Error('Content mismatch')
  console.log('Authenticated read: PASS')
  stage = 'Public URL'
  const response = await fetch(`${process.env.R2_PUBLIC_BASE_URL.replace(/\/$/, '')}/${key}`, { signal: AbortSignal.timeout(20000) })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  if (await response.text() !== body) throw new Error('Content mismatch')
  console.log('Public URL: PASS')
} catch (error) {
  console.error(`${stage}: FAIL (${error.name}; ${error.cause?.code || error.code || error.$metadata?.httpStatusCode || error.message})`)
  process.exitCode = 1
} finally {
  if (uploaded) {
    try {
      await client.send(new DeleteObjectCommand(target))
      console.log('Temporary file cleanup: PASS')
    } catch {
      console.error(`Temporary file cleanup FAILED: ${key}`)
      process.exitCode = 1
    }
  }
}
