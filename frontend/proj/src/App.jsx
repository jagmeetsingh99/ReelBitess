import React from "react";
import AppRoutes from "./routes/AppRoutes";

import "./App.css";

function App() {
  
  return (
    console.log("App rendered"),
    <>
   <div className="app-wrapper">

      <AppRoutes />
   </div>
    </>
  );
}

export default App;
