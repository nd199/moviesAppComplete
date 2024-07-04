import React, {useState} from 'react';
import PlanCard from '../Components/PlanCard';
import './Subscription.css';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';

const Subscription = () => {
    const [selectedPlan, setSelectedPlan] = useState(null);

    const handlePlanSelect = (planId) => {
        const selected = plans.find(plan => plan.id === planId);
        setSelectedPlan(selected);
    };

    const plans = [
        {id: 1, name: 'Monthly Plan', price: 300, interval: 'month', description: 'Access to all content for a month.'},
        {
            id: 2,
            name: '6-Month Plan',
            price: 50,
            interval: '6 months',
            description: 'Access to all content for 6 months.'
        },
        {id: 3, name: 'Yearly Plan', price: 1200, interval: 'year', description: 'Save 20% with annual billing.'},
    ];

    return (
        <>
            <NavBar/>
            <div className="subscribe-page">
                <div className="subscribe-form">
                    <h2>Choose a Plan</h2>
                    <div className="sub-body">
                        {plans.map(plan => (
                            <PlanCard key={plan.id} plan={plan} initiatePlan={handlePlanSelect}/>
                        ))}
                    </div>
                    <button className="subscribePlan">Subscribe</button>
                </div>
            </div>
            <Footer/>
        </>
    );
}

export default Subscription;
