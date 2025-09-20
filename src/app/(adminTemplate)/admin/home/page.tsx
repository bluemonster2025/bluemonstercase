// "use client";

// import { useEffect, useState } from "react";
// import { Acf, Page, AdminHomeEditorProps } from "@/types/admin";

// export default function AdminHomeEditor({ initialPage }: AdminHomeEditorProps) {
//   const [page, setPage] = useState<Page | null>(initialPage || null);
//   const [acf, setAcf] = useState<Acf>({
//     hero: { title: "", subtitle: "", image: "" },
//     section1: [],
//   });
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!initialPage) {
//       (async () => {
//         const res = await fetch("/api/wp/home");
//         const data = await res.json();
//         setPage(data.page || null);
//         setAcf((prev) => data.acf?.acf || prev); // functional update evita dependência
//       })();
//     } else {
//       setAcf(initialPage.acf);
//     }
//   }, [initialPage]);

//   async function save() {
//     if (!page) return;
//     setLoading(true);
//     const res = await fetch("/api/wp/home", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ id: page.id, acf }),
//     });
//     setLoading(false);
//     if (res.ok) alert("Home atualizada");
//     else alert("Erro ao salvar");
//   }

//   if (!page) return <div className="p-6">Carregando...</div>;

//   return (
//     <div className="container mx-auto p-6 max-w-3xl">
//       <h1 className="text-2xl font-bold mb-4">Editor da Home</h1>

//       <label className="block mb-2">Hero - Título</label>
//       <input
//         className="border p-2 w-full mb-3"
//         value={acf.hero.title}
//         onChange={(e) =>
//           setAcf((prev) => ({
//             ...prev,
//             hero: { ...prev.hero, title: e.target.value },
//           }))
//         }
//       />

//       <label className="block mb-2">Hero - Subtítulo</label>
//       <input
//         className="border p-2 w-full mb-3"
//         value={acf.hero.subtitle}
//         onChange={(e) =>
//           setAcf((prev) => ({
//             ...prev,
//             hero: { ...prev.hero, subtitle: e.target.value },
//           }))
//         }
//       />

//       <label className="block mb-2">Hero - Image URL</label>
//       <input
//         className="border p-2 w-full mb-3"
//         value={acf.hero.image}
//         onChange={(e) =>
//           setAcf((prev) => ({
//             ...prev,
//             hero: { ...prev.hero, image: e.target.value },
//           }))
//         }
//       />

//       <div className="mt-6">
//         <h2 className="font-semibold mb-2">
//           Section 1 — Categorias (cada uma com até 5 produtos)
//         </h2>
//         {acf.section1.map((s, idx) => (
//           <div key={idx} className="border p-3 mb-3">
//             <input
//               className="border p-2 w-full mb-2"
//               placeholder="Título da seção"
//               value={s.title}
//               onChange={(e) => {
//                 setAcf((prev) => {
//                   const copy = [...prev.section1];
//                   copy[idx].title = e.target.value;
//                   return { ...prev, section1: copy };
//                 });
//               }}
//             />
//             <input
//               className="border p-2 w-full mb-2"
//               placeholder="Categoria slug"
//               value={s.slug}
//               onChange={(e) => {
//                 setAcf((prev) => {
//                   const copy = [...prev.section1];
//                   copy[idx].slug = e.target.value;
//                   return { ...prev, section1: copy };
//                 });
//               }}
//             />
//             <input
//               className="border p-2 w-full mb-2"
//               placeholder="IDs de produtos separados por vírgula"
//               value={s.products.map((p) => p.id).join(",")}
//               onChange={(e) => {
//                 const ids = e.target.value
//                   .split(",")
//                   .map((x) => Number(x.trim()))
//                   .filter(Boolean);
//                 setAcf((prev) => {
//                   const copy = [...prev.section1];
//                   copy[idx].products = ids.map((id) => ({ id }));
//                   return { ...prev, section1: copy };
//                 });
//               }}
//             />
//           </div>
//         ))}
//         <button
//           className="bg-gray-200 px-3 py-1 rounded"
//           onClick={() =>
//             setAcf((prev) => ({
//               ...prev,
//               section1: [
//                 ...prev.section1,
//                 { title: "", slug: "", products: [] },
//               ],
//             }))
//           }
//         >
//           Adicionar Seção
//         </button>
//       </div>

//       <div className="mt-6">
//         <button
//           disabled={loading}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//           onClick={save}
//         >
//           {loading ? "Salvando..." : "Salvar Home"}
//         </button>
//       </div>
//     </div>
//   );
// }

export default function AdminHomeEditor() {
  return <h1>kdlkwqdkwkldlkwmdkl</h1>;
}
