import axios from 'axios';
import React from 'react';

export async function getProducts(
  setCategories: React.Dispatch<React.SetStateAction<Product[]>>
) {
  const data = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getProducts`
  );
  setCategories(data.data.products);
}
