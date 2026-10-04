import {
  Background,
  type Edge,
  MarkerType,
  type Node,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';
import { useEffect, useMemo } from 'react';
import '@xyflow/react/dist/style.css';
import type { TEdges, TProcess } from '@flowviewer/shared';
import { useTheme } from '@/shared/ui/theme-provider.tsx';
import { ProcessNode, type TProcessNode } from './process-node.tsx';
import { getLayoutElements } from '../../lib/utils.ts';
import { useUnit } from 'effector-react';
import { $processSelectedId } from '@/entities/processes';

const nodeTypes = {
  process: ProcessNode,
};

interface FlowProps {
  nodesNF: TProcess[];
  edgesNF: TEdges;
}

export const Flow = ({ nodesNF, edgesNF }: FlowProps) => {
  const theme = useTheme();
  const [processSelectedId] = useUnit([$processSelectedId]);

  const { getNodes, setCenter, fitView } = useReactFlow();

  useEffect(() => {
    if (!processSelectedId) {
      fitView();
      return;
    }

    const node = getNodes().find(node => node.data.id === processSelectedId);
    if (!node) {
      fitView();
      return;
    }

    const nodeWidth = node.measured?.width ?? 100;
    const nodeHeight = node.measured?.height ?? 50;
    const centerX = node.position.x + nodeWidth / 2;
    const centerY = node.position.y + nodeHeight / 2;

    setCenter(centerX, centerY, { zoom: 1.5, duration: 600, interpolate: 'smooth' });
  }, [getNodes, processSelectedId, setCenter, nodesNF, edgesNF]);

  const initialNodes: Node[] = useMemo(() => {
    const nodes =
      nodesNF?.length > 0
        ? nodesNF.map((v, index) => ({
            id: String(v.vertexId),
            type: 'process',
            data: {
              id: v.id,
              label: v.label,
              type: v.type,
              status: v.status,
              selected: v.id === processSelectedId,
            } as TProcessNode,
            position: { x: index * 200, y: 0 },
            targetPosition: Position.Left,
            sourcePosition: Position.Right,
          }))
        : [];

    edgesNF.edges.map((edge, index) => {
      if (edge.fromId === null) {
        nodes.push({
          id: `in-${index}`,
          type: 'process',
          data: {
            label: 'input',
            hideFrom: true,
          } as TProcessNode,
          position: { x: -1 * 200, y: 0 },
          targetPosition: Position.Left,
          sourcePosition: Position.Right,
        });
      }

      if (edge.toId === null) {
        nodes.push({
          id: `out-${index}`,
          type: 'process',
          data: {
            label: 'output',
            hideTo: true,
          } as TProcessNode,
          position: { x: -1 * 200, y: 0 },
          targetPosition: Position.Left,
          sourcePosition: Position.Right,
        });
      }
    });

    return nodes;
  }, [nodesNF, processSelectedId, edgesNF]);

  const initialEdges: Edge[] = useMemo(
    () =>
      edgesNF?.edges
        ? edgesNF.edges.map((e, i) => ({
            id: e.id
              ? String(e.id)
              : `e-${e?.fromId && isNaN(e.fromId) ? e.fromId : `in-${i}`}-${e?.toId && !isNaN(e.toId) ? e.toId : `out-${i}`}-${i}`,
            source: e.fromId || e.fromId === 0 ? String(e.fromId) : `in-${i}`,
            target: e.toId || e.toId === 0 ? String(e.toId) : `out-${i}`,
            animated: true,
            label: e.label && String(e.label),
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 16,
              height: 16,
              color: '#555',
            },
          }))
        : [],
    [edgesNF]
  );

  const layoutElements = useMemo(
    () => getLayoutElements(initialNodes, initialEdges, 'LR'),
    [initialNodes, initialEdges]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutElements.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutElements.edges);

  useEffect(() => {
    const newLayout = getLayoutElements(initialNodes, initialEdges, 'LR');

    setNodes(newLayout.nodes);
    setEdges(newLayout.edges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  return (
    <>
      <div className={'w-[100%] h-[100%] text-black'}>
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          edges={edges}
          onEdgesChange={onEdgesChange}
          colorMode={theme.theme}

          nodesConnectable={false}
          deleteKeyCode={null}
          connectOnClick={false}
        >
          <Background />
        </ReactFlow>
      </div>
    </>
  );
};
