import sharp from 'sharp'

export async function generateThumbnail(prompt: string, style: string): Promise<string> {
  const seed = Math.floor(Math.random() * 1000000)
  
  // Use enhance=true for better prompt understanding
  const params = new URLSearchParams({
    width: '1280',
    height: '720',
    nologo: 'true',
    seed: seed.toString(),
    enhance: 'true'
  })
  
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params.toString()}`

  console.log(`Generating: ${prompt}`)

  const maxRetries = 20
  let imageBuffer: Buffer | null = null
  let bestBuffer: Buffer | null = null
  let bestSize = 0

  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(url + '&t=' + Date.now(), {
        signal: AbortSignal.timeout(45000),
      })
      
      if (res.ok) {
        const contentType = res.headers.get('content-type') || ''
        if (contentType.includes('image')) {
          const arrayBuffer = await res.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)
          
          if (buffer.length > bestSize) {
            bestSize = buffer.length
            bestBuffer = buffer
          }
          
          if (buffer.length > 50000) {
            imageBuffer = buffer
            console.log(`Got image: ${buffer.length} bytes on attempt ${i + 1}`)
            break
          }
        }
      }
    } catch {
      // retry
    }
    
    await new Promise(resolve => setTimeout(resolve, 3000))
  }

  if (!imageBuffer && bestBuffer) {
    imageBuffer = bestBuffer
  }

  if (!imageBuffer) {
    throw new Error('Failed to generate image')
  }

  const enhanced = await enhanceImage(imageBuffer, style)
  const base64 = enhanced.toString('base64')
  return `data:image/jpeg;base64,${base64}`
}

async function enhanceImage(buffer: Buffer, style: string): Promise<Buffer> {
  let pipeline = sharp(buffer).resize(1280, 720, { fit: 'cover', position: 'attention' })

  switch (style) {
    case 'bold':
      pipeline = pipeline
        .modulate({ brightness: 1.05, saturation: 1.3 })
        .sharpen(1.5, 1, 2)
        .normalize()
      break
    case 'minimal':
      pipeline = pipeline
        .modulate({ brightness: 1.03, saturation: 0.85 })
        .sharpen(0.8)
      break
    case 'gaming':
      pipeline = pipeline
        .modulate({ brightness: 1.08, saturation: 1.5 })
        .gamma(1.15)
        .sharpen(1.8)
      break
    case 'vlog':
      pipeline = pipeline
        .modulate({ brightness: 1.06, saturation: 1.15, hue: 5 })
        .sharpen(0.9)
      break
    case 'tech':
      pipeline = pipeline
        .modulate({ brightness: 1.0, saturation: 1.1 })
        .sharpen(2.0)
        .normalize()
      break
    case 'educational':
      pipeline = pipeline
        .modulate({ brightness: 1.1, saturation: 1.2 })
        .sharpen(1.2)
        .normalize()
      break
    default:
      pipeline = pipeline.sharpen(1.0)
  }

  return pipeline.jpeg({ quality: 95, mozjpeg: true }).toBuffer()
}

export function getStyles() {
  return [
    { id: 'bold', name: 'Bold & Vibrant', desc: 'Culori intense, dramatic', emoji: '🔥' },
    { id: 'minimal', name: 'Clean & Minimal', desc: 'Modern, elegant', emoji: '✨' },
    { id: 'gaming', name: 'Gaming Epic', desc: 'Neon, acțiune', emoji: '🎮' },
    { id: 'vlog', name: 'Lifestyle Vlog', desc: 'Cald, natural', emoji: '🌞' },
    { id: 'tech', name: 'Tech Review', desc: 'Futurist, sleek', emoji: '💻' },
    { id: 'educational', name: 'Educational', desc: 'Clar, profesionist', emoji: '📚' },
  ]
}
