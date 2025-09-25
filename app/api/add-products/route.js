import supabaseAdmin from "@/lib/supabaseAdmin";

export async function POST(req) {
  try {
    console.log("=== ADD PRODUCT API CALLED ===");
    
    // 1. Read body (what client sent)
    const body = await req.json();
    console.log("Request body received:", body);
    
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

    // Validate required fields
    if (!name || !description || !imageUrl || !category) {
      console.error("Missing required fields:", { name, description, imageUrl, category });
      return new Response(
        JSON.stringify({ 
          error: "Missing required fields", 
          missing: {
            name: !name,
            description: !description,
            imageUrl: !imageUrl,
            category: !category
          }
        }),
        { status: 400 }
      );
    }

    // Log the data being inserted
    const insertData = {
      item_name: name,
      item_desc: description,
      item_price: price || null,
      item_pic: imageUrl,
      item_xs_price: xs_price || null,
      item_sm_price: sm_price || null,
      item_md_price: md_price || null,
      item_l_price: l_price || null,
      item_xl_price: xl_price || null,
      item_category: category,
    };
    
    console.log("Data to be inserted:", insertData);

    // Check if supabaseAdmin is properly initialized
    if (!supabaseAdmin) {
      console.error("Supabase admin client not initialized");
      return new Response(
        JSON.stringify({ error: "Database connection error" }),
        { status: 500 }
      );
    }

    // 2. Insert into products
    console.log("Attempting to insert into dishes table...");
    const { data, error } = await supabaseAdmin.from("dishes").insert([insertData]);

    if (error) {
      console.error("Supabase insertion error:", error);
      console.error("Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return new Response(
        JSON.stringify({ 
          error: error.message, 
          details: error.details,
          hint: error.hint,
          code: error.code
        }),
        { status: 500 }
      );
    }

    console.log("Product inserted successfully:", data);

    // 3. Return data
    return new Response(JSON.stringify({ 
      success: true,
      message: "Product added successfully",
      data 
    }), { status: 200 });
    
  } catch (err) {
    console.error("Unexpected error in add-products API:", err);
    console.error("Error stack:", err.stack);
    return new Response(JSON.stringify({ 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }), {
      status: 500,
    });
  }
}
