import Image from 'next/image'
import { Platform } from '../types/platforms'

export default function PlatformTileGrid({
  PlatformsByCategory,
  hideCategories = false,
}: {
  PlatformsByCategory: { [category: string]: Platform[] }
  hideCategories?: boolean
}) {
  return (
    <>
      {Object.keys(PlatformsByCategory).map((category) => (
        <div key={category} id={category.toLowerCase()} className="space-y-8">
          {!hideCategories && <h2 className="h2">{category}</h2>}
          <div className="grid  grid-cols-1 gap-5 lg:max-w-none lg:grid-cols-2 xl:grid-cols-3">
            {PlatformsByCategory[category].map((p) => (
              <a
                key={p.slug}
                href={p.website}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group flex
                  h-full w-full
                  flex-col rounded border bg-scale-100 px-6 py-6 shadow transition-all 
                  hover:bg-scale-200 hover:shadow-lg 
                  dark:bg-scale-300 
                  hover:dark:bg-scale-400
                "
              >
                <div className="flex w-full space-x-6">
                  <div className="h-10 w-10 scale-100 transition-all group-hover:scale-110">
                    <Image
                      layout="fixed"
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full bg-gray-300"
                      src={p.logo}
                      alt={p.title}
                    />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl text-scale-1100 transition-colors group-hover:text-scale-1200">
                      {p.title}
                    </h3>
                    <p className="text-sm text-scale-900">{p.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
