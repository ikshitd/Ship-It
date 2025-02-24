import { Button, Select, Input, Drawer, DatePicker } from 'antd';
import dayjs from 'dayjs';

export default function TaskDetails({
  heading,
  isDrawerVisible,
  setDrawerVisible,
  isEditing,
  updatedTaskDetails,
  setIsEditing,
  handleInputChange,
  handleSubmit,
}) {
  const { Option } = Select;
  return (
    <Drawer
      value={isDrawerVisible}
      title={<h2 style={{ fontWeight: 'bold', margin: 0 }}>{heading}</h2>}
      placement="right"
      onClose={() => {
        setDrawerVisible(false);
      }}
      closable={true}
      open={isDrawerVisible}
      width="50%"
      motion={{
        motionAppear: true,
      }}
    >
      <form>
        <div style={{ padding: '16px', fontFamily: 'Monaco, sans-serif' }}>
          <section style={{ marginBottom: '24px', textAlign: 'center' }}>
            {isEditing ? (
              <Input
                value={updatedTaskDetails.heading}
                onChange={(e) => {
                  handleInputChange('heading', e.target.value);
                }}
                onBlur={() => setIsEditing(false)}
                autoFocus
              />
            ) : (
              <h3 onClick={() => setIsEditing(true)}>{updatedTaskDetails.heading}</h3>
            )}
          </section>
          <section style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '16px', color: '#4a4a4a', textAlign: 'left' }}>Task Dates</h3>
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
              <label htmlFor="startDate" style={{ marginRight: '10px' }}>
                Start Date:
              </label>
              <DatePicker
                id="startDate"
                value={updatedTaskDetails.startDate ? dayjs(updatedTaskDetails.startDate) : null}
                onChange={(date) => handleInputChange('startDate', date ? date.toISOString() : null)}
                format="YYYY-MM-DD"
              />
            </div>
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
              <label htmlFor="endDate" style={{ marginRight: '10px' }}>
                End Date:
              </label>
              <DatePicker
                id="endDate"
                value={updatedTaskDetails.dueDate ? dayjs(updatedTaskDetails.dueDate) : null}
                onChange={(date) => handleInputChange('dueDate', date ? date.toISOString() : null)}
                format="YYYY-MM-DD"
              />
            </div>
          </section>
          <section style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '16px', color: '#4a4a4a', textAlign: 'left' }}>Priority</h3>
            <Select
              value={updatedTaskDetails.priority}
              onChange={(value) => handleInputChange('priority', value)}
              style={{ width: '100%' }}
            >
              <Option value="Low">Low</Option>
              <Option value="Medium">Medium</Option>
              <Option value="High">High</Option>
            </Select>
          </section>
          <section style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '16px', color: '#4a4a4a', textAlign: 'left' }}>Status</h3>
            <Select
              value={updatedTaskDetails.status.replace('_', ' ')}
              onChange={(value) => handleInputChange('status', value.replace(/\s+/g, '_'))}
              style={{ width: '100%' }}
            >
              <Option value="On Track">On Track</Option>
              <Option value="At Risk">At Risk</Option>
              <Option value="Off Risk">Off Risk</Option>
            </Select>
          </section>
          <section style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '16px', color: '#4a4a4a', textAlign: 'left' }}>Task Description</h3>
            <textarea
              value={updatedTaskDetails.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter task description..."
              style={{
                width: '100%',
                height: '120px',
                padding: '12px',
                fontSize: '14px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                outline: 'none',
                backgroundColor: '#f9f9f9',
                resize: 'none',
              }}
            />
          </section>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button type="primary" onClick={handleSubmit} style={{ width: '50%' }}>
              Add-Task
            </Button>
          </div>
        </div>
      </form>
    </Drawer>
  );
}
