import supabase from "./supabase";

export async function getGuests() {
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .order("fullName");

  if (error) {
    console.error(error);
    throw new Error("Could not load guests");
  }

  return data;
}

export async function createGuest(newGuest) {
  const { data, error } = await supabase
    .from("guests")
    .insert([
      {
        fullName: newGuest.fullName,
        email: newGuest.email,
        nationalID: newGuest.nationalID,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Could not create guest");
  }

  return data;
}
