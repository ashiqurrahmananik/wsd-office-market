import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: me } = await supabase.from("profiles").select("is_admin,display_name").eq("id", user.id).single();
  if (!me?.is_admin) redirect("/");

  const [{ data: users }, { data: listings }, { data: bids }, { data: purchases }] =
    await Promise.all([
      supabase.from("profiles").select("id,display_name,avatar_url,mood,created_at,is_admin").order("created_at", { ascending: false }),
      supabase.from("listings").select("id,title,category,price,starting_bid,status,bid_enabled,bid_start_time,bid_end_time,seller_id,created_at,profiles(display_name)").order("created_at", { ascending: false }),
      supabase.from("bids").select("id,listing_id,bidder_id,amount,created_at,profiles(display_name)").order("created_at", { ascending: false }),
      supabase.from("purchases").select("id,listing_id,buyer_id,seller_id,amount,status,created_at").order("created_at", { ascending: false })
    ]);

  const activeBids = (listings || []).filter((l:any) =>
    l.bid_enabled && l.status === "AVAILABLE" &&
    l.bid_start_time && l.bid_end_time &&
    new Date(l.bid_start_time) <= new Date() && new Date(l.bid_end_time) > new Date()
  );

  return <main className="mx-auto max-w-7xl px-4 py-10">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="font-bold text-orange-500">🛠️ WSD Office Market</p><h1 className="text-4xl font-black">Admin Panel</h1><p className="mt-2 text-stone-500">Manage accounts, listings, sales and live auctions.</p></div>
      <a href="/" className="btn btn-secondary">← Marketplace</a>
    </div>

    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {[
        ["👥","Accounts",users?.length||0],
        ["📦","Listings",listings?.length||0],
        ["🔨","Running bids",activeBids.length],
        ["💰","Purchases",purchases?.length||0],
        ["🟢","Available",(listings||[]).filter((l:any)=>l.status==="AVAILABLE").length]
      ].map(x=><div className="card p-5" key={x[1]}><div className="text-2xl">{x[0]}</div><div className="mt-3 text-sm font-bold text-stone-500">{x[1]}</div><div className="text-3xl font-black">{x[2]}</div></div>)}
    </div>

    <section className="mt-10">
      <h2 className="text-2xl font-black">🔨 Running Bids</h2>
      <div className="mt-4 grid gap-4">
        {activeBids.length ? activeBids.map((l:any)=>{
          const lb=(bids||[]).filter((b:any)=>b.listing_id===l.id).sort((a:any,b:any)=>Number(b.amount)-Number(a.amount))[0];
          return <div className="card flex flex-wrap items-center justify-between gap-4 p-5" key={l.id}>
            <div><div className="text-xs font-bold text-orange-600">{l.category}</div><div className="text-lg font-black">{l.title}</div><div className="text-sm text-stone-500">Seller: {l.profiles?.display_name||"—"} · Ends {new Date(l.bid_end_time).toLocaleString()}</div></div>
            <div className="text-right"><div className="text-xs font-bold text-stone-500">Current bid</div><div className="text-2xl font-black">৳{lb?.amount ?? l.starting_bid ?? 0}</div><div className="text-sm">{lb?.profiles?.display_name||"No bids yet"}</div></div>
          </div>
        }):<div className="card p-8 text-center text-stone-500">No live auctions right now.</div>}
      </div>
    </section>

    <section className="mt-10">
      <h2 className="text-2xl font-black">📦 All Listings</h2>
      <div className="card mt-4 overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-orange-50"><tr><th className="p-4">Item</th><th>Seller</th><th>Price</th><th>Status</th><th>Type</th><th>Created</th></tr></thead><tbody>{(listings||[]).map((l:any)=><tr className="border-t border-stone-100" key={l.id}><td className="p-4 font-bold">{l.title}</td><td>{l.profiles?.display_name||"—"}</td><td>{l.price!=null?`৳${l.price}`:"—"}</td><td><span className="rounded-full bg-stone-100 px-2 py-1 text-xs font-bold">{l.status}</span></td><td>{l.bid_enabled?"🔨 Bid":""}{l.buy_now_enabled?" 🛒 Buy":""}</td><td>{new Date(l.created_at).toLocaleDateString()}</td></tr>)}</tbody></table></div>
    </section>

    <section className="mt-10">
      <h2 className="text-2xl font-black">👥 All Accounts</h2>
      <div className="card mt-4 overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-orange-50"><tr><th className="p-4">Name</th><th>Mood</th><th>Role</th><th>Joined</th></tr></thead><tbody>{(users||[]).map((u:any)=><tr className="border-t border-stone-100" key={u.id}><td className="p-4 font-bold">{u.display_name}</td><td>{u.mood||"—"}</td><td>{u.is_admin?"🛡️ Admin":"Employee"}</td><td>{new Date(u.created_at).toLocaleDateString()}</td></tr>)}</tbody></table></div>
    </section>

    <section className="mt-10">
      <h2 className="text-2xl font-black">💰 Purchases</h2>
      <div className="card mt-4 overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-orange-50"><tr><th className="p-4">Amount</th><th>Buyer</th><th>Seller</th><th>Status</th><th>Date</th></tr></thead><tbody>{(purchases||[]).map((p:any)=><tr className="border-t border-stone-100" key={p.id}><td className="p-4 font-bold">৳{p.amount}</td><td>{p.buyer_id}</td><td>{p.seller_id}</td><td>{p.status}</td><td>{new Date(p.created_at).toLocaleDateString()}</td></tr>)}</tbody></table></div>
    </section>
  </main>
}