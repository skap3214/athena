export const filteredGraph = (graph: { nodes: any[]; links: any[] }) => {
  const uniqueNodes = new Map();
  const uniqueLinks = new Map();

  graph.nodes.forEach((node) => {
    if (!uniqueNodes.has(node.id)) {
      uniqueNodes.set(node.id, node);
    }
  });

  graph.links.forEach((link) => {
    const linkKey = `${link.source}-${link.target}-${link.content}`;
    if (!uniqueLinks.has(linkKey)) {
      uniqueLinks.set(linkKey, link);
    }
  });

  return {
    nodes: Array.from(uniqueNodes.values()),
    links: Array.from(uniqueLinks.values()),
  };
};
