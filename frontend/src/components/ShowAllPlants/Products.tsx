import ProductPlant from "../Product/ProductPlant";

export default function Products({ products }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4 auto-rows-max gap-16">
      {products.map((product: any) => (
        <ProductPlant key={product._id} product={product} />
      ))}
    </div>
  );
}
