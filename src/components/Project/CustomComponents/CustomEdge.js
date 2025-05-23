import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getBezierPath, BaseEdge } from '@xyflow/react';
import { updateEdge } from '../../../redux/slices/canvasSlice.js';

const foreignObjectSize = 100;

export default function CustomEdge({ id, sourceX, sourceY, targetX, targetY, label, data }) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const centerX = (sourceX + targetX) / 2 - foreignObjectSize / 2;
  const centerY = (sourceY + targetY) / 2 - foreignObjectSize / 2;

  return (
    <>
      <BaseEdge path={edgePath} style={{ stroke: 'black' }} />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={centerX}
        y={centerY}
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          {editing ? (
            <input
              ref={inputRef}
              value={label}
              onChange={(e) => {
                // dispatch(updateEdge({ ...edge }));
              }}
              onBlur={() => setEditing(false)}
              style={{
                fontSize: '12px',
                border: '1px solid gray',
                borderRadius: '4px',
                padding: '2px 4px',
                width: '80px',
              }}
            />
          ) : (
            <div
              onDoubleClick={() => setEditing(true)}
              style={{
                fontSize: '12px',
                background: 'white',
                padding: '2px 4px',
                borderRadius: '4px',
                border: '1px solid lightgray',
                cursor: 'pointer',
              }}
            >
              {label || 'Edit me'}
            </div>
          )}
        </div>
      </foreignObject>
    </>
  );
}
