export default function ProductGrid({children, title}) {
  return (
    <div>
      <div className="mx-auto max-w-2xl py-6 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 bg-white py-4">{title}</h2>
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 bg-white">
			{children}
        </div>
      </div>
    </div>
  )
}
