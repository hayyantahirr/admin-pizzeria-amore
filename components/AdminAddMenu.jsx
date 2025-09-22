"use client";

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { supabase } from "@/lib/supabaseClient";

// Modal component for adding new menu items
const AdminAddMenu = ({ isOpen, onClose }) => {
  // State to show notification after form submission
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  // State to track loading during form submission
  const [isLoading, setIsLoading] = useState(false);

  // Refs for form inputs
  const nameRef = useRef(null);
  const descriptionRef = useRef(null);
  const priceRef = useRef(null);
  const imageRef = useRef(null);
  const xs_priceRef = useRef(null);
  const sm_priceRef = useRef(null);
  const md_priceRef = useRef(null);
  const l_priceRef = useRef(null);
  const xl_priceRef = useRef(null);
  const categoryRef = useRef(null);

  // Ref for the modal to detect outside clicks
  const modalRef = useRef(null);

  // Handle click outside modal to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Function to upload image to Supabase storage
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if refs are valid before accessing their values
      if (
        !nameRef.current ||
        !descriptionRef.current ||
        !priceRef.current ||
        !xs_priceRef.current ||
        !sm_priceRef.current ||
        !md_priceRef.current ||
        !l_priceRef.current ||
        !xl_priceRef.current ||
        !imageRef.current ||
        !categoryRef.current
      ) {
        setNotification({
          show: true,
          message: "Form initialization error. Please try again.",
          type: "error",
        });
        setIsLoading(false);
        return;
      }

      // Get values from refs
      const name = nameRef.current.value;
      const description = descriptionRef.current.value;
      const price = parseFloat(priceRef.current.value);
      const xs_price = parseFloat(xs_priceRef.current.value);
      const sm_price = parseFloat(sm_priceRef.current.value);
      const md_price = parseFloat(md_priceRef.current.value);
      const l_price = parseFloat(l_priceRef.current.value);
      const xl_price = parseFloat(xl_priceRef.current.value);
      const imageFile = imageRef.current.files[0];

      const category = categoryRef.current.value;

      // Validate inputs
      if (!name || !description || !imageFile || !category) {
        setNotification({
          show: true,
          message: "Please fill all fields",
          type: "error",
        });
        setIsLoading(false);
        return;
      }

      // Upload image to Supabase
      const imageUrl = await uploadImage(imageFile);

      // Send data to API
      await axios.post("/api/add-products", {
        name,
        description,
        price,
        imageUrl,
        xs_price,
        sm_price,
        md_price,
        l_price,
        xl_price,
        category,
      });

      // Show success notification
      setNotification({
        show: true,
        message: "Product added successfully!",
        type: "success",
      });

      // Reset form and close modal
      e.target.reset();
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error adding product:", error);
      setNotification({
        show: true,
        message: `Error: ${error.message || "Failed to add product"}`,
        type: "error",
      });
    } finally {
      setIsLoading(false);

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    }
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "var(--card-bg)", color: "var(--card-text)" }}
      >
        <h3 className="text-xl font-bold mb-4">Add New Menu Item</h3>

        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <form onSubmit={handleSubmit}>
            {/* Item Name */}
            <div className="mb-4">
              <label className="block mb-2">Item Name</label>
              <input
                type="text"
                ref={nameRef}
                className="w-full px-3 py-2 border rounded-md"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--card-text)",
                }}
                placeholder="Pizza Name"
                required
              />
            </div>
            {/* Item Description */}
            <div className="mb-4">
              <label className="block mb-2">Description</label>
              <textarea
                ref={descriptionRef}
                className="w-full px-3 py-2 border rounded-md"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--card-text)",
                }}
                placeholder="Describe the item"
                rows="3"
                required
              ></textarea>
            </div>
            {/* Item Price */}
            <div className="mb-4">
              <label className="block mb-2">Price ($)</label>
              <input
                type="number"
                ref={priceRef}
                className="w-full px-3 py-2 border rounded-md"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--card-text)",
                }}
                placeholder="9.99"
                step="0.01"
                min="0"
                required
              />
            </div>
            {/* Item xs Price */}
            <div className="mb-4">
              <label className="block mb-2">Xs Price ($)</label>
              <input
                type="number"
                ref={xs_priceRef}
                className="w-full px-3 py-2 border rounded-md"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--card-text)",
                }}
                placeholder="9.99"
                step="0.01"
                min="0"
              />
            </div>{" "}
            {/* Item sm Price */}
            <div className="mb-4">
              <label className="block mb-2">Sm Price ($)</label>
              <input
                type="number"
                ref={sm_priceRef}
                className="w-full px-3 py-2 border rounded-md"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--card-text)",
                }}
                placeholder="9.99"
                step="0.01"
                min="0"
              />
            </div>{" "}
            {/* Item md Price */}
            <div className="mb-4">
              <label className="block mb-2">Md Price ($)</label>
              <input
                type="number"
                ref={md_priceRef}
                className="w-full px-3 py-2 border rounded-md"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--card-text)",
                }}
                placeholder="9.99"
                step="0.01"
                min="0"
              />
            </div>{" "}
            {/* Item Large Price */}
            <div className="mb-4">
              <label className="block mb-2">Lg Price ($)</label>
              <input
                type="number"
                ref={l_priceRef}
                className="w-full px-3 py-2 border rounded-md"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--card-text)",
                }}
                placeholder="9.99"
                step="0.01"
                min="0"
              />
            </div>
            {/* Item Large Price */}
            <div className="mb-4">
              <label className="block mb-2">Xl Price ($)</label>
              <input
                type="number"
                ref={xl_priceRef}
                className="w-full px-3 py-2 border rounded-md"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--card-text)",
                }}
                placeholder="9.99"
                step="0.01"
                min="0"
              />
            </div>
            {/* Item Category */}
            <div className="mb-4">
              <label className="block mb-2">Category</label>
              <select
                ref={categoryRef}
                className="w-full px-3 py-2 border rounded-md"
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
                <option value="Sandwiches">Sandwiches</option>
                <option value="Drinks">Drinks</option>
              </select>
            </div>
            {/* Item Image */}
            <div className="mb-6">
              <label className="block mb-2">Image</label>
              <input
                type="file"
                ref={imageRef}
                className="w-full px-3 py-2 border rounded-md"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--card-text)",
                }}
                accept="image/*"
                required
              />
            </div>
            {/* Form Actions */}
            <div className="flex justify-end space-x-2 mt-4">
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
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-[var(--accent)] text-white"
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add Item"}
              </button>
            </div>
          </form>
        </div>

        {/* Notification popup */}
        {notification.show && (
          <div
            className={`fixed bottom-4 right-4 px-6 py-3 rounded-md shadow-lg ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {notification.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAddMenu;
