import { Port } from "../ir1/ports/port";

export function makeNode(id: string, name: string, location: string, inPorts: Port[],
                         outPorts: Port[], props: Map<string, string>, subGraph: string = ""): string {
  const genFunction = (prefix: string, ports: Port[]) => {
    return (ports.map(
       (p) => "<port name=\"" + prefix + String(p.index) + "\" type=\"" + p.type.string() + "\" />").join(""));
  };

  return `<node id="${id}">
            <data key="type">${name}</data>
            <data key="location">${location}</data>` +
         Array.from(props, ([key, value]) => `<data key="${key}">${value}</data>`).join("\n") +
         genFunction("in", inPorts) +
         genFunction("out", outPorts) +
         subGraph +
         "</node>";
}

export function makeEdge(pFrom: Port, pTo: Port, parentId: string): string {
  const sPortId = ((pFrom.nodeId == parentId) ? "in" : "out") + String(pFrom.index);
  const tPortId = ((pTo.nodeId == parentId) ? "out" : "in") + String(pTo.index);
  return `<edge source="${pFrom.nodeId}" target="${pTo.nodeId}" sourceport="${sPortId}" ` +
         `targetport="${tPortId}">
          <data key="type">${pFrom.type.string()}</data>
         </edge>`;
}

export function makeDocument(contents: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <graphml xmlns="http://graphml.graphdrawing.org/xmlns"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns
          http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd">
    <key id="type" for="node" attr.name="nodetype" attr.type="string" />
    <key id="location" for="node" attr.name="location" attr.type="string" />
${contents}
</graphml>`;
}

export function makeGraph(id: string, contents: string): string {
  return `<graph id="${id}" edgedefault="directed">${contents}</graph>`;
}
