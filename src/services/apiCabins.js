/* eslint-disable no-unused-vars */
import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase
    .from("cabins")
    .select("*")
    .order("name");

  if (error) {
    console.error(error);
    throw new Error("Kabininler yüklenemedi");
  }

  return data;
}

export async function createEditCabin(newCabin, id) {
  //supabase urli mi diye kontrol etmek için.
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    ""
  );
  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // 1. Kabin oluştur
  let query = supabase.from("cabins");

  // create
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  // edit
  if (id) query = query.update({ ...newCabin, image: imagePath }).eq("id", id);

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("Cabin can not be created");
  }

  // 2. Görseli yükle
  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  // 3. Yüklemede hata varsa cabin'i sil
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data[0].id); // data[0] olarak düzeltildi
    console.error(storageError);
    throw new Error(
      "Cabin image can not be uploaded and the cabin was not created"
    );
  }

  return data;
}

export async function deleteCabin(id) {
  const { error, data } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabin can not be deleted");
  }

  return data;
}
