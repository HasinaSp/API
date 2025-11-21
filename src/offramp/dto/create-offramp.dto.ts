export class CreateOffRampDto {
  amount: string;

  destination: {
    iban: string;

    billingDetails: {
      name: string;
      city: string;
      country: string;
      line1: string;
      line2?: string;
      district?: string;
      postalCode?: string;
    };

    bankAddress: {
      bankName: string;
      city: string;
      country: string;
      line1?: string;
      line2?: string;
      district?: string;
    };
  };
}
