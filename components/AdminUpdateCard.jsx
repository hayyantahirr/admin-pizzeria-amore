"use client";

import React, { useState, useEffect, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const AdminUpdateCard = ({ product, isOpen, onClose, onProductUpdated }) => {
  const supabase = createClientComponentClient();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    xs_price: "",
    sm_price: "",
    md_price: "",
    l_price: "",
    xl_price: "",
    category: "",
    description: "",
    image_url: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useFileUpload, setUseFileUpload] = useState(false);
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price || "",
        xs_price: product.xs_price || "",
        sm_price: product.sm_price || "",
        md_price: product.md_price || "",
        l_price: product.l_price || "",
        xl_price: product.xl_price || "",
        category: product.category || "",
        description: product.description || "",
        image_url: product.image_url || "",
      });
      setUseFileUpload(false);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // If image URL is cleared, switch to file upload
    if (name === "image_url" && value === "") {
      setUseFileUpload(true);
    }
  };

  const uploadImage = async (file) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()
        .toString(36)
        .substring(2, 15)}.${fileExt}`;
      const filePath = `menu-items/${fileName}`;

      const { data, error } = await supabase.storage
        .from("pizzeria-amore")
        .upload(filePath, file);

      if (error) throw error;

      // Get public URL for the uploaded image
      const {
        data: { publicUrl },
      } = supabase.storage.from("pizzeria-amore").getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let imageUrl = formData.image_url;

      // If using file upload and a file is selected
      if (
        useFileUpload &&
        fileInputRef.current &&
        fileInputRef.current.files[0]
      ) {
        imageUrl = await uploadImage(fileInputRef.current.files[0]);
      }

      const { data, error } = await supabase
        .from("dishes")
        .update({
          item_name: formData.name,
          item_price: formData.price,
          item_xs_price: formData.xs_price,
          item_sm_price: formData.sm_price,
          item_md_price: formData.md_price,
          item_l_price: formData.l_price,
          item_xl_price: formData.xl_price,
          item_category: formData.category,
          item_desc: formData.description,
          item_pic: imageUrl,
        })
        .eq("id", product.id);

      if (error) throw error;

      onProductUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Failed to update product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from("dishes")
        .delete()
        .eq("id", product.id);

      if (error) throw error;

      onProductUpdated();
      onClose();
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("Failed to delete product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "var(--card-bg)", color: "var(--card-text)" }}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
            Update Product
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="max-h-[70vh] overflow-y-auto pr-2">
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  style={{
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                    borderColor: "var(--card-text)",
                  }}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  style={{
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                    borderColor: "var(--card-text)",
                  }}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  XS Price
                </label>
                <input
                  type="number"
                  name="xs_price"
                  value={formData.xs_price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  style={{
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                    borderColor: "var(--card-text)",
                  }}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Sm Price
                </label>
                <input
                  type="number"
                  name="sm_price"
                  value={formData.sm_price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  style={{
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                    borderColor: "var(--card-text)",
                  }}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  md Price
                </label>
                <input
                  type="number"
                  name="md_price"
                  value={formData.md_price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  style={{
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                    borderColor: "var(--card-text)",
                  }}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  l Price
                </label>
                <input
                  type="number"
                  name="l_price"
                  value={formData.l_price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  style={{
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                    borderColor: "var(--card-text)",
                  }}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  xl Price
                </label>
                <input
                  type="number"
                  name="xl_price"
                  value={formData.xl_price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  style={{
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                    borderColor: "var(--card-text)",
                  }}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  style={{
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                    borderColor: "var(--card-text)",
                  }}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Pizza">Pizza</option>
                  <option value="Appetizers">Appetizers</option>
                  <option value="Drinks">Drinks</option>
                  <option value="Sandwiches">Sandwiches</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  style={{
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                    borderColor: "var(--card-text)",
                  }}
                  rows="3"
                ></textarea>
              </div>

              {!useFileUpload ? (
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    Image URL
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      style={{
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        borderColor: "var(--card-text)",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setUseFileUpload(true)}
                      className="ml-2 px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                      Upload
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    style={{
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                      borderColor: "var(--card-text)",
                    }}
                    accept="image/*"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setUseFileUpload(false);
                      setFormData((prev) => ({
                        ...prev,
                        image_url: product.image_url || "",
                      }));
                    }}
                    className="mt-2 px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
                  >
                    Use URL Instead
                  </button>
                </div>
              )}

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border rounded-md"
                  style={{
                    borderColor: "var(--card-text)",
                    color: "var(--card-text)",
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </button>

                <div>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 mr-2"
                    disabled={isLoading}
                  >
                    Delete
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-[var(--accent)] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating..." : "Update"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUpdateCard;
