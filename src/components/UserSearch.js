import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Input, Button } from 'antd';

export default function UserSearch() {
  const [searchInput, setSearchInput] = useState('');
  const { users } = useSelector((state) => state.board);

  return (
    <div>
      <Input
        placeholder="enter what you want to search"
        value={searchInput}
        onChange={(e) => {
          setSearchInput(e.target.value);
        }}
      ></Input>
      <Button
        type="primary"
        onClick={() => {
          console.log('CLICKED THIS BUTTON ');
        }}
      >
        search
      </Button>
    </div>
  );
}
