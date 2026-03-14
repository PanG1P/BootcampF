export default function ShopPage({
  params,
}: {
  params: { slug: string };
}) {
  return <div>Shop Page: {params.slug}</div>;
}