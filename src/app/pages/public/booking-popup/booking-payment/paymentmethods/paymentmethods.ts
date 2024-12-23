import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConst } from 'src/app/app.const';
import { OrgDetails } from 'src/app/models/org';
import { GroupDTO } from 'src/app/models/user';
import { BookingDTO, CartDTO, CartUtils } from 'src/app/utils/cart';
import { environment } from 'src/environments/environment';
import { loadStripe } from '@stripe/stripe-js';
import { BookingService } from 'src/app/services/booking.service';
import { PaymentMethodDTO, PaymentMethodList } from 'src/app/models/booking';
import { CommonService } from 'src/app/services/common.service';
import { CancelingDataComponent } from '../../includes/canceling-data/canceling-data';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-paymentmethods',
  templateUrl: './paymentmethods.html',
  styleUrls: ['./paymentmethods.css']
})
export class PaymentMethodsComponent implements OnInit, AfterViewInit {

  usState = this.appConst.usState;
  booking!: BookingDTO;
  org!: OrgDetails;
  cart!: CartDTO;
  masterCard: string = this.appConst.MASTERCARD;
  visaCard: string = this.appConst.VISACARD;
  discoverCard: string = this.appConst.DISCOVERCARD;
  jcbCard: string = this.appConst.JCBCARD;
  americanCard: string = this.appConst.AMERICANCARD;
  sameAsProfile = false;
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
  formError = '';
  showNewPayment = false;
  PaymentMethodData: any;
  PaymentMethod: PaymentMethodList[] = [];
  constructor(
    private appConst: AppConst,
    private CartService: CartUtils,
    private fb: FormBuilder,
    private http: HttpClient,
    private bookingService: BookingService,
    private commonService: CommonService,
    private dialog: MatDialog,
  ) {
    this.paymentForm = this.fb.group({
      cardholderName: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z\\s]*$')
      ]],
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
    this.getCards();
  }

  async ngAfterViewInit(): Promise<void> {
    // setTimeout(async () => {
    //   await this.initializeStripe();
    // }, 0);
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
    }).then((result: any) => {
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
    }).catch((error: any) => {
      console.error('Error creating payment method:', error);
      this.isLoading = false;
    });
  }

  createResource(data: PaymentMethodDTO) {
    this.bookingService.createPaymentMethod(data).subscribe(
      (response: any) => {
        this.isLoading = false;
        this.PaymentMethodData = response;
        this.getCards();
        this.clearNewPayment();
        console.log('Payment method created successfully:', this.PaymentMethodData);
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


    if (!this.CartService.isCartCheckOut) {
      this.session.address = this.session.address || {};
    }

    this.cardSelected = false;

    this.focused = true;
    this.commonService.cartDetails$.subscribe((data) => {
      if (data) {
        this.cart = data;
      }
    });
  }

  getCards(): void {
    this.isLoading = true;
    this.bookingService.getAllPaymentMethods().subscribe(
      (response: PaymentMethodList[]) => {
        console.log('API response:', response);
        this.isLoading = false;
        this.PaymentMethod = response;
        console.log('Payment methods fetched successfully:', this.PaymentMethod);
      },
      (error) => {
        this.isLoading = false;
        console.error('API error:', error);
        this.formError = 'Failed to get the payment methods. Please try again.';
      }
    );
  }


  addNewPayment() {
    this.showNewPayment = !this.showNewPayment;
    this.selectedCardIndex = 0;
    if (this.showNewPayment) {
      setTimeout(() => this.initializeStripe(), 0);
    }
  }

  clearNewPayment() {
    this.showNewPayment = !this.showNewPayment;
    this.paymentForm.reset();
  }

  selectPayment() {
    if (this.CartService.isCartCheckOut) {
      this.CartService.bookingCart.payment =this.selectedCardIndex;
      this.CartService.processBooking.payCart(this.CartService.bookingCart.payment);
    }
    else {
      this.CartService.bookingCart.payment =this.selectedCardIndex;
      this.CartService.processBooking.pay(this.CartService.booking.payment!);
    }
     this.cart.booking.IsStripe = true;
     this.cart.booking.IsRefundable = this.cart.space?.IsRefundable?true:false;
     this.cart.booking.payment = this.CartService.bookingCart.payment;
     this.commonService.storeCartDetails(this.cart);
    this.commonService.setBookingPageStatus(this.appConst.bookingVerify);

  }

  reverse(){
    this.commonService.setBookingPageStatus(this.appConst.bookingOption);
  }

  cancel(){
    this.dialog.open(CancelingDataComponent, {
      width: '320px',
      position :{top:'10px'},
    });
    this.commonService.clearCartDetails();
    this.commonService.callSearchApi(true);
    this.commonService.setBookingPageStatus(this.appConst.bookingInfo);
  }

  toggleSameAsProfile(): void {
    if (this.sameAsProfile) {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const profileData = JSON.parse(userData);
        const profileAddress = profileData?.address;
        if (profileAddress) {
          this.paymentForm.patchValue({
            address1: profileAddress.street1,
            address2: profileAddress.street2,
            city: profileAddress.city,
            state: profileAddress.state,
            zip: profileAddress.zip
          });
        }
      }
    } else {
      this.clearProfile();
    }
  }

  clearProfile() {
    this.sameAsProfile = !this.sameAsProfile;
    this.paymentForm.patchValue({
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: ''
    });
  }

}
