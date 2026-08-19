"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function buyNow(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const listingId = String(formData.get("listing_id"));
  const { error } = await supabase.rpc("purchase_listing", { p_listing_id: listingId });

  if (error) redirect(`/listing/${listingId}?error=` + encodeURIComponent(error.message));
  redirect("/my-purchases");
}
