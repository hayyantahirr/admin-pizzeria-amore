"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import AdminUpdateCard from "./AdminUpdateCard";
import { useTheme } from "./ThemeContext";

const AdminCards = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme } = useTheme();

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("dishes").select("*");
    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEditClick = (product) => {
    setSelectedProduct({
      id: product.id,
      name: product.item_name,
      price: product.item_price,
      category: product.item_category,
      description: product.item_desc || "",
      image_url: product.item_pic,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleProductUpdated = () => {
    fetchProducts();
  };

  return (
    <>
      <div
        className={`p-4 rounded-lg shadow grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${
          theme === "light" ? "bg-white" : "bg-gray-700"
        }`}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className={`rounded-lg shadow-lg overflow-hidden ${
              theme === "light" ? "bg-white" : "bg-gray-800"
            }`}
          >
            <div className="relative h-50">
              <Image
                src={product.item_pic}
                alt={product.item_name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3
                className={`text-lg font-bold ${
                  theme === "light" ? "text-gray-900" : "text-white"
                }`}
              >
                {product.item_name}
              </h3>
              <span
                className={`text-lg font-bold ${
                  theme === "light" ? "text-gray-800" : "text-gray-200"
                }`}
              >
                Price : RS. {product.item_price}
              </span>
              <span
                className={`text-lg font-bold block ${
                  theme === "light" ? "text-gray-800" : "text-gray-200"
                }`}
              >
                Category : {product.item_category}
              </span>

              <div className="flex justify-between items-center mt-4">
                <button
                  className={`py-2 rounded-lg w-full font-medium transition-colors ${
                    theme === "light"
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                  onClick={() => handleEditClick(product)}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <AdminUpdateCard
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onProductUpdated={handleProductUpdated}
        />
      )}
    </>
  );
};

export default AdminCards;
