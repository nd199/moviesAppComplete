import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import PaymentCheckout from './Pages/PaymentCheckout';

function AppCheckout() {
    return (
        <div className="AppCheckout">
            <Router>
                <Routes>
                    <Route path="/:userId" element={<PaymentCheckout/>}/>
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
