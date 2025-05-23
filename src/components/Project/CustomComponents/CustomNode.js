import { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Input, Tag, Dropdown, Menu } from 'antd';

const handleStyle = { left: 10 };

export default function TextUpdaterNode({ data }) {
  const [input, setInput] = useState(data);
  const [isLabelEditing, setIsLabelEditing] = useState(false);
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);

  const handleInputChange = (field, value) => {
    setInput({ ...input, [field]: value });
  };

  const handlePriorityChange = (value) => {
    handleInputChange('priority', value);
  };

  const priorityOptions = ['High', 'Medium', 'Low'];
  const priorityColors = {
    High: '#ed3e3e',
    Medium: '#f7cb2d',
    Low: '#57bd5c',
  };

  const menu = (
    <Menu
      onClick={({ key }) => handlePriorityChange(key)}
      items={priorityOptions.map((priority) => ({
        key: priority,
        label: priority,
      }))}
    />
  );

  return (
    <div
      style={{
        padding: '10px',
        height: '100%',
        width: '100%',
        maxWidth: '200px',
        // backgroundColor: 'rgb(204, 220, 255)',
        // FOR THE HIGHLIGHTED NODE. IF THIS DOESN'T WORK, THEN REMOVE THIS.
        backgroundColor: data.highlighted ? '#fff1f0' : 'rgb(204, 220, 255)',
        border: data.highlighted ? '3px solid #ff4d4f' : '1px solid #ccc',
        color: 'black',
        display: 'grid',
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div>
        <section style={{ textAlign: 'center' }}>
          {isLabelEditing ? (
            <Input.TextArea
              value={input.heading}
              onChange={(e) => {
                handleInputChange('heading', e.target.value);
              }}
              style={{ backgroundColor: 'rgb(30, 30, 30)', color: 'white' }}
              onBlur={() => setIsLabelEditing(false)}
              autoFocus
            />
          ) : (
            <p onClick={() => setIsLabelEditing(true)}>
              <strong>{input.heading}</strong>
            </p>
          )}
        </section>

        <section style={{ marginTop: '10px', marginBottom: '10px', textAlign: 'center' }}>
          <Dropdown overlay={menu} trigger={['click']}>
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
          </Dropdown>
        </section>

        <section style={{ textAlign: 'center' }}>
          {isDescriptionEditing ? (
            <Input.TextArea
              value={input.description}
              onChange={(e) => {
                handleInputChange('description', e.target.value);
              }}
              style={{ backgroundColor: 'rgb(30, 30, 30)', color: 'white' }}
              onBlur={() => setIsDescriptionEditing(false)}
              autoFocus
            />
          ) : (
            <p onClick={() => setIsDescriptionEditing(true)}>{input.description}</p>
          )}
        </section>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle type="source" position={Position.Bottom} id="b" style={handleStyle} />
    </div>
  );
}
