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
        <input className="input" name="price" type="number" min={0} step="0.01" placeholder="Price (৳)" />
        <textarea className="input md:col-span-2" name="description" rows={5} placeholder="Description" />
        <input className="input md:col-span-2" name="pickup_location" placeholder="Pickup location" required />
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-bold text-stone-600">Photo (optional)</label>
          <input className="input" name="image" type="file" accept="image/*" />
        </div>
        <button className="btn btn-primary md:col-span-2">Create Listing</button>
      </form>
    </main>
  );
}
