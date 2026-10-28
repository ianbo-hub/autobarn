import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { sanityFetch } from '@/lib/sanity/client'
import { postListQuery } from '@/lib/sanity/queries'
import { BlogCardSkeleton } from '@/components/ui/Skeleton'
import { NoBlogState } from '@/components/ui/EmptyState'
import { formatDate } from '@/lib/utils'
import type { BlogPost } from '@/types'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Car buying guides, maintenance tips, detailing advice and industry news from the AutoBarn team.',
}

async function BlogGrid() {
  let posts: BlogPost[] = []
  try {
    posts = await sanityFetch<BlogPost[]>({ query: postListQuery, tags: ['posts'] })
  } catch {
    // no posts yet
  }

  if (posts.length === 0) return <NoBlogState />

  // noUncheckedIndexedAccess: destructured items from an array are typed as T | undefined.
  // We've confirmed posts is non-empty above, so the assertion is safe.
  const [featured, ...rest] = posts as [BlogPost, ...BlogPost[]]

  return (
    <div>
      {/* Featured post */}
      <Link href={`/blog/${featured.slug}`} className="group block mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 border border-rule hover:border-ink transition-colors">
          <div className="relative aspect-video lg:aspect-auto min-h-[300px] bg-grey-100 overflow-hidden">
            {featured.coverImage ? (
              <Image
                src={featured.coverImage.url}
                alt={featured.coverImage.alt ?? featured.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl text-grey-400">📰</div>
            )}
          </div>
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="flex gap-3 mb-4">
              <span className="badge badge-red">Featured</span>
              {featured.category && <span className="badge badge-cream">{featured.category}</span>}
            </div>
            <h2 className="mb-4">{featured.title}</h2>
            <p className="text-grey-600 line-clamp-3 mb-6">{featured.excerpt}</p>
            <div className="flex items-center justify-between">
              <p className="mono-label text-grey-400">{formatDate(featured.publishedAt)}</p>
              <span className="mono-label text-red group-hover:underline">Read more →</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Grid of remaining posts */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map(post => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="group border border-rule hover:border-ink transition-colors flex flex-col"
            >
              <div className="relative aspect-video bg-grey-100 overflow-hidden">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage.url}
                    alt={post.coverImage.alt ?? post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-grey-400">📰</div>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                {post.category && (
                  <span className="badge badge-cream w-fit mb-3">{post.category}</span>
                )}
                <h3 className="font-display text-xl font-bold uppercase leading-tight mb-2 text-ink">{post.title}</h3>
                <p className="text-sm text-grey-600 line-clamp-2 flex-1">{post.excerpt}</p>
                <p className="mono-label text-grey-400 mt-4">{formatDate(post.publishedAt)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function BlogPage() {
  return (
    <>
      <section className="bg-ink text-cream section page-wrap">
        <p className="eyebrow text-grey-600">Editorial</p>
        <h1 className="text-cream">The AutoBarn Journal</h1>
        <p className="text-grey-400 mt-6 max-w-lg">
          Buying guides, detailing tips, industry news and stories from the Kenyan automotive world.
        </p>
      </section>

      <section className="section page-wrap">
        <Suspense fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)}
          </div>
        }>
          <BlogGrid />
        </Suspense>
      </section>
    </>
  )
}
