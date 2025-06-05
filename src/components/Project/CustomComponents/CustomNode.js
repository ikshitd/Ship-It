import { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Input, Tag, Dropdown, Menu } from 'antd';

const handleStyle = { left: 10 };

export default function TextUpdaterNode({ data }) {
  const [input, setInput] = useState(data);

  const priorityColors = {
    High: '#ed3e3e',
    Medium: '#f7cb2d',
    Low: '#57bd5c',
  };

  const statusColors = {
    NOT_STARTED: '#d9d9d9',
    IN_PROGRESS: '#1890ff',
    BLOCKED: '#fa541c',
    DONE: '#52c41a',
  };

  return (
    <div
      onClick={data.onClick}
      style={{
        padding: '10px',
        height: '100%',
        width: '100%',
        maxWidth: '200px',
        backgroundColor: data.highlighted ? '#fff1f0' : 'rgb(204, 220, 255)',
        border: data.highlighted ? '3px solid #ff4d4f' : '1px solid #ccc',
        color: 'black',
        display: 'grid',
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div>
        <section style={{ textAlign: 'center' }}>
          <p>
            <strong>{input.heading}</strong>
          </p>
        </section>

        <section style={{ marginTop: '10px', marginBottom: '10px', textAlign: 'center' }}>
          <Tag
            style={{
              fontSize: '13px',
              justifyContent: 'center',
              textAlign: 'center',
              height: '25px',
              width: '63px',
              cursor: 'pointer',
            }}
            color={priorityColors[input.priority]}
          >
            <div style={{ marginTop: '1px' }}>{input.priority}</div>
          </Tag>
        </section>

        <section style={{ textAlign: 'center' }}>
          <p>{input.description}</p>
        </section>
        <section style={{ maxHeight: '120px', overflowY: 'auto', marginTop: '10px' }}>
          {input.tasks && input.tasks.length > 0 ? (
            input.tasks.map((task) => (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '4px 6px',
                  margin: '4px 0',
                  background: '#fff',
                  borderRadius: '4px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  fontSize: '12px',
                }}
              >
                <span>{task.title}</span>
                <Tag color={statusColors[task.status]} style={{ marginLeft: '8px' }}>
                  {task.status}
                </Tag>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', fontSize: '12px', color: '#999' }}>No tasks</div>
          )}
        </section>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle type="source" position={Position.Bottom} id="b" style={handleStyle} />
    </div>
  );
}
