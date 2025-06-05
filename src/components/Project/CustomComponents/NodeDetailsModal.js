import { Modal, Input, Button, Tag, Select } from 'antd';
import { useState } from 'react';

const statusOptions = ['NOT_STARTED', 'IN_PROGRESS', 'BLOCKED', 'DONE'];

export default function NodeDetailsModa({ visible, onClose, nodeData, onUpdate }) {
  const [node, setNode] = useState(nodeData);

  const handleTaskChange = (index, key, value) => {
    const updatedTasks = [...node.tasks];
    updatedTasks[index][key] = value;
    setNode({ ...node, tasks: updatedTasks });
  };

  const addTask = () => {
    setNode({
      ...node,
      tasks: [...node.tasks, { id: Date.now(), title: '', status: 'NOT_STARTED' }],
    });
  };

  const handleSave = () => {
    onUpdate(node); // Dispatch to Redux or state
    onClose();
  };

  return (
    <Modal open={visible} onCancel={onClose} onOk={handleSave} title="Node Details">
      <Input
        value={node.heading}
        onChange={(e) => setNode({ ...node, heading: e.target.value })}
        placeholder="Heading"
        style={{ marginBottom: 10 }}
      />
      <Input.TextArea
        value={node.description}
        onChange={(e) => setNode({ ...node, description: e.target.value })}
        placeholder="Description"
        autoSize
        style={{ marginBottom: 20 }}
      />
      <Button onClick={addTask} type="dashed" block style={{ marginBottom: 10 }}>
        + Add Task
      </Button>
      {/* {node.tasks.map((task, i) => (
        <div key={task.id} style={{ display: 'flex', marginBottom: 8, gap: 8 }}>
          <Input
            value={task.title}
            onChange={(e) => handleTaskChange(i, 'title', e.target.value)}
            placeholder="Task Title"
          />
          <Select
            value={task.status}
            onChange={(value) => handleTaskChange(i, 'status', value)}
            options={statusOptions.map((s) => ({ label: s, value: s }))}
            style={{ width: 120 }}
          />
        </div>
      ))} */}
    </Modal>
  );
}
