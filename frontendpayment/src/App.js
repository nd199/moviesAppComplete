import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import PaymentCheckout from "./Pages/PaymentCheckout";
import Success from "./Pages/Success";

function AppCheckout() {
  return (
    <div className="AppCheckout">
      <Router>
        <Routes>
          <Route path="/:userId" element={<PaymentCheckout />} />
          <Route path="/Success" element={<Success />} />
        </Routes>
      </Router>
    </div>
  );
}

function App() {
  return (
    <div>
      <AppCheckout />
    </div>
  );
}

export default App;
