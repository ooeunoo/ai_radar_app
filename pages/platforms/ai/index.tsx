import { IconLoader, IconSearch, Input } from '@supabase/ui'
import { error } from 'console'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import Layout from '~/components/Layout'
import PlatformTileGrid from '~/components/PlatformTileGrid'
import SectionContainer from '~/components/SectionContainer'
import supabase from '~/lib/supabase'
import { Platform } from '~/types/platforms'

export async function getStaticProps() {
  const { data: platforms, error } = await supabase
    .from<Platform>('platforms')
    .select('*')
    .eq('approved', true)
    .order('category')
    .order('title')
  if (error) console.log(platforms, error)

  return {
    props: {
      platforms: platforms ?? [],
    },
    revalidate: 18000,
  }
}

interface Props {
  platforms: Platform[]
}

function IntegrationPlatformsPage(props: Props) {
  const { platforms: initialPlatforms } = props
  const [platforms, setPlatforms] = useState(initialPlatforms)

  const allCategories = Array.from(
    new Set(initialPlatforms.map((p) => p.category))
  )

  const PlatformsByCategory: { [category: string]: Platform[] } = {}
  platforms.forEach(
    (p) =>
      (PlatformsByCategory[p.category] = [
        ...(PlatformsByCategory[p.category] ?? []),
        p,
      ])
  )
  const router = useRouter()

  const meta_title = 'Find your favorite AI tools'
  const meta_description = ``

  const [search, setSearch] = useState('')
  const [debouncedSearchTerm] = useDebounce(search, 300)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const searchPlatforms = async () => {
      setIsSearching(true)

      let query = supabase
        .from<Platform>('platforms')
        .select('*')
        .eq('approved', true)
        .order('category')
        .order('title')

      if (search.trim()) {
        query = query
          // @ts-ignore
          .textSearch('tsv', `${search.trim()}`, {
            type: 'websearch',
            config: 'english',
          })
      }

      const { data: platforms } = await query

      return platforms
    }

    if (search.trim() === '') {
      setIsSearching(false)
      setPlatforms(initialPlatforms)
      return
    }

    searchPlatforms().then((platforms) => {
      if (platforms) {
        setPlatforms(platforms)
      }

      setIsSearching(false)
    })
  }, [debouncedSearchTerm, router])

  return (
    <>
      <Head>
        <title>{meta_title} | Supabase Platform Gallery Example</title>
        <meta name="description" content={meta_description}></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <SectionContainer className="space-y-16">
          <div>
            <h1 className="h1">{meta_title}</h1>
            <h2 className="text-xl text-scale-900">{meta_description}</h2>
          </div>
          {/* Title */}
          <div className="grid space-y-12 md:gap-8 lg:grid-cols-12 lg:gap-16 lg:space-y-0 xl:gap-16">
            <div className="lg:col-span-4 xl:col-span-3">
              {/* Horizontal link menu */}
              <div className="space-y-6">
                {/* Search Bar */}

                <Input
                  size="small"
                  icon={<IconSearch />}
                  placeholder="Search..."
                  type="text"
                  // className="md:w-1/2"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  actions={
                    isSearching && (
                      <span className="mr-1 animate-spin text-white">
                        <IconLoader />
                      </span>
                    )
                  }
                />
                <div className="hidden lg:block">
                  <div className="mb-2 text-sm text-scale-900">Categories</div>
                  <div className="space-y-1">
                    {allCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() =>
                          router.push(`#${category.toLowerCase()}`)
                        }
                        className="block text-base text-scale-1100"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-8 xl:col-span-9">
              {/* Platform Tiles */}
              <div className="grid space-y-10">
                {platforms.length ? (
                  <PlatformTileGrid PlatformsByCategory={PlatformsByCategory} />
                ) : (
                  <h2 className="h2">No Platforms Found</h2>
                )}
              </div>
            </div>
          </div>
          {/* Become a platform form */}
        </SectionContainer>
      </Layout>
    </>
  )
}

export default IntegrationPlatformsPage
