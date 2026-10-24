export type AnitaProduct = {
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

const entries: Array<[string, string, string, number, string]> = [
  ['anita-purple-flower-keychain', 'Lavender Flower & Pearl Keychain', 'Keychains', 50, 'A pretty lavender flower keychain accented with a pearl-look centre and matching bead loop. A lightweight decorative accessory for keys, handbags and gifting.'],
  ['anita-purple-gold-diya', 'Purple & Gold Floral Tealight Holder', 'Tealight Holders', 150, 'A decorative flower-shaped tealight holder with layered translucent purple petals, gold-tone edging and a pearl-look bead border. A lovely table accent for festive settings.'],
  ['anita-pink-flower-hanging', 'Pink Floral Hanging Decoration', 'Door Hangings', 180, 'A cheerful hanging decoration featuring bright-pink and light-pink handcrafted flower forms, green accents and pearl-look beads. Ideal for festive doorways and decorative corners.'],
  ['anita-yellow-shubh-labh', 'Yellow Floral Shubh Labh Hanging Pair', 'Shubh Labh Décor', 200, 'A sunny yellow flower-inspired Shubh Labh hanging pair with decorative pearl-look borders and floral tassels. Designed for welcoming entrance décor during celebrations.'],
  ['anita-pink-floral-table', 'Pink Flower Table Décor Pair', 'Floral Décor', 200, 'A pair of handmade pink floral arrangements with layered petals, pearl-look details and decorative bases. Suitable for centre tables, gifting and celebration décor.'],
  ['anita-pink-diya-pair', 'Pink Floral Tealight Holder Pair', 'Tealight Holders', 250, 'Two pink floral tealight holders with layered petal styling, green leaf-like accents and a warm festive presentation. Attractive for pooja and occasion décor.'],
  ['anita-purple-diya-pair', 'Royal Purple Floral Tealight Holder Pair', 'Tealight Holders', 280, 'A rich violet floral tealight-holder pair with layered petal detailing and pearl-look accents, adding a bold decorative touch to festive tables.'],
  ['anita-lotus-diya-pair', 'Pink Lotus-Inspired Decorative Holder Pair', 'Tealight Holders', 280, 'Two vibrant pink lotus-inspired decorative holders with yellow centres and green leaves. A colourful arrangement suited to festive or pooja-table styling.'],
  ['anita-pink-pearl-toran', 'Pink Floral & Pearl Door Toran', 'Door Torans', 450, 'An elegant hanging toran with alternating pink floral motifs, bead-like pearl swags and hanging tassels. A statement doorway decoration for welcoming guests.'],
  ['anita-multicolour-flower-toran', 'Multicolour Floral Pearl Wall Toran', 'Door Torans', 800, 'A handcrafted floral toran with yellow and fuchsia blossoms, green leaf detailing and pearl-look hanging chains. A bright accent for walls, doorways and festive occasions.'],
  ['anita-shubh-labh-red-gold', 'Red & Gold Shubh Labh Bell Hanging Pair', 'Shubh Labh Décor', 180, 'A traditional Shubh Labh hanging pair with red-and-gold woven styling, white pearl-look trim, bead tassels and bell accents. Designed for festive entrance decoration.'],
]

export const anitaProducts: AnitaProduct[] = entries.map(([id, name, category, price, description], index) => ({
  id, code: `P${String(index + 1).padStart(6, '0')}`, name, category, price, mrp: price,
  rating: 4.8, reviews: 0, stock: 99, image: '/anita-hero-2.jpeg',
  material: 'Handcrafted decorative material', size: 'Dimensions to be confirmed with seller',
  dispatch: 'Seller to confirm before dispatch', description, customisable: true,
}))
