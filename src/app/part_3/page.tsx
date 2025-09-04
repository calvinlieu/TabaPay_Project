"use client";
import React, { useState, useCallback, useMemo } from "react";
import "./part3.css";

type NodeId = string;
type TreeNode = { id: NodeId; label: string; children?: TreeNode[] };

type TreeProps = {
  root: TreeNode;
  expanded: Set<NodeId>;
  onToggle: (id: NodeId) => void;
  onSelect: (id: NodeId) => void;
  selectedId: NodeId | null;
};

const treeData: TreeNode = {
  id: "root",
  label: "Root",
  children: [
    {
      id: "parentA",
      label: "Parent A",
      children: [
        { id: "childA1", label: "Child A1" },
        {
          id: "childParentA2",
          label: "Child Parent A2",
          children: [
            { id: "childA21", label: "Child A21" },
            { id: "childA22", label: "Child A22" },
          ],
        },
      ],
    },
    {
      id: "parentB",
      label: "Parent B",
      children: [
        { id: "childB1", label: "Child B1" },
        { id: "childB2", label: "Child B2" },
        { id: "childParentB3", label: "Child Parent B3", children: [] },
      ],
    },
  ],
};

function findNodeAndParent(
  root: TreeNode,
  id: NodeId,
  parent: TreeNode | null = null
): { node: TreeNode | null; parent: TreeNode | null } {
  if (root.id === id) return { node: root, parent };
  for (const c of root.children ?? []) {
    const res = findNodeAndParent(c, id, root);
    if (res.node) return res;
  }
  return { node: null, parent: null };
}

function siblingIds(parent: TreeNode | null, root: TreeNode): NodeId[] {
  if (!parent) return [root.id];
  return (parent.children ?? []).map((c) => c.id);
}

function Tree({ root, expanded, onToggle, onSelect, selectedId }: TreeProps) {
  const render = (node: TreeNode): React.ReactNode => {
    const isParent = Object.prototype.hasOwnProperty.call(node, "children");
    const isOpen = expanded.has(node.id);
    const isSelected = selectedId === node.id;

    return (
      <div key={node.id}>
        <div className={`tree-row ${isSelected ? "selected" : ""}`}>
          {isParent ? (
            <button
              onClick={() => onToggle(node.id)}
              className="tree-button"
              aria-label={isOpen ? "Collapse" : "Expand"}
            >
              <span className={`tree-chevron ${isOpen ? "open" : ""}`}>►</span>
            </button>
          ) : (
            <span style={{ width: 18 }} />
          )}

          {isParent ? (
            <button
              className="tree-label as-button"
              onClick={() => onSelect(node.id)}
            >
              {node.label}
            </button>
          ) : (
            <>
              <span className="tree-bullet">◉</span>
              <button onClick={() => onSelect(node.id)} className="tree-leaf">
                {node.label}
              </button>
            </>
          )}
        </div>

        {isParent && isOpen && (
          <div className="tree-children">
            {node.children && node.children.length > 0 ? (
              node.children.map((c) => render(c))
            ) : (
              <div className="tree-empty">(No children under this parent)</div>
            )}
          </div>
        )}
      </div>
    );
  };

  return <div>{render(root)}</div>;
}

export default function Page() {
  const [expanded, setExpanded] = useState<Set<NodeId>>(new Set(["root"]));
  const [selectedId, setSelectedId] = useState<NodeId | null>("root");

  const onToggle = useCallback((id: NodeId) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      const { parent } = findNodeAndParent(treeData, id);
      for (const sib of siblingIds(parent, treeData)) {
        if (sib !== id) next.delete(sib);
      }
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const onSelect = useCallback((id: NodeId) => {
    setSelectedId(id);
  }, []);

  const selectedNode = useMemo(() => {
    if (!selectedId) return null;
    return findNodeAndParent(treeData, selectedId).node;
  }, [selectedId]);

  return (
  <div className="tree-container">
    <div className="tree-title">PART 3</div>

    <div className="part3-split">
      <aside className="part3-nav">
        <div className="part3-panel-title">Tree / Nav</div>
        <Tree
          root={treeData}
          expanded={expanded}
          onToggle={onToggle}
          onSelect={onSelect}  
          selectedId={selectedId}
        />
      </aside>

      
      <main className="part3-body">
        <div className="part3-panel-title">Body / Page</div>
        <h2 className="part3-body-heading">
          {selectedNode ? selectedNode.label : "Nothing selected"}
        </h2>
        <p className="part3-body-sub">
          {selectedNode
            ? `You selected "${selectedNode.label}".`
            : "Pick an item from the tree on the left."}
        </p>
      </main>
    </div>
  </div>
);

}
