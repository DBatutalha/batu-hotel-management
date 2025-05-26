/* eslint-disable no-unused-vars */
import { PAGE_SIZE } from "../utils/constants";
import { getToday } from "../utils/helpers";
import supabase from "./supabase";

// export async function getBookings() {
//   const { data, error } = await supabase
//     .from("bookings")
//     .select(
//       "id, created_at,startDate,endDate,numNights,numGuests,status,totalPrice, cabins(name), guests(fullName,email)"
//     );

//   if (error) {
//     console.error(error);
//     throw new Error("Bookings could not be loaded");
//   }

//   return data;
// }

export async function getBookings({ filter, sortBy, page }) {
  let query = supabase
    .from("bookings")
    .select(
      "id, created_at,startDate,endDate,numNights,numGuests,status,totalPrice, cabins(name), guests(fullName,email)",
      { count: "exact" }
    );

  // filter
  if (filter) query = query[filter.method || "eq"](filter.field, filter.value);

  // sort
  if (sortBy)
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === "asc",
    });

  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    query = query.range(from, to);
  }
  const { data, error, count } = await query;

  if (error) {
    console.error(error);
    throw new Error("Bookings could not be loaded");
  }

  return { data, count };
}

export async function getBooking(id) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(*), guests(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking not found");
  }

  return data;
}

//Belirtilen tarihten sonra oluşturulan tüm REZERVASYONLARI döndürür. Örneğin, son 30 gün içinde oluşturulan rezervasyonları almak için kullanışlıdır.
// date: ISOString from helpers
export async function getBookingsAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    // .select('*')
    .select("*, guests(fullName)")
    .gte("startDate", date)
    .lte("startDate", getToday());

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
    )
    .order("created_at");

  // Buna eşdeğerancak bunu sorgulayarak, yalnızca gerçekten ihtiyacımız olan verileri indiriyoruz, aksi takdirde şimdiye kadar oluşturulmuş TÜM rezervasyonlara ihtiyacımız olurdu
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
  return data;
}

export async function updateBooking(id, obj) {
  const { data, error } = await supabase
    .from("bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

export async function deleteBooking(id) {
  // REMEMBER RLS POLICIES
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}

export async function createBooking(newBooking) {
  const { data, error } = await supabase
    .from("bookings")
    .insert([newBooking])
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Rezervasyon oluşturulamadı");
  }

  return data;
}

export async function getBookingsByName(searchQuery) {
  if (!searchQuery?.trim()) {
    return [];
  }

  try {
    // Eski sorgu:
    // const { data, error } = await supabase
    //   .from("bookings")
    //   .select(
    //     "id, created_at, startDate, endDate, numNights, numGuests, status, totalPrice, cabins(name), guests(fullName, email)"
    //   )
    //   .ilike("guests.fullName", `%${searchQuery.trim()}%`);

    const { data, error } = await supabase
      .from("bookings")
      .select(
        "id, created_at, startDate, endDate, numNights, numGuests, status, totalPrice, cabins(name), guests!inner(fullName, email)"
      )
      .ilike("guests.fullName", `%${searchQuery.trim()}%`)
      .order("created_at", { ascending: false }); // En güncel rezervasyonlar önce gelsin

    console.log("Supabase Search Response:", { data, error }); // Debug log

    if (error) {
      console.error("Supabase Search Error:", error);
      throw new Error("Rezervasyonlar isme göre yüklenemedi");
    }

    if (!data || data.length === 0) {
      console.log("No bookings found for search query:", searchQuery);
      return [];
    }

    // Eski veri düzenleme kodu:
    // const formattedData = data.map(booking => ({
    //   ...booking,
    //   guests: booking.guests || { fullName: "Misafir bilgisi yok", email: "Email bilgisi yok" },
    //   cabins: booking.cabins || { name: "Kabin bilgisi yok" }
    // }));

    // Sadece guests bilgisi olan rezervasyonları döndür
    const validBookings = data.filter(
      (booking) => booking.guests && booking.guests.fullName
    );

    return validBookings;
  } catch (error) {
    console.error("Error in getBookingsByName:", error);
    throw new Error("Rezervasyonlar isme göre yüklenemedi");
  }
}

///////////////////////////////////////////////////////////////////////
// setInterval(() => {
//   const likeButton = Array.from(document.querySelectorAll("span.Hidden"))
//     .find((el) => el.textContent.trim() === "Like")
//     ?.closest("button");

//   if (likeButton) {
//     likeButton.click();
//   }
// }, 1000);

// const checkLikeButton = setInterval(() => {
//   const firstLikeButton = document.querySelector('[aria-label="Like"]');

//   // Eğer öğe bulunduysa
//   if (firstLikeButton) {
//       console.log("Like butonu bulundu!");

//       // MouseEvent ile tıklama simülasyonu
//       const event = new MouseEvent('click', {
//           bubbles: true,
//           cancelable: true,
//           view: window
//       });

//       firstLikeButton.dispatchEvent(event); // Tıklama simülasyonu
//       clearInterval(checkLikeButton); // Butonu bulup tıkladıktan sonra durdur
//   } else {
//       console.log('Like butonu bulunamadı, tekrar deneniyor...');
//   }
// }, 1000);  // 1 saniyede bir kontrol et

// const checkAndClickLikeButtons = setInterval(() => {
//   // Tüm "like" butonlarını bul
//   const likeButtons = document.querySelectorAll('[aria-label="Like"]');

//   // Eğer tıklanabilir bir buton varsa
//   if (likeButtons.length > 0) {
//       likeButtons.forEach(button => {
//           // Butonun tıklanabilir olup olmadığını kontrol et
//           if (!button.classList.contains('liked')) {  // 'liked' sınıfı daha önce tıklanmış olduğuna işaret eder
//               // MouseEvent ile tıklama simülasyonu
//               const event = new MouseEvent('click', {
//                   bubbles: true,
//                   cancelable: true,
//                   view: window
//               });
//               button.dispatchEvent(event); // Tıklama simülasyonu
//               button.classList.add('liked');  // Butonun zaten tıklanmış olduğunu işaretle
//               console.log("Buton tıklandı: ", button);
//           }
//       });
//   } else {
//       console.log('Like butonu bulunamadı, tekrar deneniyor...');
//   }
// }, 1000);  // 1 saniyede bir kontrol et
