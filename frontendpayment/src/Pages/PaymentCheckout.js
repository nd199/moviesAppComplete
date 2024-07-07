import './PaymentCheckout.css';


const PaymentCheckout = () => {



    return (
        <div className="payment-checkout-container">
            <div className="payment-checkout-card">
                <div className="payment-checkout-card__header">
                    <div className="payment-checkout-card__title">
                        Checkout
                    </div>
                    <div className="payment-checkout-card__description">
                        Please Check your details below before checkout
                    </div>
                </div>
                <div className="payment-checkout-card__content__wrapper">
                    <div className="payment-checkout-card__content__left">
                        <div className="payment-checkout-card__content__left_top">
                            <div className="payment-checkout-card__content__left_top_heading">
                                <p>Top</p>
                            </div>
                            <div className="payment-checkout-card__content__left_top_content">
                                <p>leftTop</p>
                            </div>
                        </div>
                        <div className="payment-checkout-card__content__left_bottom">
                            <div className="payment-checkout-card__content__left_bottom_heading">
                                <p>bottom</p>
                            </div>
                            <div className="payment-checkout-card__content__left_bottom_content">
                                <p>leftBottom</p>
                            </div>
                        </div>
                    </div>
                    <hr/>
                    <div className="payment-checkout-card__content__right">
                        <div className="payment-checkout-card__content__left_top"></div>
                        <div className="payment-checkout-card__content__left_bottom"></div>
                    </div>
                </div>
            </div>
        </div>
    )
        ;
}
export default PaymentCheckout;