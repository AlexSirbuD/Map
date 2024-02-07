import { Status, Wrapper } from '@googlemaps/react-wrapper';
import './App.css';
import Poliline from './components/Polygon';

function App() {
  const render = (status: Status) => (<h1>{status}</h1>)
  return (
    <div className="App">
      <Wrapper apiKey={"AIzaSyDf1gQzAy1tuvMgC-nobebAIqUXIfHWHqU"} render={render}>
        <Poliline />
      </Wrapper>
    </div>
  );
}
export default App
