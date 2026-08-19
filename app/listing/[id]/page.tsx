import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { buyNow } from "./actions";

export default async function Listing({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();

  const { data: l } = await supabase.from("listings").select("*,profiles(display_name)").eq("id", id).single();
  if (!l) notFound();

  const { data: { user } } = await supabase.auth.getUser();
  const isOwner = user?.id === l.seller_id;
  const isSold = l.status !== "AVAILABLE";

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="card grid gap-8 p-7 md:grid-cols-2">
        <div className="flex min-h-80 items-center justify-center overflow-hidden rounded-3xl bg-orange-50 text-8xl">
          {l.image_url ? (
            <img src={l.image_url} alt={l.title} className="h-full w-full object-cover" />
          ) : (
            "🍱"
          )}
        </div>
        <div>
          <div className="text-sm font-bold text-orange-600">{l.mood || l.category}</div>
          <h1 className="mt-2 text-4xl font-black">{l.title}</h1>
          <p className="mt-4 text-stone-600">{l.description}</p>
          <div className="mt-6 grid gap-2 text-sm">
            <span>👤 Seller: {l.profiles?.display_name || "Office colleague"}</span>
            <span>📦 Quantity: {l.quantity}</span>
            <span>📍 Pickup: {l.pickup_location}</span>
          </div>

          {error && <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-600">{error}</div>}

          {l.buy_now_enabled && (
            <>
              <div className="mt-8 text-3xl font-black">৳{l.price}</div>
              {isSold ? (
                <p className="mt-5 rounded-2xl bg-stone-100 p-4 font-bold text-stone-500">This item is no longer available.</p>
              ) : !user ? (
                <p className="mt-5 rounded-2xl bg-orange-50 p-4 font-bold text-orange-800">Sign in to continue 😋</p>
              ) : isOwner ? (
                <p className="mt-5 rounded-2xl bg-orange-50 p-4 font-bold text-orange-800">This is your own listing.</p>
              ) : (
                <form action={buyNow}>
                  <input type="hidden" name="listing_id" value={l.id} />
                  <button className="btn btn-primary mt-5 w-full">Buy Now 🎉</button>
                </form>
              )}
            </>
          )}

          {l.bid_enabled && (
            <div className="mt-8 flex items-center justify-between rounded-2xl bg-orange-50 p-5">
              <span className="text-sm font-bold text-stone-600">🔨 Bidding</span>
              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-500">Coming soon</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
