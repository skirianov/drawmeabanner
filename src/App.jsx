import './App.css'
import { Board } from './components/board'
import { NameScreen } from './components/name-screen';

const name = JSON.parse(localStorage.getItem('name'));

console.log(localStorage)

function App() {
  return (
    <div className="App">
      {name ? <Board name={name} /> : <NameScreen />}
    </div>
  )
}

export default App
