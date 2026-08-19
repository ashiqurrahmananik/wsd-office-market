import { createListing } from "./actions";

export default async function Sell({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-black">Sell something 😋</h1>
      {error && <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-600">{error}</div>}
      <form action={createListing} className="card mt-8 grid gap-5 p-7 md:grid-cols-2" encType="multipart/form-data">
        <input className="input md:col-span-2" name="title" placeholder="Item name" required />
        <select className="input" name="category" defaultValue="Meal">
          <option>Meal</option>
          <option>Food</option>
          <option>Cake</option>
          <option>Drink</option>
          <option>Snack</option>
          <option>Dessert</option>
          <option>Other</option>
        </select>
        <input className="input" name="quantity" type="number" min={1} defaultValue={1} placeholder="Quantity" required />
        <textarea className="input md:col-span-2" name="description" rows={5} placeholder="Description" />
        <input className="input md:col-span-2" name="pickup_location" placeholder="Pickup location" required />

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-bold text-stone-600">Photo (optional)</label>
          <input className="input" name="image" type="file" accept="image/*" />
        </div>

        <fieldset className="md:col-span-2 rounded-2xl border border-stone-200 p-5">
          <legend className="px-2 text-sm font-bold text-stone-600">How do you want to sell it?</legend>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm font-bold">
              <input type="radio" name="sale_type" value="buy_now" defaultChecked />
              Fixed price (Buy Now)
            </label>
            <label className="flex items-center gap-2 text-sm font-bold">
              <input type="radio" name="sale_type" value="auction" />
              Auction (bidding)
            </label>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-stone-500">Price (৳) — for fixed price</label>
              <input className="input" name="price" type="number" min={0} step="0.01" placeholder="e.g. 50" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-stone-500">Starting bid (৳) — for auction</label>
              <input className="input" name="starting_bid" type="number" min={0} step="0.01" placeholder="e.g. 20" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-stone-500">Auction start (optional)</label>
              <input className="input" name="bid_start_time" type="datetime-local" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-stone-500">Auction end</label>
              <input className="input" name="bid_end_time" type="datetime-local" />
            </div>
          </div>
        </fieldset>

        <button className="btn btn-primary md:col-span-2">Create Listing</button>
      </form>
    </main>
  );
}
