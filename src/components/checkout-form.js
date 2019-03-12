import React from 'react'
import { CardElement, injectStripe } from 'react-stripe-elements'

class CheckoutForm extends React.Component {
	constructor(props) {
		super(props)
		this.handleSubmit = this.handleSubmit.bind(this)
	}
	handleSubmit = (event) => {
		event.preventDefault()
		this.props.stripe.createToken({amount: this.props.amount, name: this.props.cardholdersName})
		.then(({token}) => {
			alert('Received Stripe token. Id: '+token.id)
			console.log(token) // you'll know it's working when it's an object, not undefinfed
		})
	}
	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<div><input type="text" name="amount" id="amount" placeholder="How much would you like to pay?" /></div>
				<div><input type="text" name="cardholdersName" id="cardholdersName" placeholder="Cardholder's Name" /></div>
				<div>
					<label>
						<CardElement />
					</label>
				</div>
				<button>Submit Card Details to Stripe, and Retrieve Token</button>
			</form>
		)
	}
}

export default injectStripe(CheckoutForm)
