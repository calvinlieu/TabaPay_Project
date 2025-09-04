"use client";
import React, { useState, useCallback } from "react";
import "./part2.css"


type NodeId = string;
type TreeNode = { id: NodeId; label: string; children?: TreeNode[] };

type TreeProps = {
  root: TreeNode;
  expanded: Set<NodeId>;
  onToggle: (id: NodeId) => void;
  onClickLeaf: (id: NodeId) => void;
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


function findNodeAndParent(root: TreeNode, id: NodeId, parent: TreeNode | null = null) {
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


function Tree({ root, expanded, onToggle, onClickLeaf, selectedId }: TreeProps) {
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
            <span className="tree-label">{node.label}</span>
          ) : (
            <>
              <span className="tree-bullet">◉</span>
              <button onClick={() => onClickLeaf(node.id)} className="tree-leaf">
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
  const [selectedId, setSelectedId] = useState<NodeId | null>(null);

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

  const onClickLeaf = useCallback((id: NodeId) => {
    setSelectedId(id);
    const { node } = findNodeAndParent(treeData, id);
    alert(`You clicked: ${node.label}`);
  }, []);

  return (
    <div className="tree-container">
      <div className="tree-title">PART 2</div>
      <Tree
        root={treeData}
        expanded={expanded}
        onToggle={onToggle}
        onClickLeaf={onClickLeaf}
        selectedId={selectedId}
      />
    </div>
  );
}
