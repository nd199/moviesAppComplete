import React from 'react';
import './PlanCard.css';

const PlanCard = ({plan, initiatePlan}) => {
    const {id, name, description, price, interval} = plan;

    const selectedPlanHandler = () => {
        initiatePlan(id);
    };

    return (
        <div className="pl-card">
            <h2>{id}. {name}</h2>
            <p>{description}</p>
            <div className="planActions">
                <span className="price">&#8377; {price} / {interval}</span>
                <button type="button" onClick={selectedPlanHandler}>Select Plan</button>
            </div>
        </div>
    );
}

export default PlanCard;
