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

  const saleType = String(formData.get("sale_type") || "buy_now");
  const isAuction = saleType === "auction";

  if (isAuction) {
    const startingBid = formData.get("starting_bid");
    const bidEndTime = formData.get("bid_end_time");
    if (!startingBid || Number(startingBid) <= 0) {
      redirect("/sell?error=" + encodeURIComponent("Enter a starting bid for the auction."));
    }
    if (!bidEndTime) {
      redirect("/sell?error=" + encodeURIComponent("Pick an auction end time."));
    }
  } else {
    const price = formData.get("price");
    if (!price || Number(price) <= 0) {
      redirect("/sell?error=" + encodeURIComponent("Enter a price for the listing."));
    }
  }

  const { error } = await supabase.from("listings").insert({
    seller_id: user.id,
    title: String(formData.get("title") || ""),
    description: String(formData.get("description") || ""),
    category: String(formData.get("category") || "Other"),
    quantity: Number(formData.get("quantity") || 1),
    pickup_location: String(formData.get("pickup_location") || ""),
    image_url,
    buy_now_enabled: !isAuction,
    price: !isAuction ? Number(formData.get("price")) : null,
    bid_enabled: isAuction,
    starting_bid: isAuction ? Number(formData.get("starting_bid")) : null,
    bid_start_time: isAuction && formData.get("bid_start_time") ? new Date(String(formData.get("bid_start_time"))).toISOString() : (isAuction ? new Date().toISOString() : null),
    bid_end_time: isAuction && formData.get("bid_end_time") ? new Date(String(formData.get("bid_end_time"))).toISOString() : null,
  });

  if (error) redirect("/sell?error=" + encodeURIComponent(error.message));
  redirect("/browse");
}
