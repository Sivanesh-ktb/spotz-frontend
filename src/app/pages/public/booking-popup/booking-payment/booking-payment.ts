import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConst } from 'src/app/app.const';
import { OrgDetails } from 'src/app/models/org';
import { GroupDTO } from 'src/app/models/user';
import { BookingDTO, CartUtils } from 'src/app/utils/cart';
import { environment } from 'src/environments/environment';
import { loadStripe } from '@stripe/stripe-js';
import { BookingService } from 'src/app/services/booking.service';
import { PaymentMethodDTO, PaymentMethodList } from 'src/app/models/booking';

@Component({
  selector: 'app-booking-payment',
  templateUrl: './booking-payment.html',
  styleUrls: ['./booking-payment.css']
})
export class BookingPaymentComponent implements AfterViewInit, OnInit {

  usState = this.appConst.usState;
  booking!: BookingDTO;
  org!: OrgDetails;
  masterCard: string = this.appConst.MASTERCARD;
  visaCard: string = this.appConst.VISACARD;
  discoverCard: string = this.appConst.DISCOVERCARD;
  jcbCard: string = this.appConst.JCBCARD;
  americanCard: string = this.appConst.AMERICANCARD;
  selectedCardIndex!: number;
  group !: GroupDTO;
  session = { _id: '', email: "", groups: [], address: {} };
  cardSelected = false;
  focused = true;
  paymentForm!: FormGroup;
  stripe: any;
  elements: any;
  cardNumber: any;
  cardCvc: any;
  cardExpiry: any;
  isLoading = false;
  STRIPE_PUBLISHKEY = environment.STRIPE_PUBLISHKEY;
  user!: any;
  cancel!: (results: any, callback?: () => void) => Promise<void>;
  back!: () => void;
  formError = '';
  showNewPayment = false;
  PaymentMethodData: any;
  PaymentMethod : PaymentMethodList[] = [];
  constructor(
    private appConst: AppConst,
    private CartService: CartUtils,
    private fb: FormBuilder,
    private http: HttpClient,
    private bookingService: BookingService
  ) {
    this.paymentForm = this.fb.group({
      cardholderName: ['', Validators.required],
      companyName: [''],
      billingFirstName: ['', Validators.required],
      billingLastName: ['', Validators.required],
      billingCompany: [''],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
    });
  }

  async ngOnInit(): Promise<void> {
    this.init();
  }

  async ngAfterViewInit(): Promise<void> {
    if (this.showNewPayment) {
      await this.initializeStripe();
    }
  }

  async initializeStripe() {
    const stripeKey = this.STRIPE_PUBLISHKEY;
    this.stripe = await loadStripe(stripeKey);

    if (this.stripe) {
      const appearance = { theme: 'stripe' };
      this.elements = this.stripe.elements({ appearance });

      this.cardNumber = this.elements.create('cardNumber');
      this.cardCvc = this.elements.create('cardCvc');
      this.cardExpiry = this.elements.create('cardExpiry');

      this.cardNumber.mount('#card-number');
      this.cardCvc.mount('#card-cvc');
      this.cardExpiry.mount('#card-expiry');
    } else {
      console.error('Stripe failed to initialize.');
    }
  }

  handlePayment() {
    if (this.paymentForm.invalid) {
      console.log('Please fill in all required fields.');
      return;
    }

    this.isLoading = true;

    const formData = this.paymentForm.value;

    this.stripe.createPaymentMethod({
      type: 'card',
      card: this.cardNumber,
      billing_details: {
          name: formData.cardholderName,
          email: localStorage.getItem('email') || '',
          address: {
            line1: formData.address1,
            line2: formData.address2,
            city: formData.city,
            state: formData.state,
            postal_code: formData.zip,
          },
          phone: localStorage.getItem('phone') || '',
      }
    }) .then((result: any) => {
      if (result.error) {
        this.formError = result.error.message;
        this.isLoading = false;
      } else if (result.paymentMethod) {
        const paymentData: PaymentMethodDTO = {
          token: result.paymentMethod.id,
          customerId: localStorage.getItem('id') || '',
          billingDetails: {
            firstName: formData.billingFirstName,
            lastName: formData.billingLastName,
            address: {
              line1: formData.address1,
              line2: formData.address2,
              city: formData.city,
              state: formData.state,
              postalCode: formData.zip,
            },
          },
          email: localStorage.getItem('email') || '',
        };
        this.createResource(paymentData);
      }
    }).catch((error:any) => {
      console.error('Error creating payment method:', error);
      this.isLoading = false;
    });
  }

  createResource(data: PaymentMethodDTO) {
    this.bookingService.createPaymentMethod(data).subscribe(
      (response: any) => {
        this.isLoading = false;
        if (response.status === 200) {
          this.PaymentMethodData = response.body;
          console.log('Payment method created successfully:', this.PaymentMethodData);
        } else {
          this.formError = 'Error creating payment method. Please try again.';
        }
      },
      (error) => {
        this.isLoading = false;
        console.error('API error:', error);
        this.formError = 'Failed to process payment. Please try again.';
      }
    );
  }

  init() {
    this.booking = this.CartService.booking;
    this.org = this.CartService.org;
    this.group = this.CartService.isCartCheckOut ? {} : this.CartService.group;
    this.user = this.CartService.user;
    this.session = (this.CartService.impersonate) ? this.CartService.user : this.CartService.session;

    this.cancel = this.CartService.processBooking.cancel;
    this.back = this.CartService.processBooking.back;

    if (!this.CartService.isCartCheckOut) {
      this.session.address = this.session.address || {};
    }

    this.cardSelected = false;

    this.focused = true;

  }

  addNewPayment(){
    this.showNewPayment = !this.showNewPayment;
  }

  clearNewPayment(){
    this.showNewPayment = !this.showNewPayment;
    this.paymentForm.reset();
  }
}
