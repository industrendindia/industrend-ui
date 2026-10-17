export type PrasadProduct = {
  id: string
  code: string
  name: string
  category: string
  price: number
  mrp: number
  rating: number
  reviews: number
  stock: number
  image: string
  material: string
  size: string
  dispatch: string
  description: string
  customisable: boolean
}

const details = [
  ['Vishnu Radiance Wall Shrine', 'Idols', 14999, '24 × 12 in (indicative standard size)', 'Painted devotional shrine sculpture with ornamental detailing and a warm illuminated presentation. Confirm material, dimensions, finish and availability with the artisan.'],
  ['Maratha Fort Defence Relief Mural', 'Relief Murals', 24999, '36 × 24 in (indicative standard size)', 'Large historic relief artwork showing warriors scaling a fortress wall, with detailed rocky textures and period-inspired dress.'],
  ['Contemporary Selfie Figure Sculpture', 'Portrait Sculptures', 49999, '5 ft high (indicative standard size)', 'A distinctive modern-life sculpture suitable for themed interiors, exhibits or customised figure commissions.'],
  ['Vitthal Temple Standing Idol', 'Idols', 16999, '24 in high (indicative standard size)', 'Devotional standing figure combining dark stone-look skin tones with bright festive paintwork and traditional jewellery.'],
  ['Divine Family Heritage Relief Sculpture', 'Relief Murals', 30000, '4 × 2.5 ft', 'A traditional sculpted relief panel with a seated divine family composition and surrounding figures within a textured architectural frame.'],
  ['Reclining Buddha 3D Serenity Sculpture', 'Decorative Sculptures', 25000, '2.5 ft long', 'A peaceful reclining Buddha sculpture with a gentle expression, detailed curls and flowing sculptural form.'],
  ['Heritage Royal Portrait Bust Sculpture', 'Portrait Sculptures', 35000, '3 ft high', 'A heritage-inspired royal portrait bust featuring an ornate crown, layered ornaments and carefully sculpted facial features.'],
  ['Sant Dnyaneshwar Maharaj Devotional Mural', 'Devotional Art', 30000, '3 × 3 ft', 'A framed three-dimensional devotional artwork inspired by Sant Dnyaneshwar Maharaj with rich architectural detailing.'],
  ['Goddess Mahalakshmi-Inspired Relief Mural', 'Relief Murals', 30000, '3.5 × 2 ft', 'An intricate temple-style relief showing a richly ornamented divine figure beneath an elaborately carved shrine canopy.'],
  ['Elder Memorial Portrait Bust', 'Portrait Sculptures', 22999, '20 in high (indicative standard size)', 'A thoughtful commemorative sculpture concept for personalised family, institutional or heritage portraits.'],
  ['Little Scholar Life Sculpture', 'Decorative Sculptures', 40000, '3 ft high', 'A lifelike sculpture of a young girl writing on a traditional slate, celebrating learning, childhood and creativity.'],
  ['Sahyadri Warriors Grand Relief', 'Relief Murals', 39999, '48 × 30 in (indicative standard size)', 'A statement historical wall mural inspired by courage, teamwork and the forts of the Sahyadri region.'],
  ['Lord Vitthal Temple Sculpture with Ornate Halo', 'Idols', 40000, '3 × 2 ft', 'A vibrant three-dimensional Lord Vitthal sculpture inspired by Pandharpur devotional traditions.'],
  ['Personalised Portrait Bust Sculpture', 'Portrait Sculptures', 35000, '2 ft high', 'A meaningful three-dimensional portrait designed to capture a person’s expression, personality and distinctive features.'],
  ['Blue Bloom Decorative Wall Panel', 'Wall Art', 15999, '36 × 18 in (indicative standard size)', 'A contemporary botanical statement panel mixing sculpted flowers, repeating squares and flowing patterns.'],
  ['Peace Dove Wall Decor Collection', 'Wall Art', 4499, 'Set of 6, each 8–12 in', 'A serene three-dimensional dove-inspired wall décor arrangement suited to homes, offices and welcoming spaces.'],
  ['Vishnu Lotus Guardian Idol', 'Idols', 20999, '30 in high (indicative standard size)', 'A temple-inspired painted idol with graceful hand gestures and richly finished ceremonial ornamentation.'],
  ['Maharaj Royal Throne Heritage Mural', 'Relief Murals', 40000, '3.5 × 4.5 ft', 'A grand historical wall mural featuring a regal Maharaj seated on an intricately decorated throne.'],
  ['Lord Dhanvantari 3D Lotus Sculpture', 'Idols', 50000, '4 ft high', 'A colourful four-armed devotional sculpture inspired by Lord Dhanvantari with ceremonial garments and lotus pedestal.'],
  ['Traditional Indian Om Decorative Wall Mural', 'Wall Art', 40000, '5 × 4 ft', 'An expressive Indian wall mural combining the sacred Om symbol with flowing figures, floral motifs and earthy colours.'],
  ['Chhatrapati Shivaji Maharaj Fort Heritage Mural', 'Relief Murals', 60000, '6 × 4 ft', 'A dramatic heritage mural depicting Chhatrapati Shivaji Maharaj against a fort and mountain backdrop.'],
] as const

export const prasadProducts: PrasadProduct[] = details.map(([name, category, price, size, description], index) => ({
  id: `prasad-${String(index + 1).padStart(2, '0')}`,
  code: `P${String(index + 7).padStart(6, '0')}`,
  name,
  category,
  price,
  mrp: price,
  rating: 4.8,
  reviews: 0,
  stock: 8,
  image: `/prasad-product-${String(index + 1).padStart(2, '0')}.webp`,
  material: index < 4 || [9, 11, 14, 15, 16].includes(index) ? 'Material and finish confirmed before dispatch' : 'Artwork and finish as photographed — material confirmed by artisan',
  size,
  dispatch: 'Seller to confirm before dispatch',
  description,
  customisable: true,
}))

