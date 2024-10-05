import Dashboard from './components/Dashboard';
import { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [data, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch('data.json')
      .then(res => res.json())
      .then(setData)
      .finally(() => setIsLoaded(true));
  }, []);

  if (!isLoaded) return;

  return (
    <main className="container">
      <ul className="flex">
        <li className="w-full">
          <Dashboard header="Resources" data={data} />
        </li>
      </ul>
    </main>
  );
};

export default App;
