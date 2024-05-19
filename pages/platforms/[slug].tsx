import { IconChevronLeft, IconExternalLink } from '@supabase/ui'
import { marked } from 'marked'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import Layout from '~/components/Layout'
import SectionContainer from '~/components/SectionContainer'
import supabase from '~/lib/supabase'
import { Platform } from '../../types/platforms'
import Error404 from '../404'

function PlatformPage({ platform }: { platform: Platform }) {
  if (!platform) return <Error404 />

  return (
    <>
      <Head>
        <title>{platform.title} | Supabase Platform Gallery Example</title>
        <meta name="description" content={platform.description}></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <SectionContainer>
          <div className="col-span-12 mx-auto mb-2 max-w-5xl space-y-12 lg:col-span-2">
            {/* Back button */}
            <Link href={`/platforms/ai`}>
              <a className="flex cursor-pointer items-center text-scale-1200 transition-colors hover:text-scale-1000">
                <IconChevronLeft style={{ padding: 0 }} />
                Back
              </a>
            </Link>

            <div className="flex items-center space-x-4">
              <Image
                layout="fixed"
                width={56}
                height={56}
                className="flex-shrink-f0 h-14 w-14 rounded-full bg-scale-400"
                src={platform.logo}
                alt={platform.title}
              />
              <h1 className="h1" style={{ marginBottom: 0 }}>
                {platform.title}
              </h1>
            </div>
            {/* //webview */}

            <div
              className="bg-scale-300 py-6"
              style={{
                marginLeft: 'calc(50% - 50vw)',
                marginRight: 'calc(50% - 50vw)',
              }}
            >
              <Swiper
                initialSlide={0}
                spaceBetween={0}
                slidesPerView={4}
                speed={300}
                // slidesOffsetBefore={300}
                centerInsufficientSlides={true}
                breakpoints={{
                  320: {
                    slidesPerView: 1,
                  },
                  720: {
                    slidesPerView: 2,
                  },
                  920: {
                    slidesPerView: 3,
                  },
                  1024: {
                    slidesPerView: 4,
                  },
                  1208: {
                    slidesPerView: 5,
                  },
                }}
              >
                {platform.images.map((image: any, i: number) => {
                  return (
                    <SwiperSlide key={i}>
                      <div className="relative ml-3 mr-3 block cursor-move overflow-hidden rounded-md">
                        <Image
                          layout="responsive"
                          objectFit="contain"
                          width={1460}
                          height={960}
                          src={image}
                          alt={platform.title}
                        />
                      </div>
                    </SwiperSlide>
                  )
                })}
              </Swiper>
            </div>
          </div>
        </SectionContainer>
      </Layout>
    </>
  )
}

// This function gets called at build time
export const getStaticPaths: GetStaticPaths = async () => {
  const { data: slugs } = await supabase
    .from<Platform>('platforms')
    .select('slug')

  const paths: {
    params: { slug: string }
    locale?: string | undefined
  }[] =
    slugs?.map(({ slug }) => ({
      params: {
        slug,
      },
    })) ?? []

  return {
    paths,
    fallback: 'blocking',
  }
}

// This also gets called at build time
export const getStaticProps: GetStaticProps = async ({ params }) => {
  let { data: platform } = await supabase
    .from<Platform>('platforms')
    .select('*')
    .eq('slug', params!.slug as string)
    .single()

  if (!platform) {
    return {
      notFound: true,
    }
  }

  // Parse markdown
  platform.overview = marked.parse(platform.overview)

  return {
    props: { platform },
    revalidate: 18000, // In seconds - refresh every 5 hours
  }
}

export default PlatformPage
