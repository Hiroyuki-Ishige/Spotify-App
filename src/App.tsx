import "./App.css";

function App() {
  console.log(import.meta.env.VITE_SPOTIFY_CLIENT_ID);
  console.log(import.meta.env.VITE_SPOTIFY_CLIENT_SECRET);
  console.log(import.meta.env.VITE_SPOTIFY_REDIRECT_URI);
  
  return (
    <div>
      <h1>Hello Ishige</h1>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Click Me
      </button>
    </div>
  );
}

export default App;
