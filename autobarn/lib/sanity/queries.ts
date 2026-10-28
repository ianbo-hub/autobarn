// groq is just a tagged template literal for syntax highlighting — no runtime dependency needed
const groq = (strings: TemplateStringsArray, ...values: unknown[]) =>
  strings.reduce((acc, str, i) => acc + str + (values[i] ?? ''), '')

// ─── IMAGE FRAGMENT ───────────────────────────────────────────
const imageFields = groq`
  asset { _ref },
  "url": asset->url,
  alt,
  caption
`

// ─── VEHICLES ─────────────────────────────────────────────────

export const vehicleListQuery = groq`
  *[_type == "vehicle" && status != "sold"] | order(_createdAt desc) {
    _id,
    "slug": slug.current,
    make,
    model,
    year,
    price,
    mileage,
    "fuelType": fuel,
    transmission,
    colour,
    colourHex,
    status,
    badge,
    "displayName": make + " " + model + " " + string(year),
    "images": images[0..0] { ${imageFields} }
  }
`

export const vehicleBySlugQuery = groq`
  *[_type == "vehicle" && slug.current == $slug][0] {
    _id,
    "slug": slug.current,
    make,
    model,
    year,
    price,
    mileage,
    "fuelType": fuel,
    transmission,
    colour,
    colourHex,
    status,
    badge,
    description,
    features,
    "displayName": make + " " + model + " " + string(year),
    images[] { ${imageFields} }
  }
`

// Get all unique colours for filter swatches
export const vehicleColoursQuery = groq`
  array::unique(*[_type == "vehicle"].colour)
`

// ─── PRODUCTS ─────────────────────────────────────────────────

export const productListQuery = groq`
  *[_type == "product" && inStock == true] | order(isSpecial desc, name asc) {
    _id,
    "slug": slug.current,
    name,
    category,
    price,
    comparePrice,
    isSpecial,
    colour,
    colourHex,
    inStock,
    "image": image { ${imageFields} }
  }
`

// ─── BLOG ─────────────────────────────────────────────────────

export const postListQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    "slug": slug.current,
    title,
    excerpt,
    category,
    publishedAt,
    readTime,
    "coverImage": coverImage { ${imageFields} },
    "author": author->{ name, "image": image { ${imageFields} } }
  }
`

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    "slug": slug.current,
    title,
    excerpt,
    category,
    publishedAt,
    readTime,
    body,
    "coverImage": coverImage { ${imageFields} },
    "author": author->{ name, "image": image { ${imageFields} } }
  }
`

export const featuredPostQuery = groq`
  *[_type == "post"] | order(publishedAt desc)[0] {
    _id,
    "slug": slug.current,
    title,
    excerpt,
    category,
    publishedAt,
    readTime,
    "coverImage": coverImage { ${imageFields} },
    "author": author->{ name }
  }
`

// ─── WASH SERVICES ────────────────────────────────────────────

export const washServicesQuery = groq`
  *[_type == "washService"] | order(tier asc, price asc) {
    _id,
    name,
    tier,
    price,
    duration,
    description,
    "includes": inclusions,
    badge
  }
`
