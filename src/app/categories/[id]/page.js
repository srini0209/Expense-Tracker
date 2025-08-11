import React from "react";
import CategoriesForm from "../../components/CategoriesForm.jsx";

const getCategory = async (id) => {
  const cat = await fetch(`http://localhost:3000/api/categories/${id}`, {
    method: "GET",
  });
  const data = await cat.json();
  console.log("id-page.js Transaction fetch success - res:", data);
  return data;
};

const page = async ({ params }) => {
  const { id } = await params;
  const cat = await getCategory(id);
  console.log("id-page.js Transaction fetch Txn", cat);

  return <CategoriesForm initialData={cat} />;
};

export default page;
