import logo from "./logo.svg";
import "./App.css";
import Hero from "./Components/Hero";
import { PostList } from "./Components/PostLists";
function App() {
  return (
    <div className="App">
      <Hero />
      <PostList/>
    </div>
  );
}

export default App;
