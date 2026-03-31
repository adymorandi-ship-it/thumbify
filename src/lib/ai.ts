import sharp from 'sharp'

const styleConfigs: Record<string, {
  mainPrompt: string
  negativePrompt: string
  model: string
  enhance: string
}> = {
  bold: {
    mainPrompt: 'professional youtube thumbnail photo, {subject}, bold vibrant saturated colors, dramatic cinematic studio lighting, high contrast, 8k ultra detailed, centered composition, shallow depth of field, magazine cover quality',
    negativePrompt: 'cartoon, anime, illustration, painting, blurry, low quality, text, watermark, logo',
    model: 'flux-realism',
    enhance: 'vibrant'
  },
  minimal: {
    mainPrompt: 'clean minimal modern youtube thumbnail photo, {subject}, soft diffused natural lighting, elegant premium feel, pastel tones, balanced composition, negative space, sophisticated editorial style, 8k',
    negativePrompt: 'cartoon, anime, illustration, cluttered, busy, messy, dark, text, watermark',
    model: 'flux-realism',
    enhance: 'minimal'
  },
  gaming: {
    mainPrompt: 'epic gaming youtube thumbnail, {subject}, neon glow effects, electric blue purple red colors, cyberpunk aesthetic, intense action, dynamic low angle, motion blur, particle effects, dramatic shadows, 8k',
    negativePrompt: 'realistic photo, boring, plain, text, watermark, blurry',
    model: 'flux-3d',
    enhance: 'gaming'
  },
  vlog: {
    mainPrompt: 'lifestyle vlog youtube thumbnail photo, {subject}, warm golden hour lighting, natural colors, authentic candid feel, personal inviting, beautiful bokeh background, warm tones, relatable, 8k',
    negativePrompt: 'cartoon, anime, artificial, cold, dark, text, watermark, corporate, staged',
    model: 'flux-realism',
    enhance: 'warm'
  },
  tech: {
    mainPrompt: 'tech review youtube thumbnail photo, {subject}, futuristic sleek design, product showcase, clean bright studio lighting, premium gadgets, sharp details, metallic surfaces, reflections, tech aesthetic, 8k',
    negativePrompt: 'cartoon, anime, outdated, messy, blurry, text, watermark, vintage',
    model: 'flux-realism',
    enhance: 'tech'
  },
  educational: {
    mainPrompt: 'educational youtube thumbnail photo, {subject}, clear informative design, bright eye-catching saturated colors, attention grabbing, professional trustworthy, organized, 8k detailed',
    negativePrompt: 'cartoon, anime, confusing, dark, blurry, text, watermark, chaotic',
    model: 'flux-realism',
    enhance: 'bright'
  }
}

export async function generateThumbnail(prompt: string, style: string): Promise<string> {
  const config = styleConfigs[style] || styleConfigs.bold
  
  // Insert user prompt into template
  const fullPrompt = config.mainPrompt.replace('{subject}', prompt)
  
  // Generate unique seed
  const seed = Math.floor(Math.random() * 1000000)
  
  // Build URL with all parameters
  const params = new URLSearchParams({
    width: '1280',
    height: '720',
    nologo: 'true',
    seed: seed.toString(),
    model: config.model,
    negative_prompt: config.negativePrompt,
  })
  
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?${params.toString()}`

  console.log(`Generating with model: ${config.model}`)
  console.log(`Prompt: ${fullPrompt}`)

  // Fetch image with retries
  const maxRetries = 20
  let imageBuffer: Buffer | null = null

  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(url + '&t=' + Date.now(), {
        signal: AbortSignal.timeout(30000),
        headers: {
          'User-Agent': 'Thumbify/1.0',
        }
      })
      
      if (res.ok) {
        const contentType = res.headers.get('content-type') || ''
        if (contentType.includes('image')) {
          const arrayBuffer = await res.arrayBuffer()
          imageBuffer = Buffer.from(arrayBuffer)
          console.log(`Image generated on attempt ${i + 1}, size: ${imageBuffer.length} bytes`)
          break
        }
      }
      
      // Check for error response
      if (res.status >= 400) {
        console.log(`Attempt ${i + 1}: Status ${res.status}`)
      }
    } catch (e: any) {
      console.log(`Attempt ${i + 1}: ${e.message}`)
    }
    
    // Wait before retry (increasing delay)
    await new Promise(resolve => setTimeout(resolve, 2000 + (i * 500)))
  }

  if (!imageBuffer) {
    throw new Error('Failed to generate image after all retries')
  }

  // Enhance image with Sharp based on style
  const enhanced = await enhanceImage(imageBuffer, config.enhance)
  
  // Convert to base64
  const base64 = enhanced.toString('base64')
  return `data:image/jpeg;base64,${base64}`
}

async function enhanceImage(buffer: Buffer, mode: string): Promise<Buffer> {
  let pipeline = sharp(buffer)
    .resize(1280, 720, { fit: 'cover', position: 'centre' })

  switch (mode) {
    case 'vibrant':
      pipeline = pipeline
        .modulate({ brightness: 1.08, saturation: 1.35 })
        .sharpen({ sigma: 1.2 })
        .normalize()
      break
    case 'minimal':
      pipeline = pipeline
        .modulate({ brightness: 1.05, saturation: 0.85 })
        .sharpen({ sigma: 0.8 })
      break
    case 'gaming':
      pipeline = pipeline
        .modulate({ brightness: 1.05, saturation: 1.5 })
        .sharpen({ sigma: 1.5 })
        .gamma(1.15)
      break
    case 'warm':
      pipeline = pipeline
        .modulate({ brightness: 1.08, saturation: 1.2, hue: 8 })
        .sharpen({ sigma: 0.9 })
      break
    case 'tech':
      pipeline = pipeline
        .modulate({ brightness: 1.0, saturation: 1.1 })
        .sharpen({ sigma: 1.8 })
        .normalize()
      break
    case 'bright':
      pipeline = pipeline
        .modulate({ brightness: 1.15, saturation: 1.25 })
        .sharpen({ sigma: 1.0 })
        .normalize()
      break
  }

  return pipeline.jpeg({ quality: 92 }).toBuffer()
}

export function getStyles() {
  return [
    { id: 'bold', name: 'Bold & Vibrant', description: 'Culori intense, dramatic', emoji: '🔥' },
    { id: 'minimal', name: 'Clean & Minimal', description: 'Modern, elegant, simplu', emoji: '✨' },
    { id: 'gaming', name: 'Gaming Epic', description: 'Neon, acțiune, cyberpunk', emoji: '🎮' },
    { id: 'vlog', name: 'Lifestyle Vlog', description: 'Cald, prietenos, natural', emoji: '🌞' },
    { id: 'tech', name: 'Tech Review', description: 'Futurist, sleek, gadgeturi', emoji: '💻' },
    { id: 'educational', name: 'Educational', description: 'Clar, informativ, profesionist', emoji: '📚' },
  ]
}
