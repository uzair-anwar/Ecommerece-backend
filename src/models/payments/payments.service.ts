import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-08-01',
    });
  }

  async createCustomer(name: string, email: string) {
    return this.stripe.customers.create({
      name,
      email,
    });
  }

  async createAccount(data: any) {
    try {
      const result = await this.stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: data.number,
          exp_month: data.exp_month,
          exp_year: data.exp_year,
          cvc: data.cvc,
        },
      });

      return { status: 200, result };
    } catch (error) {
      return { status: 400, message: error };
    }
  }

  async charge(amount: number, paymentMethodId: string, stripeId: string) {
    return this.stripe.paymentIntents.create({
      amount,
      customer: stripeId,
      payment_method: paymentMethodId,
      currency: process.env.STRIPE_CURRENCY,
      confirm: true,
    });
  }
}
