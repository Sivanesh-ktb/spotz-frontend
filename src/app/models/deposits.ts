export interface Invoice  {
  invoices : any;
  totals : {
    afterTax?: number;
    hours?: number;
    grossSales?: number;
    discounts?: number;
    netSales?:number;
    insuranceFees?: number;
    totalSales?: number;
    userFees?: number;
    taxes?: number;
    transactionFees?: number;

  }
}










