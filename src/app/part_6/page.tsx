// "use client";
// import React, { useState, useCallback, useMemo, useEffect } from "react";
// import "./part6.css";
// import { supabase } from "../../lib/supabase/client";

// type NodeId = string;
// type NodeRow = { id: string; label: string; parent_id: string | null };
// type TreeNode = NodeRow & { children?: TreeNode[] };
// type Category = { id: string; node_id: string; title: string; body: string };

// type TreeProps = {
//   root: TreeNode;
//   expanded: Set<NodeId>;
//   onToggle: (id: NodeId) => void;
//   onSelect: (id: NodeId) => void;
//   selectedId: NodeId | null;
// };

// function buildTree(flat: NodeRow[]): TreeNode[] {
//   const map = new Map<string, TreeNode>();
//   flat.forEach((n) => map.set(n.id, { ...n, children: [] }));
//   const roots: TreeNode[] = [];
//   for (const n of map.values()) {
//     if (n.parent_id && map.has(n.parent_id))
//       map.get(n.parent_id)!.children!.push(n);
//     else roots.push(n);
//   }
//   return roots;
// }

// function findNodeAndParent(
//   root: TreeNode,
//   id: NodeId,
//   parent: TreeNode | null = null
// ): { node: TreeNode | null; parent: TreeNode | null } {
//   if (root.id === id) return { node: root, parent };
//   for (const c of root.children ?? []) {
//     const res = findNodeAndParent(c, id, root);
//     if (res.node) return res;
//   }
//   return { node: null, parent: null };
// }

// function siblingIds(parent: TreeNode | null, root: TreeNode): NodeId[] {
//   if (!parent) return [root.id];
//   return (parent.children ?? []).map((c) => c.id);
// }



// function Tree({ root, expanded, onToggle, onSelect, selectedId }: TreeProps) {
//   const render = (node: TreeNode): React.ReactNode => {
//     if (!node) return null;
//     const isParent = (node.children ?? []).length > 0;
//     const isOpen = expanded.has(node.id);
//     const isSelected = selectedId === node.id;

//     return (
//       <div key={node.id}>
//         <div className={`tree-row ${isSelected ? "selected" : ""}`}>
//           {isParent ? (
//             <button
//               onClick={() => onToggle(node.id)}
//               className="tree-button"
//               aria-label={isOpen ? "Collapse" : "Expand"}
//             >
//               <span className={`tree-chevron ${isOpen ? "open" : ""}`}>►</span>
//             </button>
//           ) : (
//             <span style={{ width: 18 }} />
//           )}

//           {isParent ? (
//             <button
//               className="tree-label as-button"
//               onClick={() => onSelect(node.id)}
//             >
//               {node.label}
//             </button>
//           ) : (
//             <>
//               <span className="tree-bullet">◉</span>
//               <button onClick={() => onSelect(node.id)} className="tree-leaf">
//                 {node.label}
//               </button>
//             </>
//           )}
//         </div>

//         {isParent && isOpen && (
//           <div className="tree-children">
//             {(node.children ?? []).length > 0 ? (
//               node.children!.map((c) => render(c))
//             ) : (
//               <div className="tree-empty">(No children under this parent)</div>
//             )}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return <div>{render(root)}</div>;
// }

// export default function Page() {
//   const [expanded, setExpanded] = useState<Set<NodeId>>(new Set());
//   const [selectedId, setSelectedId] = useState<NodeId | null>(null);
//   const [openCategory, setOpenCategory] = useState<string | null>(null);

//   const [nodes, setNodes] = useState<NodeRow[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);

//   useEffect(() => {
//     supabase
//       .from("treenodes")
//       .select("id,label,parent_id")
//       .order("label", { ascending: true })
//       .then(({ data, error }) => {
//         if (error) {
//           console.error("treenodes select error", error);
//           return;
//         }
//         setNodes(data || []);
//       });
//   }, []);

//   const nestedRoots = useMemo(() => buildTree(nodes), [nodes]);

//   const placerRoot: TreeNode = useMemo(
//     () => ({
//       id: "synthetic-root",
//       label: "Root",
//       parent_id: null,
//       children: nestedRoots,
//     }),
//     [nestedRoots]
//   );


//   useEffect(() => {
//     if (!selectedId && nodes.length) {
//       const dataRoot = nodes.find((n) => n.parent_id === null)?.id;
//       setSelectedId(dataRoot ?? placerRoot.id);
//       setExpanded(new Set([dataRoot ?? placerRoot.id]));
//     }
//   }, [nodes, selectedId, placerRoot.id]);

//   useEffect(() => {
//     if (!selectedId || selectedId === "synthetic-root") {
//       setCategories([]);
//       return;
//     }
//     supabase
//       .from("categories")
//       .select("id,node_id,title,body")
//       .eq("node_id", selectedId)
//       .order("title", { ascending: true })
//       .then(({ data, error }) => {
//         if (error) {
//           console.error("categories select error", error);
//         } else {
//           setCategories(data || []);
//         }
//       });
//   }, [selectedId]);

//   const onToggle = useCallback(
//     (id: NodeId) => {
//       setExpanded((prev) => {
//         const next = new Set(prev);
//         const { parent } = findNodeAndParent(placerRoot, id);
//         for (const sib of siblingIds(parent, placerRoot)) {
//           if (sib !== id) next.delete(sib);
//         }
//         next.has(id) ? next.delete(id) : next.add(id);
//         return next;
//       });
//     },
//     [placerRoot]
//   );

//   const onSelect = useCallback((id: NodeId) => setSelectedId(id), []);

//   const selectedNode = useMemo(() => {
//     if (!selectedId) return null;
//     return findNodeAndParent(placerRoot, selectedId).node;
//   }, [selectedId, placerRoot]);

//   const toggleCategory = (k: string) =>
//     setOpenCategory((prev) => (prev === k ? null : k));

//   return (
//     <div className="tree-container part4-shell">
//         <div className="tree-title">PART 6</div>
//       <header className="part4-header">
//         <div className="part4-header-right">
//           <h1 className="part4-header-title">Header</h1>
//         </div>
//       </header>

//       <div className="part3-split">
//         <aside className="part3-nav">
//           <div className="part3-panel-title">Tree / Nav</div>
//           <Tree
//             root={nestedRoots[0]}
//             expanded={expanded}
//             onToggle={onToggle}
//             onSelect={onSelect}
//             selectedId={selectedId}
//           />
//         </aside>

//         <main className="part3-body">
//           <div className="part3-panel-title">Body / Page</div>

//           <h2 className="part3-body-heading">
//             {selectedNode ? selectedNode.label : "Nothing selected"}
//           </h2>
//           <p className="part3-body-sub">
//             {selectedNode
//               ? `You selected "${selectedNode.label}".`
//               : "Pick an item from the tree on the left."}
//           </p>

    
//           <div className="accordion">
//             {categories.length === 0 && (
//               <div className="accordion-item">
//                 <div className="accordion-content">
//                   <p>No categories for this node.</p>
//                 </div>
//               </div>
//             )}

//             {categories.map((cat) => (
//               <div key={cat.id} className="accordion-item">
//                 <button
//                   className="accordion-header"
//                   onClick={() => toggleCategory(cat.id)}
//                   aria-expanded={openCategory === cat.id}
//                   aria-controls={`panel-${cat.id}`}
//                   id={`header-${cat.id}`}
//                 >
//                   {cat.title}
//                   <span
//                     className={`chevron ${
//                       openCategory === cat.id ? "open" : ""
//                     }`}
//                   >
//                     ►
//                   </span>
//                 </button>

//                 {openCategory === cat.id && (
//                   <div
//                     id={`panel-${cat.id}`}
//                     role="region"
//                     aria-labelledby={`header-${cat.id}`}
//                     className="accordion-content"
//                   >
//                     <p>{cat.body}</p>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </main>
//       </div>

//       <footer className="part4-footer">Footer</footer>
//     </div>
//   );
// }
