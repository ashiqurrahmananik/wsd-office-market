"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createListing(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let image_url: string | null = null;
  const file = formData.get("image") as File | null;
  if (file && file.size > 0) {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("listing-images").upload(path, file);
    if (!upErr) {
      const { data: pub } = supabase.storage.from("listing-images").getPublicUrl(path);
      image_url = pub.publicUrl;
    }
  }

  const price = formData.get("price");
  if (!price || Number(price) <= 0) {
    redirect("/sell?error=" + encodeURIComponent("Enter a price for the listing."));
  }

  const { error } = await supabase.from("listings").insert({
    seller_id: user.id,
    title: String(formData.get("title") || ""),
    description: String(formData.get("description") || ""),
    category: String(formData.get("category") || "Other"),
    quantity: Number(formData.get("quantity") || 1),
    pickup_location: String(formData.get("pickup_location") || ""),
    image_url,
    buy_now_enabled: true,
    price: Number(price),
    bid_enabled: false,
  });

  if (error) redirect("/sell?error=" + encodeURIComponent(error.message));
  redirect("/browse");
}
