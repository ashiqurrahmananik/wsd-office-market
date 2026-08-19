import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { buyNow, placeBid } from "./actions";

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

  // Resolve the auction first if its time has passed, so we always show fresh status.
  await supabase.rpc("resolve_auction_if_ended", { p_listing_id: id });

  const { data: l } = await supabase.from("listings").select("*,profiles(display_name)").eq("id", id).single();
  if (!l) notFound();

  const { data: { user } } = await supabase.auth.getUser();
  const isOwner = user?.id === l.seller_id;
  const isSold = l.status !== "AVAILABLE";

  let bids: any[] = [];
  let highestBid: number | null = null;
  if (l.bid_enabled) {
    const { data: bidRows } = await supabase
      .from("bids")
      .select("id,amount,created_at,profiles(display_name)")
      .eq("listing_id", id)
      .order("amount", { ascending: false })
      .limit(10);
    bids = bidRows || [];
    highestBid = bids[0]?.amount ?? null;
  }

  const auctionEnded = l.bid_enabled && l.bid_end_time && new Date(l.bid_end_time).getTime() <= Date.now();
  const minNextBid = highestBid ?? l.starting_bid ?? 0;

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
            <div className="mt-8 rounded-2xl bg-orange-50 p-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-bold text-stone-600">{highestBid ? "Current highest bid" : "Starting bid"}</span>
                <span className="text-2xl font-black">৳{highestBid ?? l.starting_bid}</span>
              </div>
              {l.bid_end_time && (
                <div className="mt-1 text-xs font-bold text-stone-500">
                  {auctionEnded || l.status !== "AVAILABLE" ? "Auction ended" : `Ends ${new Date(l.bid_end_time).toLocaleString()}`}
                </div>
              )}

              {l.status !== "AVAILABLE" ? (
                <p className="mt-4 font-bold text-stone-500">
                  {l.status === "SOLD" ? "Sold to the winning bidder." : "Auction ended with no bids."}
                </p>
              ) : !user ? (
                <p className="mt-4 font-bold text-orange-800">Sign in to place a bid 😋</p>
              ) : isOwner ? (
                <p className="mt-4 font-bold text-orange-800">This is your own listing.</p>
              ) : (
                <form action={placeBid} className="mt-4 flex gap-2">
                  <input type="hidden" name="listing_id" value={l.id} />
                  <input
                    className="input flex-1"
                    name="amount"
                    type="number"
                    step="0.01"
                    min={minNextBid + 1}
                    placeholder={`More than ৳${minNextBid}`}
                    required
                  />
                  <button className="btn btn-primary">Place Bid</button>
                </form>
              )}

              {bids.length > 0 && (
                <div className="mt-5">
                  <div className="text-xs font-bold text-stone-500">Bid history</div>
                  <ul className="mt-2 grid gap-1 text-sm">
                    {bids.map((b) => (
                      <li key={b.id} className="flex justify-between">
                        <span>{(Array.isArray(b.profiles) ? b.profiles[0]?.display_name : b.profiles?.display_name) || "Bidder"}</span>
                        <b>৳{b.amount}</b>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
