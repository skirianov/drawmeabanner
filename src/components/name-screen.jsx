import { useState } from "react";

export const NameScreen = () => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('name', JSON.stringify(name));
    window.location.reload();
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  })

  return (
    <div className="name-screen">
      <p className="title">ENTER YOUR NAME</p>
      <input type="text" className="name-input" value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={handleSubmit} className="submit">SUBMIT</button>
    </div>
  )
}