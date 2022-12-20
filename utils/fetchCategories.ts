import axios from 'axios';
import React from 'react';

export async function getCategories(
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
) {
  const data = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getCategories`
  );
  setCategories(data.data.categories);
}
