import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useReactFlow,
  ReactFlow,
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from './CustomComponents/CustomNode.js';
import Sider from 'antd/es/layout/Sider.js';
import { Button } from 'antd';
import { SaveOutlined, PlusCircleOutlined } from '@ant-design/icons';
import CustomEdge from './CustomComponents/CustomEdge.js';
import { addNode, addEdge as addEDGE } from '../../redux/slices/canvasSlice.js';

const nodeTypes = {
  customNode: CustomNode,
};

const edgeTypes = {
  customEdge: CustomEdge,
};

/*
node: {
    id: '1',
    data: { heading: 'User logs in', description: 'As a user, I want to log in securely.', priority: 'Low' },
    position: { x: 10, y: 10 },
    type: 'customNode',
  },
edge: {
    id: '1.2.3.4.',
    source: '1',
    target: '2',
    animated: true,
    label: 'edge label',
    style: { stroke: 'black' },
    type: 'customEdge',
    markerEnd: {
      type: 'arrowclosed',
      color: 'black',
    },
  },
}
*/

export default function Project() {
  const dispatch = useDispatch();
  const { selectedProjectCanvas } = useSelector((state) => state.canvas);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [nodeCounter, setNodeCounter] = useState(0);
  // const { setCenter } = useReactFlow();

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback(
    (params) => {
      if (selectedProjectCanvas) {
        setEdges((eds) => addEdge(params, eds || []));
        const edgeDetails = {
          source: params.source,
          target: params.target,
          animated: true,
          label: 'New Connection',
          type: 'customEdge',
          projectCanvasId: selectedProjectCanvas.id,
        };
        // adding the edge to the database.
        dispatch(addEDGE(edgeDetails));
      } else {
        throw new Error('THERE IS NO SELECTED PROJECT CANVAS');
      }
    },
    [selectedProjectCanvas]
  );

  useEffect(() => {
    if (selectedProjectCanvas) {
      setNodeCounter(selectedProjectCanvas.nodes.length);
      const propagatedNodes = (selectedProjectCanvas.nodes || []).map((node) => ({
        id: `${node.id}`,
        type: node.type,
        position: { x: node.x, y: node.y },
        data: {
          heading: node.heading,
          description: node.description,
          priority: node.priority,
        },
      }));
      setNodes(propagatedNodes || []);
      setEdges(selectedProjectCanvas.edges || []);
    }
  }, [selectedProjectCanvas]);

  const handleAddNode = () => {
    dispatch(
      addNode({
        heading: 'Rufus',
        description: 'Rufus',
        priority: 'Low',
        x: 200 + nodeCounter * 100,
        y: 200 + nodeCounter * 100,
        type: 'customNode',
        projectCanvasId: selectedProjectCanvas.id,
      })
    );
  };

  const hightLightAndFocus = (nodeId) => {
    const targetNode = nodes.find((n) => n.id === nodeId);
    if (!targetNode) {
      throw new Error('NODE TO BE HIGHLIGHTED IS NOT FOUND!!');
    }
    // NEED TO FIGURE THIS OUT, HOW TO MAKE THIS WORK....
    // setCenter(targetNode.position.x, targetNode.position.y, {
    //   zoom: 1.5,
    //   duration: 800,
    // });
  };

  return (
    <Sider width="50%" style={{ height: '100%', position: 'relative' }}>
      {!selectedProjectCanvas ? (
        <div style={{ height: '100%', backgroundColor: 'whitesmoke' }}>
          {' '}
          the project-canvas would appear here{' '}
        </div>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView={false}
          style={{ width: '100%', height: '100%' }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '40px',
              backgroundColor: 'whitesmoke',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 12px',
            }}
          >
            <span style={{ color: 'black' }}>
              <span>
                {' '}
                <button> click here </button>{' '}
              </span>
              <strong>{selectedProjectCanvas.name}</strong>
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Button onClick={handleAddNode} size="small">
                <PlusCircleOutlined />
              </Button>
              <Button
                onClick={() => {
                  console.log('REMOVE THIS LATER AND WRITE THE LOGIC TO STORE THINGS IN THE DB.');
                }}
                size="small"
              >
                <SaveOutlined />
              </Button>
              <Controls
                showInteractive={false}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  position: 'relative',
                  gap: '4px',
                }}
              />
            </div>
          </div>

          <Background style={{ backgroundColor: 'white' }} />
        </ReactFlow>
      )}
    </Sider>
  );
}
