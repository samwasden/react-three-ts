import "./App.css";
import { Canvas } from "@react-three/fiber";
import { FinalScene } from "./FinalScene";

function App() {
  return (
    <>
      <Canvas shadows="soft" style={{ width: "100vw", height: "100vh" }}>
        <FinalScene />
      </Canvas>
    </>
  );
}

export default App;
