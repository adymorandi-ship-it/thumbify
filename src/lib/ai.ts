import sharp from 'sharp'

const styleConfigs: Record<string, {
  prefix: string
  suffix: string
  negative: string
  enhance: string
}> = {
  bold: {
    prefix: 'epic youtube thumbnail, bold vibrant colors, dramatic cinematic lighting, high contrast, professional photography, 8k ultra detailed',
    suffix: 'centered composition, shallow depth of field, studio quality, magazine cover quality',
    negative: 'blurry, low quality, text, watermark, logo, distorted, ugly, deformed',
    enhance: 'vibrant'
  },
  minimal: {
    prefix: 'clean minimal youtube thumbnail, modern design, soft lighting, elegant, premium feel, white and pastel tones',
    suffix: 'balanced composition, negative space, sophisticated, editorial style',
    negative: 'cluttered, busy, messy, low quality, blurry, text, watermark',
    enhance: 'minimal'
  },
  gaming: {
    prefix: 'epic gaming youtube thumbnail, neon glow, electric blue and purple, cyberpunk vibes, intense action, HD gaming screenshot style',
    suffix: 'dynamic angle, motion blur, particle effects, dramatic shadows',
    negative: 'boring, plain, low energy, blurry, text, watermark',
    enhance: 'gaming'
  },
  vlog: {
    prefix: 'lifestyle vlog youtube thumbnail, warm golden hour lighting, natural colors, authentic feel, personal and inviting',
    suffix: 'bokeh background, warm tones, candid moment, relatable',
    negative: 'artificial, cold, dark, blurry, text, watermark, corporate',
    enhance: 'warm'
  },
  tech: {
    prefix: 'tech review youtube thumbnail, futuristic sleek design, product showcase, clean studio lighting, premium gadgets',
    suffix: 'sharp details, metallic surfaces, reflection, tech aesthetic',
    negative: 'outdated, messy, blurry, low quality, text, watermark',
    enhance: 'tech'
  },
  educational: {
    prefix: 'educational youtube thumbnail, clear and informative, bright colors, attention grabbing, knowledge sharing style',
    suffix: 'organized layout, clear focal point, professional, trustworthy',
    negative: 'confusing, dark, blurry, low quality, text, watermark',
    enhance: 'bright'
  }
}

export async function generateThumbnail(prompt: string, style: string): Promise<string> {
  const config = styleConfigs[style] || styleConfigs.bold
  
  const fullPrompt = `${config.prefix}, ${prompt}, ${config.suffix}`
  
  const encodedPrompt = encodeURIComponent(fullPrompt)
  const seed = Math.floor(Math.random() * 100000)
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=720&nologo=true&seed=${seed}&negative=${encodeURIComponent(config.negative)}`

  // Fetch image with retries
  const maxRetries = 15
  let imageBuffer: Buffer | null = null

  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(imageUrl + '&t=' + Date.now(), {
        signal: AbortSignal.timeout(25000),
      })
      
      if (res.ok) {
        const contentType = res.headers.get('content-type') || ''
        if (contentType.includes('image')) {
          const arrayBuffer = await res.arrayBuffer()
          imageBuffer = Buffer.from(arrayBuffer)
          break
        }
      }
    } catch {
      // not ready yet
    }
    
    await new Promise(resolve => setTimeout(resolve, 2500))
  }

  if (!imageBuffer) {
    throw new Error('Failed to generate image')
  }

  // Enhance image with Sharp
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
        .modulate({ brightness: 1.1, saturation: 1.4 })
        .sharpen({ sigma: 1.2 })
      break
    case 'minimal':
      pipeline = pipeline
        .modulate({ brightness: 1.05, saturation: 0.9 })
        .blur(0.3)
        .sharpen({ sigma: 0.8 })
      break
    case 'gaming':
      pipeline = pipeline
        .modulate({ brightness: 1.05, saturation: 1.5 })
        .sharpen({ sigma: 1.5 })
        .gamma(1.1)
      break
    case 'warm':
      pipeline = pipeline
        .modulate({ brightness: 1.08, saturation: 1.2, hue: 10 })
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
        .modulate({ brightness: 1.15, saturation: 1.3 })
        .sharpen({ sigma: 1.0 })
      break
  }

  return pipeline
    .jpeg({ quality: 95 })
    .toBuffer()
}

export function getStyles() {
  return [
    { id: 'bold', name: 'Bold & Vibrant', description: 'Eye-catching colors and dramatic lighting' },
    { id: 'minimal', name: 'Clean & Minimal', description: 'Modern and sleek professional look' },
    { id: 'gaming', name: 'Gaming Epic', description: 'Neon colors and action-packed style' },
    { id: 'vlog', name: 'Lifestyle Vlog', description: 'Warm and friendly personal style' },
    { id: 'tech', name: 'Tech Review', description: 'Futuristic and sleek tech style' },
    { id: 'educational', name: 'Educational', description: 'Clear and informative design' },
  ]
}
