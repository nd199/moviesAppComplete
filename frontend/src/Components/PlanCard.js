import React from 'react';
import './PlanCard.css';

const PlanCard = ({plan, isSelected, initiatePlan, deselectPlan}) => {
    const {id, name, description, price, interval} = plan;

    const selectedPlanHandler = () => {
        initiatePlan(id);
    };

    return (
        <div className={`pl-card ${isSelected ? 'selected' : ''}`}>
            <h2>{id}. {name}</h2>
            <p>{description}</p>
            <div className="planActions">
                <span className="price">&#8377; {price} / {interval}</span>
                {!isSelected ? (
                    <button type="button" onClick={selectedPlanHandler}>Select Plan</button>
                ) : (
                    <button type="button" onClick={deselectPlan}>Deselect Plan</button>
                )}
            </div>
        </div>
    );
}

export default PlanCard;
