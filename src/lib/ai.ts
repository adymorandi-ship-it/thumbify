import sharp from 'sharp'

const styleModifiers: Record<string, string> = {
  bold: 'Shot with Canon EOS R5, 85mm lens, f/1.4, dramatic studio lighting, high contrast, vibrant saturated colors, professional photography',
  minimal: 'Shot with Sony A7IV, 50mm lens, f/2.8, soft natural light, clean composition, minimal background, elegant muted tones, editorial photography',
  gaming: 'Digital art, neon cyberpunk style, electric blue and purple glow, RGB lighting, dynamic action pose, particle effects, dramatic shadows, concept art quality',
  vlog: 'Shot with Fujifilm X-T5, 35mm lens, f/1.8, warm golden hour sunlight, natural candid feel, bokeh background, lifestyle photography',
  tech: 'Shot with Sony A7RV, 90mm macro lens, f/2.8, clean studio lighting, product photography style, sharp details, reflective surfaces, premium feel',
  educational: 'Shot with Canon EOS R6, 24-70mm lens, f/4, bright even lighting, clear subject, professional corporate photography, trustworthy feel',
}

export async function generateThumbnail(prompt: string, style: string): Promise<string> {
  const modifier = styleModifiers[style] || styleModifiers.bold
  
  // Better prompt structure: scene description + details + technical specs
  const fullPrompt = `Ultra realistic photograph. Scene: ${prompt}. Details: high detail face, realistic skin texture, visible pores, sharp focus on subject, detailed background elements. ${modifier}, 8k uhd quality, DSLR photo`
  
  const seed = Math.floor(Math.random() * 1000000)
  
  const params = new URLSearchParams({
    width: '1280',
    height: '720',
    nologo: 'true',
    seed: seed.toString(),
    model: 'flux-realism',
  })
  
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?${params.toString()}`

  console.log(`Generating with style: ${style}`)

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
          
          // Keep the largest (most detailed) image
          if (buffer.length > bestSize) {
            bestSize = buffer.length
            bestBuffer = buffer
          }
          
          // If we get a good sized image, use it
          if (buffer.length > 50000) {
            imageBuffer = buffer
            console.log(`Got detailed image: ${buffer.length} bytes on attempt ${i + 1}`)
            break
          }
        }
      }
    } catch {
      // retry
    }
    
    await new Promise(resolve => setTimeout(resolve, 3000))
  }

  // Use best buffer if we didn't get a "good" one
  if (!imageBuffer && bestBuffer) {
    imageBuffer = bestBuffer
    console.log(`Using best available: ${bestBuffer.length} bytes`)
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
        .sharpen({ sigma: 0.8 })
      break
    case 'gaming':
      pipeline = pipeline
        .modulate({ brightness: 1.08, saturation: 1.5 })
        .gamma(1.15)
        .sharpen({ sigma: 1.8 })
      break
    case 'vlog':
      pipeline = pipeline
        .modulate({ brightness: 1.06, saturation: 1.15, hue: 5 })
        .sharpen({ sigma: 0.9 })
      break
    case 'tech':
      pipeline = pipeline
        .modulate({ brightness: 1.0, saturation: 1.1 })
        .sharpen({ sigma: 2.0 })
        .normalize()
      break
    case 'educational':
      pipeline = pipeline
        .modulate({ brightness: 1.1, saturation: 1.2 })
        .sharpen({ sigma: 1.2 })
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
