import { Routes, Route } from "react-router-dom";
import MainPage from "@/popUpPage/pages/MainPage";
import SettingPage from "@/popUpPage/pages/SettingPage";

function App() {
  return (
    <>
      <div className="absolute -z-50 h-[400px] w-[350px] bg-gray-300"></div>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/setting" element={<SettingPage />} />
      </Routes>
    </>
  );
}

export default App;
