import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";

function App() {
  return (
    <>
      <Canvas shadows="soft" style={{ width: "100vw", height: "100vh" }}>
        <Scene />
      </Canvas>
    </>
  );
}

export default App;
