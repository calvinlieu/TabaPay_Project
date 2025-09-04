"use client";
import React, { useState, useCallback } from "react";
import "./part1.css";

type NodeId = string;
type TreeNode = { id: NodeId; label: string; children?: TreeNode[] };

type TreeProps = {
  root: TreeNode;
  expanded: Set<NodeId>;
  onToggle: (id: NodeId) => void;
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

function Tree({ root, expanded, onToggle }: TreeProps) {
  const render = (node: TreeNode): React.ReactNode => {
    const isParent = "children" in node;
    const isOpen = expanded.has(node.id);

    return (
      <div key={node.id}>
        <div className="tree-row">
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
              <span className="tree-leaf">{node.label}</span>
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

  const onToggle = useCallback((id: NodeId) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      const { parent } = findNodeAndParent(treeData, id);
      for (const sib of siblingIds(parent, treeData)) {
        if (sib !== id) next.delete(sib);
      }
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id)
      }
      return next;
    });
  }, []);

  return (
    <div className="tree-container">
      <div className="tree-title">PART 1</div>
      <Tree root={treeData} expanded={expanded} onToggle={onToggle} />
    </div>
  );
}
