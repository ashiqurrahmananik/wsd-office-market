import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Browse() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("listings")
    .select("id,title,price,category,mood,status,image_url,bid_enabled,starting_bid")
    .eq("status", "AVAILABLE")
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl font-black">Browse the office stash 🍱</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <input className="input" placeholder="Search food or items..." />
        <select className="input">
          <option>All categories</option>
          <option>Meal</option>
          <option>Food</option>
          <option>Cake</option>
          <option>Drink</option>
          <option>Snack</option>
          <option>Dessert</option>
          <option>Other</option>
        </select>
        <select className="input">
          <option>Newest</option>
          <option>Price low to high</option>
          <option>Price high to low</option>
          <option>Ending soon</option>
        </select>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {data?.map((l) => (
          <article className="card p-5" key={l.id}>
            <div className="flex h-32 items-center justify-center overflow-hidden rounded-2xl bg-orange-50 text-5xl">
              {l.image_url ? <img src={l.image_url} alt={l.title} className="h-full w-full object-cover" /> : "🍱"}
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-stone-500">
              {l.mood || l.category}
              {l.bid_enabled && <span className="rounded-full bg-orange-100 px-2 py-0.5 text-orange-700">🔨 Auction</span>}
            </div>
            <h2 className="mt-1 font-black">{l.title}</h2>
            <b className="mt-3 block">
              {l.bid_enabled ? `From ৳${l.starting_bid}` : l.price != null ? `৳${l.price}` : "—"}
            </b>
            <Link href={`/listing/${l.id}`} className="btn btn-primary mt-4 w-full text-sm">View</Link>
          </article>
        ))}
      </div>
      {!data?.length && <div className="card mt-8 p-10 text-center">No listings yet. Be the first! 🎉</div>}
    </main>
  );
}
