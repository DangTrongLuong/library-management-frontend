import React, { useState, useEffect } from 'react';
import axios from 'axios';
'../data/exampleBorrowings';

function BorrowingSearch() {
  const [readerCode, setReaderCode] = useState('');
  const [bookCode, setBookCode] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const response = await axios.get('/api/borrowings/search', {
      params: { readerCode, bookCode, sortBy }
    });
    setResults(response.data);
  };

  useEffect(() => {
    handleSearch();
  }, [readerCode, bookCode, sortBy]);

  return (
    <div>
      <input
        type="text"
        placeholder="Nhập mã độc giả"
        value={readerCode}
        onChange={(e) => setReaderCode(e.target.value)}
      />
      <input
        type="text"
        placeholder="Nhập mã sách"
        value={bookCode}
        onChange={(e) => setBookCode(e.target.value)}
      />
      <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
        <option value="title">Sort by Title</option>
        <option value="readerCode">Sort by Reader Code</option>
      </select>
      <table>
        <thead>
          <tr>
            <th>Mã độc giả</th>
            <th>Mã sách</th>
            <th>Tiêu đề sách</th>
          </tr>
        </thead>
        <tbody>
          {results.map((item) => (
            <tr key={item.id}>
              <td>{item.readerCode}</td>
              <td>{item.bookCode}</td>
              <td>{item.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BorrowingSearch;