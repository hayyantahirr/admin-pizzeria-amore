import supabaseAdmin from "@/lib/supabaseAdmin";

export async function POST(req) {
  try {
    // 1. Read body (what client sent)
    const body = await req.json();
    const {
      name,
      description,
      price,
      xs_price,
      sm_price,
      md_price,
      l_price,
      xl_price,
      imageUrl,
      category,
    } = body;

    // 2. Insert into products
    const { data, error } = await supabaseAdmin.from("dishes").insert([
      {
        item_name: name,
        item_desc: description,
        item_price: price,
        item_pic: imageUrl,
        item_xs_price: xs_price,
        item_sm_price: sm_price,
        item_md_price: md_price,
        item_l_price: l_price,
        item_xl_price: xl_price,
        item_category: category,
      },
    ]);

    if (error) {
      console.error("Supabase error:", error);
      return new Response(
        JSON.stringify({ error: error.message, details: error }),
        { status: 500 }
      );
    }

    // 3. Return data
    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
