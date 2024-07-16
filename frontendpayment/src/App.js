import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import PaymentCheckout from './Pages/PaymentCheckout';
import Success from "./Pages/Success";

function AppCheckout() {
    return (
        <div className="AppCheckout">
            <Router>
                <Routes>
                    <Route path="/:userId" element={<PaymentCheckout/>}/>
                    <Route path='/Success' element={<Success/>}/>
                </Routes>
            </Router>
        </div>
    );
}

function App() {
    return (
        <div>
            <AppCheckout/>
        </div>
    )
}

export default App;
