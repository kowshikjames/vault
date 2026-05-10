import ProductCard from './ProductCard'
import type { Product } from '@/lib/api'

interface Props {
  products: Product[]
  columns?: 2 | 3 | 4
}

export default function ProductGrid({ products, columns = 4 }: Props) {
  if (!products || products.length === 0) {
    return (
      <div style={{ padding: '5rem 2rem', textAlign: 'center' }}>
        <p className="label-caps" style={{ color: 'var(--outline)' }}>No products found</p>
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '1.5px',
        borderTop: '1.5px solid var(--outline-variant)',
      }}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
