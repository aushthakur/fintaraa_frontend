export type FieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'phone'
  | 'select'
  | 'date'
  | 'url'
  | 'textarea'
  | 'file'
  | 'checkbox'
  | 'multiSelect'
  | 'coApplicants';

export type FormField = {
  key: string;
  label: string;
  type: FieldType;
  pattern?: string;
  minValue?: number;
  maxValue?: number;
  infoNote?: string;
  minLength?: number;
  required?: boolean;
  maxLength?: number;
  multiline?: boolean;
  helperText?: string;
  placeholder?: string;
  verifyLabel?: string;
  patternError?: string;
  autoCorrect?: boolean;
  secureTextEntry?: boolean;
  options?: { label: string; value: string }[];
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?:
    | 'default'
    | 'numeric'
    | 'phone-pad'
    | 'number-pad'
    | 'decimal-pad'
    | 'email-address';
  showOnTabs?: string[];
  optionsByParent?: Record<string, { label: string; value: string }[]>;
  parentKey?: string;
  resetOnChangeKeys?: string[];
  showWhen?: {
    key: string;
    equals: string | number | boolean;
  };
};

export type FormStep = {
  key: string;
  title: string;
  subtitle?: string;
  fields: FormField[];
  description?: string;
};

export type FormFlow = {
  title: string;
  steps: FormStep[];
  subtitle?: string;
  description?: string;
  submitLabel?: string;
  tabs?: { key: string; label: string; info?: string }[];
  tabFieldKey?: string;
};

const propertyCategoryOptions = [
  { label: 'Residential', value: 'residential' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Industrial', value: 'industrial' },
  { label: 'Agricultural', value: 'agricultural' },
  { label: 'Mixed Use', value: 'mixed_use' },
  { label: 'Hospitality', value: 'hospitality' },
  { label: 'Institutional', value: 'institutional' },
  { label: 'Land / Plot', value: 'land_plot' },
];

const propertyTypeOptionsByCategory: Record<
  string,
  { label: string; value: string }[]
> = {
  residential: [
    { label: 'Apartment / Flat', value: 'apartment' },
    { label: 'Villa', value: 'villa' },
    { label: 'Row House / Townhouse', value: 'row_house' },
    { label: 'Bungalow', value: 'bungalow' },
    { label: 'Studio', value: 'studio' },
    { label: 'Penthouse', value: 'penthouse' },
    { label: 'Farmhouse', value: 'farmhouse' },
    { label: 'Residential Plot / Land', value: 'residential_plot' },
  ],
  commercial: [
    { label: 'Office', value: 'office' },
    { label: 'Shop / Retail', value: 'shop_retail' },
    { label: 'Showroom', value: 'showroom' },
    { label: 'Co-working Space', value: 'co_working' },
    { label: 'Business Center', value: 'business_center' },
    { label: 'Commercial Plot', value: 'commercial_plot' },
  ],
  industrial: [
    { label: 'Factory / Manufacturing', value: 'factory' },
    { label: 'Warehouse', value: 'warehouse' },
    { label: 'Logistics Park', value: 'logistics_park' },
    { label: 'Cold Storage', value: 'cold_storage' },
    { label: 'Industrial Plot', value: 'industrial_plot' },
  ],
  agricultural: [
    { label: 'Agricultural Land', value: 'agri_land' },
    { label: 'Plantation', value: 'plantation' },
    { label: 'Farm', value: 'farm' },
    { label: 'Orchard', value: 'orchard' },
  ],
  mixed_use: [
    { label: 'Mixed-use Building', value: 'mixed_use_building' },
    { label: 'Live-work Unit', value: 'live_work' },
  ],
  hospitality: [
    { label: 'Hotel', value: 'hotel' },
    { label: 'Resort', value: 'resort' },
    { label: 'Serviced Apartment', value: 'serviced_apartment' },
    { label: 'Guest House', value: 'guest_house' },
  ],
  institutional: [
    { label: 'School / College', value: 'school_college' },
    { label: 'Hospital / Clinic', value: 'hospital_clinic' },
    { label: 'Government Office', value: 'government_office' },
    { label: 'Religious / Community', value: 'religious_community' },
  ],
  land_plot: [
    { label: 'Land Parcel', value: 'land_parcel' },
    { label: 'Plot in Layout', value: 'plot_layout' },
    { label: 'Redevelopment Plot', value: 'redevelopment_plot' },
  ],
};

const indiaStateOptions = [
  {
    label: 'Andaman and Nicobar Islands',
    value: 'Andaman and Nicobar Islands',
  },
  { label: 'Andhra Pradesh', value: 'Andhra Pradesh' },
  { label: 'Arunachal Pradesh', value: 'Arunachal Pradesh' },
  { label: 'Assam', value: 'Assam' },
  { label: 'Bihar', value: 'Bihar' },
  { label: 'Chandigarh', value: 'Chandigarh' },
  { label: 'Chhattisgarh', value: 'Chhattisgarh' },
  {
    label: 'Dadra and Nagar Haveli and Daman and Diu',
    value: 'Dadra and Nagar Haveli and Daman and Diu',
  },
  { label: 'Delhi', value: 'Delhi' },
  { label: 'Goa', value: 'Goa' },
  { label: 'Gujarat', value: 'Gujarat' },
  { label: 'Haryana', value: 'Haryana' },
  { label: 'Himachal Pradesh', value: 'Himachal Pradesh' },
  { label: 'Jammu and Kashmir', value: 'Jammu and Kashmir' },
  { label: 'Jharkhand', value: 'Jharkhand' },
  { label: 'Karnataka', value: 'Karnataka' },
  { label: 'Kerala', value: 'Kerala' },
  { label: 'Ladakh', value: 'Ladakh' },
  { label: 'Lakshadweep', value: 'Lakshadweep' },
  { label: 'Madhya Pradesh', value: 'Madhya Pradesh' },
  { label: 'Maharashtra', value: 'Maharashtra' },
  { label: 'Manipur', value: 'Manipur' },
  { label: 'Meghalaya', value: 'Meghalaya' },
  { label: 'Mizoram', value: 'Mizoram' },
  { label: 'Nagaland', value: 'Nagaland' },
  { label: 'Odisha', value: 'Odisha' },
  { label: 'Puducherry', value: 'Puducherry' },
  { label: 'Punjab', value: 'Punjab' },
  { label: 'Rajasthan', value: 'Rajasthan' },
  { label: 'Sikkim', value: 'Sikkim' },
  { label: 'Tamil Nadu', value: 'Tamil Nadu' },
  { label: 'Telangana', value: 'Telangana' },
  { label: 'Tripura', value: 'Tripura' },
  { label: 'Uttar Pradesh', value: 'Uttar Pradesh' },
  { label: 'Uttarakhand', value: 'Uttarakhand' },
  { label: 'West Bengal', value: 'West Bengal' },
];

export const formFlows: Record<string, FormFlow> = {
  balanceTransferLoan: {
    title: 'Balance Transfer Loan',
    subtitle: 'Move your existing loan',
    description: 'Share current loan details to move to a lower rate.',
    steps: [
      {
        key: 'currentLoan',
        title: 'Current Loan',
        fields: [
          {
            key: 'lender',
            label: 'Existing Lender',
            placeholder: 'Bank/NBFC name',
            type: 'text',
            required: true,
          },
          {
            key: 'loanType',
            label: 'Loan Type',
            placeholder: 'Home/Personal/Vehicle',
            type: 'text',
            required: true,
          },
          {
            key: 'outstanding',
            label: 'Outstanding Amount',
            placeholder: 'e.g. 12,50,000',
            type: 'number',
            required: true,
          },
          {
            key: 'emi',
            label: 'Current EMI',
            placeholder: 'e.g. 18,500',
            type: 'number',
            required: true,
          },
          {
            key: 'interestRate',
            label: 'Interest Rate (%)',
            placeholder: 'e.g. 10.5',
            type: 'number',
          },
          {
            key: 'tenureLeft',
            label: 'Tenure Left (months)',
            placeholder: 'e.g. 48',
            type: 'number',
          },
          {
            key: 'consent',
            label: 'I authorize lender statement pull',
            type: 'checkbox',
            required: true,
          },
        ],
      },

      {
        key: 'documents',
        title: 'Upload Documents',
        description: 'Share required documents to complete your application.',
        fields: [
          {
            key: 'loanStatement',
            label: 'Upload Loan Statement',
            placeholder: 'Latest statement/PAN',
            type: 'file',
          },
        ],
      },
    ],
  },
  topUpLoan: {
    title: 'Top-up Loan',
    subtitle: 'Enhance existing loan',
    description: 'Request additional funds on your running loan.',
    steps: [
      {
        key: 'topup',
        title: 'Top-up Details',
        fields: [
          {
            key: 'existingLender',
            label: 'Existing Lender',
            placeholder: 'Bank/NBFC name',
            type: 'text',
            required: true,
          },
          {
            key: 'loanType',
            label: 'Loan Type',
            placeholder: 'Home/Personal/Vehicle',
            type: 'text',
            required: true,
          },
          {
            key: 'topupAmount',
            label: 'Top-up Amount Needed',
            placeholder: 'e.g. 3,00,000',
            type: 'number',
            required: true,
          },
          {
            key: 'emiTrack',
            label: 'On-time EMI history',
            placeholder: 'Select',
            type: 'select',
            options: [
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ],
          },
        ],
      },

      {
        key: 'documents',
        title: 'Upload Documents',
        description: 'Share required documents to complete your application.',
        fields: [
          {
            key: 'latestStatement',
            label: 'Upload Latest Statement',
            placeholder: 'PDF or image',
            type: 'file',
          },
        ],
      },
    ],
  },
  twoWheelerLoan: {
    title: 'Two Wheeler Loan',
    subtitle: 'Bike/scooter finance',
    description: 'Finance a new or used two-wheeler with minimal paperwork.',
    steps: [
      {
        key: 'vehicle',
        title: 'Two-wheeler Details',
        fields: [
          {
            key: 'makeModel',
            label: 'Make & Model',
            placeholder: 'e.g. Honda Activa',
            type: 'text',
            required: true,
          },
          {
            key: 'onRoadPrice',
            label: 'On-road Price',
            placeholder: 'e.g. 95,000',
            type: 'number',
            required: true,
          },
          {
            key: 'loanAmount',
            label: 'Loan Amount',
            placeholder: 'e.g. 80,000',
            type: 'number',
            required: true,
          },
          {
            key: 'downPayment',
            label: 'Down Payment',
            placeholder: 'e.g. 15,000',
            type: 'number',
          },
          { key: 'isUsed', label: 'Is it a used vehicle?', type: 'checkbox' },
        ],
      },
    ],
  },
  usedCarLoan: {
    title: 'Used Car Loan',
    subtitle: 'Pre-owned vehicle finance',
    description: 'Finance a pre-owned car with inspection-ready details.',
    steps: [
      {
        key: 'car',
        title: 'Car Details',
        fields: [
          {
            key: 'makeModel',
            label: 'Make & Model',
            placeholder: 'e.g. Maruti Baleno',
            type: 'text',
            required: true,
          },
          {
            key: 'year',
            label: 'Year of Manufacture',
            placeholder: 'e.g. 2018',
            type: 'number',
            required: true,
          },
          {
            key: 'kmDriven',
            label: 'Kilometers Driven',
            placeholder: 'e.g. 45,000',
            type: 'number',
          },
          {
            key: 'price',
            label: 'Expected Purchase Price',
            placeholder: 'e.g. 6,50,000',
            type: 'number',
            required: true,
          },
          {
            key: 'loanAmount',
            label: 'Loan Amount Needed',
            placeholder: 'e.g. 5,00,000',
            type: 'number',
            required: true,
          },
        ],
      },

      {
        key: 'documents',
        title: 'Upload Documents',
        description: 'Share required documents to complete your application.',
        fields: [
          {
            key: 'inspectionPhotos',
            label: 'Upload Car Photos',
            placeholder: 'Clear exterior/interior',
            type: 'file',
          },
        ],
      },
    ],
  },
  agricultureLoan: {
    title: 'Agriculture Loan',
    subtitle: 'Farm & agri needs',
    description: 'Fund crop, equipment, or seasonal agri needs.',
    steps: [
      {
        key: 'agri',
        title: 'Agri Details',
        fields: [
          {
            key: 'purpose',
            label: 'Purpose',
            placeholder: 'Crop / equipment / irrigation',
            type: 'text',
            required: true,
          },
          {
            key: 'landSize',
            label: 'Land Size (acres)',
            placeholder: 'e.g. 3.5',
            type: 'number',
          },
          {
            key: 'cropType',
            label: 'Crop Type',
            placeholder: 'e.g. Wheat',
            type: 'text',
          },
          {
            key: 'loanAmount',
            label: 'Loan Amount Needed',
            placeholder: 'e.g. 2,00,000',
            type: 'number',
            required: true,
          },
        ],
      },

      {
        key: 'documents',
        title: 'Upload Documents',
        description: 'Share required documents to complete your application.',
        fields: [
          {
            key: 'landDocs',
            label: 'Upload Land Docs',
            placeholder: '7/12, RTC, etc.',
            type: 'file',
          },
        ],
      },
    ],
  },
  personalAccidentInsurance: {
    title: 'Personal Accident Insurance',
    subtitle: 'Accident cover',
    description: 'Get lump-sum protection against accidents and disability.',
    steps: [
      {
        key: 'cover',
        title: 'Coverage Details',
        fields: [
          {
            key: 'sumInsured',
            label: 'Sum Insured',
            placeholder: 'e.g. 25,00,000',
            type: 'number',
            required: true,
          },
          {
            key: 'occupation',
            label: 'Occupation Risk',
            placeholder: 'e.g. Desk job / Field work',
            type: 'text',
            required: true,
          },
          {
            key: 'riders',
            label: 'Add Disability Riders',
            placeholder: 'Select',
            type: 'select',
            options: [
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ],
          },
        ],
      },
      {
        key: 'documents',
        title: 'Upload Documents',
        description: 'Share KYC and supporting documents for policy review.',
        fields: [],
      },
    ],
  },
  criticalIllnessInsurance: {
    title: 'Critical Illness Insurance',
    subtitle: 'Major illness cover',
    description: 'Lump-sum benefit on diagnosis of listed illnesses.',
    steps: [
      {
        key: 'ci',
        title: 'Coverage Details',
        fields: [
          {
            key: 'sumInsured',
            label: 'Sum Insured',
            placeholder: 'e.g. 20,00,000',
            type: 'number',
            required: true,
          },
          {
            key: 'illnessList',
            label: 'Any family history?',
            placeholder: 'Diabetes, cardiac, cancer etc.',
            type: 'textarea',
          },
          {
            key: 'smoker',
            label: 'Are you a smoker?',
            placeholder: 'Select',
            type: 'select',
            options: [
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ],
          },
        ],
      },
      {
        key: 'documents',
        title: 'Upload Documents',
        description: 'Share KYC and medical documents for policy review.',
        fields: [],
      },
    ],
  },
  cyberInsurance: {
    title: 'Cyber Insurance',
    subtitle: 'Online fraud cover',
    description: 'Protect against cyber fraud and data theft.',
    steps: [
      {
        key: 'cyber',
        title: 'Policy Details',
        fields: [
          {
            key: 'useCase',
            label: 'Primary Use',
            placeholder: 'Personal / Small business',
            type: 'text',
            required: true,
          },
          {
            key: 'coverage',
            label: 'Coverage Needed',
            placeholder: 'e.g. 5,00,000',
            type: 'number',
            required: true,
          },
          {
            key: 'pastIncidents',
            label: 'Any past cyber incidents?',
            placeholder: 'Select',
            type: 'select',
            options: [
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ],
          },
        ],
      },
      {
        key: 'documents',
        title: 'Upload Documents',
        description: 'Share KYC and supporting documents for policy review.',
        fields: [],
      },
    ],
  },
  petInsurance: {
    title: 'Pet Insurance',
    subtitle: 'Pet health cover',
    description: 'Cover vet bills and emergencies for your pet.',
    steps: [
      {
        key: 'pet',
        title: 'Pet Details',
        fields: [
          {
            key: 'petType',
            label: 'Pet Type',
            placeholder: 'Dog / Cat / Other',
            type: 'text',
            required: true,
          },
          {
            key: 'breed',
            label: 'Breed',
            placeholder: 'e.g. Labrador',
            type: 'text',
            required: true,
          },
          {
            key: 'age',
            label: 'Age',
            placeholder: 'e.g. 3 years',
            type: 'text',
            required: true,
          },
          {
            key: 'vaccinated',
            label: 'Vaccinations up to date?',
            type: 'checkbox',
          },
        ],
      },
      {
        key: 'documents',
        title: 'Upload Documents',
        description: 'Share KYC, vaccination and veterinary records.',
        fields: [],
      },
    ],
  },
  personalLoan: {
    title: 'Personal Loan',
    subtitle: 'Step-by-step application',
    description:
      'Complete your personal loan profile in three guided steps built for global KYC standards.',
    steps: [
      {
        key: 'basic',
        title: 'Identity & Contact',
        description: 'We verify identity and contact before fetching offers.',
        fields: [
          {
            key: 'fullName',
            label: 'Full Name',
            placeholder: 'Enter as per PAN',
            type: 'text',
            required: true,
          },
          {
            key: 'email',
            label: 'Email',
            placeholder: 'We will send your sanction letter here',
            type: 'email',
            required: true,
          },
          {
            key: 'phone',
            label: 'Phone',
            placeholder: '10-digit mobile for updates',
            type: 'phone',
            required: true,
          },
          {
            key: 'pan',
            label: 'PAN',
            placeholder: 'ABCDE1234F (uppercase)',
            type: 'text',
            required: true,
          },
          {
            key: 'aadhaar',
            label: 'Aadhaar (optional)',
            placeholder: '12-digit Aadhaar for eKYC',
            type: 'number',
            helperText: 'Speeds up eKYC if provided.',
          },
          {
            key: 'consentKyc',
            label: 'I consent to digital KYC',
            type: 'checkbox',
            required: true,
          },
        ],
      },
      {
        key: 'loan',
        title: 'Loan Details',
        description:
          'Specify your requirement so we can match the right lender.',
        fields: [
          {
            key: 'amount',
            label: 'Amount',
            placeholder: 'e.g. 5,00,000 INR',
            type: 'number',
            required: true,
          },
          {
            key: 'tenure',
            label: 'Tenure (months)',
            placeholder: 'e.g. 36 months',
            type: 'number',
            required: true,
          },
          {
            key: 'employment',
            label: 'Employment Type',
            placeholder: 'Select',
            type: 'select',
            options: [
              { label: 'Salaried', value: 'salaried' },
              { label: 'Self-employed', value: 'self' },
              { label: 'Freelancer', value: 'freelancer' },
            ],
            required: true,
          },
          {
            key: 'income',
            label: 'Monthly Income',
            placeholder: 'Net take-home in INR',
            type: 'number',
          },
          {
            key: 'address',
            label: 'Current Address',
            placeholder: 'House/Street/City',
            type: 'textarea',
          },
          {
            key: 'hasExistingLoans',
            label: 'Do you have existing loans?',
            placeholder: 'Select',
            type: 'select',
            options: [
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ],
            resetOnChangeKeys: ['emiBurden'],
          },
          {
            key: 'emiBurden',
            label: 'Total current EMIs (INR)',
            placeholder: 'e.g. 12,000',
            type: 'number',
            helperText: 'Include credit card EMIs if any.',
            showWhen: {
              key: 'hasExistingLoans',
              equals: 'yes',
            },
          },
        ],
      },
      {
        key: 'declarations',
        title: 'Declarations',
        description: 'Confirm your permissions so we can share offers.',
        fields: [
          {
            key: 'consentBureau',
            label: 'I allow credit bureau pull for offer eligibility',
            type: 'checkbox',
            required: true,
          },
          {
            key: 'consentCommunication',
            label: 'I agree to receive updates on SMS/Email/WhatsApp',
            type: 'checkbox',
            required: true,
          },
          {
            key: 'preferredContactTime',
            label: 'Preferred Contact Time',
            type: 'multiSelect',
            options: [
              { label: 'Morning', value: 'morning' },
              { label: 'Afternoon', value: 'afternoon' },
              { label: 'Evening', value: 'evening' },
            ],
            helperText: 'Select one or more suitable contact times.',
          },
        ],
      },

      {
        key: 'documents',
        title: 'Upload Documents',
        description: 'Share required documents to complete your application.',
        fields: [
          {
            key: 'documents',
            label: 'Upload Documents',
            placeholder: 'ID proof / salary slips / bank statements',
            type: 'file',
            helperText: 'You can add multiple files.',
          },
        ],
      },
    ],
  },
  homeLoan: {
    title: 'Home Loan',
    subtitle: 'Property & applicant details',
    description:
      'Provide property and applicant info for accurate eligibility checks.',
    steps: [
      {
        key: 'applicant',
        title: 'Applicant Details',
        fields: [
          {
            key: 'fullName',
            label: 'Full Name',
            placeholder: 'As per PAN',
            type: 'text',
            required: true,
          },
          {
            key: 'phone',
            label: 'Phone',
            placeholder: '10-digit mobile',
            type: 'phone',
            required: true,
          },
          {
            key: 'email',
            label: 'Email',
            placeholder: 'We will share approval letters here',
            type: 'email',
            required: true,
          },
          {
            key: 'dateOfBirth',
            label: 'Date of Birth',
            placeholder: 'DD/MM/YYYY',
            type: 'date',
            required: true,
          },
          {
            key: 'gender',
            label: 'Gender',
            placeholder: 'Select gender',
            type: 'select',
            options: [
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
              { label: 'Other', value: 'other' },
            ],
            required: true,
          },
          {
            key: 'marriedStatus',
            label: 'Marital Status',
            placeholder: 'Select status',
            type: 'select',
            options: [
              { label: 'Single', value: 'single' },
              { label: 'Married', value: 'married' },
              { label: 'Divorced', value: 'divorced' },
              { label: 'Widowed', value: 'widowed' },
            ],
            required: true,
          },
          {
            key: 'pan',
            label: 'PAN',
            placeholder: 'ABCDE1234F',
            type: 'text',
            required: true,
          },
          {
            key: 'aadhaar',
            label: 'Aadhaar',
            placeholder: '12-digit Aadhaar',
            type: 'number',
            required: true,
          },
          {
            key: 'employment',
            label: 'Employment Type',
            placeholder: 'Select',
            type: 'select',
            options: [
              { label: 'Salaried', value: 'salaried' },
              { label: 'Self-employed', value: 'self_employed' },
            ],
            required: true,
          },
          {
            key: 'companyName',
            label: 'Company / Business Name',
            placeholder: 'Employer or business name',
            type: 'text',
            required: true,
          },
          {
            key: 'monthlyIncome',
            label: 'Monthly Net Income',
            placeholder: 'e.g. 1,20,000',
            type: 'number',
            required: true,
          },
          {
            key: 'workExperience',
            label: 'Work Experience (years)',
            placeholder: 'e.g. 5',
            type: 'number',
            required: true,
          },
          {
            key: 'officeAddress',
            label: 'Office Address',
            placeholder: 'Workplace address',
            type: 'textarea',
            required: true,
          },
          {
            key: 'address',
            label: 'Residence Address',
            placeholder: 'House / street',
            type: 'textarea',
            required: true,
          },
          {
            key: 'city',
            label: 'City',
            placeholder: 'City',
            type: 'text',
            required: true,
          },
          {
            key: 'state',
            label: 'State',
            placeholder: 'State',
            type: 'select',
            options: indiaStateOptions,
            required: true,
          },
          {
            key: 'pincode',
            label: 'Pincode',
            placeholder: '6-digit pincode',
            type: 'number',
            required: true,
          },
          {
            key: 'bankName',
            label: 'Bank Name',
            placeholder: 'Primary bank',
            type: 'text',
            required: true,
          },
          {
            key: 'accountType',
            label: 'Account Type',
            placeholder: 'Select account type',
            type: 'select',
            options: [
              { label: 'Savings', value: 'savings' },
              { label: 'Current', value: 'current' },
              { label: 'Salary', value: 'salary' },
            ],
            required: true,
          },
          {
            key: 'accountNumber',
            label: 'Account Number',
            placeholder: 'Bank account number',
            type: 'number',
            required: true,
          },
          {
            key: 'ifscCode',
            label: 'IFSC Code',
            placeholder: 'e.g. HDFC0001234',
            type: 'text',
            required: true,
          },
          {
            key: 'coApplicant',
            label: 'Add Co-applicant?',
            type: 'checkbox',
            helperText: 'Check if a co-borrower will apply with you.',
          },
          {
            key: 'coApplicants',
            label: 'Co-applicants',
            type: 'coApplicants',
            required: true,
          },
          {
            key: 'coApplicantRelation',
            label: 'Co-applicant Relation',
            placeholder: 'Spouse / Parent / Sibling',
            type: 'text',
            required: true,
          },
          {
            key: 'coApplicantFullName',
            label: 'Co-applicant Full Name',
            placeholder: 'As per PAN',
            type: 'text',
            required: true,
          },
          {
            key: 'coApplicantEmail',
            label: 'Co-applicant Email',
            placeholder: 'Email address',
            type: 'email',
            required: true,
          },
          {
            key: 'coApplicantPhone',
            label: 'Co-applicant Phone',
            placeholder: '10-digit mobile',
            type: 'phone',
            required: true,
          },
          {
            key: 'coApplicantDateOfBirth',
            label: 'Co-applicant Date of Birth',
            placeholder: 'DD/MM/YYYY',
            type: 'date',
            required: true,
          },
          {
            key: 'coApplicantGender',
            label: 'Co-applicant Gender',
            placeholder: 'Select gender',
            type: 'select',
            options: [
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
              { label: 'Other', value: 'other' },
            ],
            required: true,
          },
          {
            key: 'coApplicantMarriedStatus',
            label: 'Co-applicant Marital Status',
            placeholder: 'Select status',
            type: 'select',
            options: [
              { label: 'Single', value: 'single' },
              { label: 'Married', value: 'married' },
              { label: 'Divorced', value: 'divorced' },
              { label: 'Widowed', value: 'widowed' },
            ],
            required: true,
          },
          {
            key: 'coApplicantPan',
            label: 'Co-applicant PAN',
            placeholder: 'ABCDE1234F',
            type: 'text',
            required: true,
          },
          {
            key: 'coApplicantAadhaar',
            label: 'Co-applicant Aadhaar',
            placeholder: '12-digit Aadhaar',
            type: 'number',
            required: true,
          },
          {
            key: 'coApplicantEmploymentType',
            label: 'Co-applicant Employment Type',
            placeholder: 'Select',
            type: 'select',
            options: [
              { label: 'Salaried', value: 'salaried' },
              { label: 'Self-employed', value: 'self_employed' },
            ],
            required: true,
          },
          {
            key: 'coApplicantCompanyName',
            label: 'Co-applicant Company / Business Name',
            placeholder: 'Employer or business name',
            type: 'text',
            required: true,
          },
          {
            key: 'coApplicantMonthlyIncome',
            label: 'Co-applicant Monthly Net Income',
            placeholder: 'e.g. 80,000',
            type: 'number',
            required: true,
          },
          {
            key: 'coApplicantWorkExperience',
            label: 'Co-applicant Work Experience (years)',
            placeholder: 'e.g. 4',
            type: 'number',
            required: true,
          },
          {
            key: 'coApplicantOfficeAddress',
            label: 'Co-applicant Office Address',
            placeholder: 'Workplace address',
            type: 'textarea',
            required: true,
          },
          {
            key: 'coApplicantAddress',
            label: 'Co-applicant Residence Address',
            placeholder: 'House / street',
            type: 'textarea',
            required: true,
          },
          {
            key: 'coApplicantCity',
            label: 'Co-applicant City',
            placeholder: 'City',
            type: 'text',
            required: true,
          },
          {
            key: 'coApplicantState',
            label: 'Co-applicant State',
            placeholder: 'State',
            type: 'select',
            options: indiaStateOptions,
            required: true,
          },
          {
            key: 'coApplicantPincode',
            label: 'Co-applicant Pincode',
            placeholder: '6-digit pincode',
            type: 'number',
            required: true,
          },
          {
            key: 'coApplicantBankName',
            label: 'Co-applicant Bank Name',
            placeholder: 'Primary bank',
            type: 'text',
            required: true,
          },
          {
            key: 'coApplicantAccountType',
            label: 'Co-applicant Account Type',
            placeholder: 'Select account type',
            type: 'select',
            options: [
              { label: 'Savings', value: 'savings' },
              { label: 'Current', value: 'current' },
              { label: 'Salary', value: 'salary' },
            ],
            required: true,
          },
          {
            key: 'coApplicantAccountNumber',
            label: 'Co-applicant Account Number',
            placeholder: 'Bank account number',
            type: 'number',
            required: true,
          },
          {
            key: 'coApplicantIfscCode',
            label: 'Co-applicant IFSC Code',
            placeholder: 'e.g. HDFC0001234',
            type: 'text',
            required: true,
          },
        ],
      },
      {
        key: 'property',
        title: 'Property Details',
        fields: [
          {
            key: 'propertyCategory',
            label: 'Property Category',
            placeholder: 'Select category',
            type: 'select',
            options: propertyCategoryOptions,
            resetOnChangeKeys: ['propertyType'],
            required: true,
          },
          {
            key: 'propertyType',
            label: 'Property Type',
            placeholder: 'Select type',
            type: 'select',
            parentKey: 'propertyCategory',
            optionsByParent: propertyTypeOptionsByCategory,
            required: true,
          },
          {
            key: 'state',
            label: 'State',
            placeholder: 'Select state',
            type: 'select',
            options: indiaStateOptions,
            required: true,
          },
          {
            key: 'city',
            label: 'City',
            placeholder: 'City where property is located',
            type: 'text',
            required: true,
          },
          {
            key: 'estimate',
            label: 'Estimated Property Value',
            placeholder: 'e.g. 75,00,000',
            type: 'number',
            required: true,
          },
          {
            key: 'loanAmount',
            label: 'Required Loan Amount',
            placeholder: 'e.g. 60,00,000',
            type: 'number',
            required: true,
          },
          {
            key: 'underConstruction',
            label: 'Is the property under construction?',
            type: 'checkbox',
          },
          {
            key: 'builderName',
            label: 'Builder / Project Name',
            placeholder: 'Name of builder/project',
            type: 'text',
          },
        ],
      },
      {
        key: 'affordability',
        title: 'Affordability & EMI',
        fields: [
          {
            key: 'existingEmi',
            label: 'Existing EMIs (monthly)',
            placeholder: 'e.g. 10,000',
            type: 'number',
          },
          {
            key: 'downPayment',
            label: 'Planned Down Payment',
            placeholder: 'Amount you will pay upfront',
            type: 'number',
          },
          {
            key: 'interestPreference',
            label: 'Interest Preference',
            placeholder: 'Fixed / Floating',
            type: 'text',
          },
          {
            key: 'agreeCreditCheck',
            label: 'I authorize bureau check for eligibility',
            type: 'checkbox',
            required: true,
          },
        ],
      },

      {
        key: 'documents',
        title: 'Upload Documents',
        description: 'Share required documents to complete your application.',
        fields: [
          {
            key: 'ownershipDocs',
            label: 'Upload Ownership/Katha',
            placeholder: 'Sale deed, allotment letter, etc.',
            type: 'file',
            helperText: 'Attach clear scans of available documents.',
          },
        ],
      },
    ],
  },
  businessLoan: {
    title: 'Business Loan',
    subtitle: 'Business & revenue details',
    description: 'Share business profile so we can underwrite quickly.',
    steps: [
      {
        key: 'business',
        title: 'Business Details',
        fields: [
          {
            key: 'businessName',
            label: 'Business Name',
            placeholder: 'Registered business name',
            type: 'text',
            required: true,
          },
          {
            key: 'constitution',
            label: 'Entity Type',
            placeholder: 'Select entity type',
            type: 'select',
            options: [
              { label: 'Proprietorship', value: 'proprietorship' },
              { label: 'Partnership Firm', value: 'partnership' },
              {
                label: 'Limited Liability Partnership (LLP)',
                value: 'llp',
              },
              {
                label: 'Private Limited Company',
                value: 'private_limited',
              },
              {
                label: 'Public Limited Company',
                value: 'public_limited',
              },
              {
                label: 'One Person Company (OPC)',
                value: 'opc',
              },
              {
                label: 'Hindu Undivided Family (HUF)',
                value: 'huf',
              },
              { label: 'Trust / Society', value: 'trust_society' },
              { label: 'Other', value: 'other' },
            ],
            required: true,
          },
          {
            key: 'turnover',
            label: 'GST Turnover',
            placeholder: 'e.g. 2,00,00,000 (GST turnover)',
            type: 'number',
            required: true,
          },
          {
            key: 'profit',
            label: 'Profit After Tax',
            placeholder: 'Last FY PAT in INR',
            type: 'number',
          },
          {
            key: 'vintage',
            label: 'Business Vintage',
            placeholder: 'Years in operation',
            type: 'number',
          },
          {
            key: 'loanAmount',
            label: 'Required Loan Amount',
            placeholder: 'e.g. 25,00,000',
            type: 'number',
            required: true,
          },
          {
            key: 'usage',
            label: 'Usage of Funds',
            placeholder: 'Working capital / expansion / machinery',
            type: 'textarea',
          },
          { key: 'gstRegistered', label: 'GST Registered?', type: 'checkbox' },
          {
            key: 'securedLoan',
            label: 'Open to secured loan against collateral?',
            type: 'checkbox',
          },
        ],
      },
      {
        key: 'cashflow',
        title: 'Cash Flow & Liability',
        fields: [
          {
            key: 'monthlyOutflow',
            label: 'Monthly Business Outflow',
            placeholder: 'Rent, salaries, utilities etc.',
            type: 'number',
          },
          {
            key: 'bankingPattern',
            label: 'Primary Bank',
            placeholder: 'Bank name used for business',
            type: 'text',
          },
          {
            key: 'securedAssets',
            label: 'Assets for collateral',
            placeholder: 'Property / machinery / FD',
            type: 'text',
          },
          {
            key: 'agreeBureau',
            label: 'I permit bureau and bank statement analysis',
            type: 'checkbox',
            required: true,
          },
        ],
      },

      {
        key: 'documents',
        title: 'Upload Documents',
        description: 'Share required documents to complete your application.',
        fields: [
          {
            key: 'financials',
            label: 'Upload Financials',
            placeholder: 'ITR / GST / Bank statements',
            type: 'file',
            helperText: 'Attach latest audited statements if available.',
          },
        ],
      },
    ],
  },
  vehicleLoan: {
    title: 'Car Loan',
    subtitle: 'New, used, or loan against car',
    description: 'Tell us about the car and your loan requirement.',
    tabFieldKey: 'carLoanType',
    tabs: [
      {
        key: 'new',
        label: 'New Car',
        info: 'Best for dealer purchases with proforma invoice and on-road price.',
      },
      {
        key: 'used',
        label: 'Used Car',
        info: 'For pre-owned cars where RC details and condition matter.',
      },
      {
        key: 'loan_against_car',
        label: 'Loan Against Car',
        info: 'Unlock funds against your existing car as collateral.',
      },
    ],
    steps: [
      {
        key: 'vehicle',
        title: 'Vehicle Details',
        fields: [
          {
            key: 'carRegistrationNumber',
            label: 'Car Registration Number',
            placeholder: 'e.g. DL10CW7560',
            type: 'text',
            pattern: '^[A-Z]{2}\\d{1,2}[A-Z]{0,3}\\d{4}$',
            patternError: 'Enter a valid registration number',
            maxLength: 10,
            helperText: 'Use the format shown above for faster lookup.',
            verifyLabel: 'Fetch',
            showOnTabs: ['used', 'loan_against_car'],
          },
          {
            key: 'carOwnerName',
            label: 'Owner Name (RC)',
            placeholder: 'Auto-filled from RC',
            type: 'text',
            showOnTabs: ['used', 'loan_against_car'],
          },
          {
            key: 'carFatherName',
            label: 'Father Name (RC)',
            placeholder: 'Auto-filled from RC',
            type: 'text',
            showOnTabs: ['used', 'loan_against_car'],
          },
          {
            key: 'carRegistrationDate',
            label: 'Registration Date',
            placeholder: 'YYYY-MM-DD',
            type: 'text',
            showOnTabs: ['used', 'loan_against_car'],
          },
          {
            key: 'carRegisteredAt',
            label: 'Registered At (RTO)',
            placeholder: 'Auto-filled from RC',
            type: 'text',
            showOnTabs: ['used', 'loan_against_car'],
          },
          {
            key: 'carCategory',
            label: 'Vehicle Category',
            placeholder: 'Auto-filled from RC',
            type: 'text',
            showOnTabs: ['used', 'loan_against_car'],
          },
          {
            key: 'carMakerDescription',
            label: 'Maker Description',
            placeholder: 'Auto-filled from RC',
            type: 'text',
            showOnTabs: ['used', 'loan_against_car'],
          },
          {
            key: 'carBodyType',
            label: 'Body Type',
            placeholder: 'Auto-filled from RC',
            type: 'text',
            showOnTabs: ['used', 'loan_against_car'],
          },
          {
            key: 'carFuelType',
            label: 'Fuel Type',
            placeholder: 'Auto-filled from RC',
            type: 'text',
            showOnTabs: ['used', 'loan_against_car'],
          },
          {
            key: 'carColor',
            label: 'Color',
            placeholder: 'Auto-filled from RC',
            type: 'text',
            showOnTabs: ['used', 'loan_against_car'],
          },
          {
            key: 'carChassisNumber',
            label: 'Chassis Number',
            placeholder: 'Auto-filled from RC',
            type: 'text',
            showOnTabs: ['used', 'loan_against_car'],
          },
          {
            key: 'carEngineNumber',
            label: 'Engine Number',
            placeholder: 'Auto-filled from RC',
            type: 'text',
            showOnTabs: ['used', 'loan_against_car'],
          },
          {
            key: 'carInsuranceCompany',
            label: 'Insurance Company',
            placeholder: 'Auto-filled from RC',
            type: 'text',
            showOnTabs: ['used', 'loan_against_car'],
          },
          {
            key: 'carInsuranceUpto',
            label: 'Insurance Valid Upto',
            placeholder: 'YYYY-MM-DD',
            type: 'text',
            showOnTabs: ['used', 'loan_against_car'],
          },
          {
            key: 'carFinancer',
            label: 'Financer',
            placeholder: 'Auto-filled from RC',
            type: 'text',
            showOnTabs: ['used', 'loan_against_car'],
          },
          {
            key: 'carRcStatus',
            label: 'RC Status',
            placeholder: 'Auto-filled from RC',
            type: 'text',
            showOnTabs: ['used', 'loan_against_car'],
          },
          {
            key: 'vehicleType',
            label: 'Vehicle Type',
            placeholder: 'Car / Bike / Commercial',
            type: 'text',
            required: true,
          },
          {
            key: 'makeModel',
            label: 'Make & Model',
            placeholder: 'e.g. Tata Nexon XM',
            type: 'text',
            required: true,
          },
          {
            key: 'onRoadPrice',
            label: 'On-road Price',
            placeholder: 'e.g. 12,50,000',
            type: 'number',
            required: true,
          },
          {
            key: 'loanAmount',
            label: 'Loan Amount',
            placeholder: 'Desired loan amount',
            type: 'number',
            required: true,
          },
          {
            key: 'downPayment',
            label: 'Planned Down Payment',
            placeholder: 'Amount you will pay upfront',
            type: 'number',
          },
          {
            key: 'income',
            label: 'Monthly Income',
            placeholder: 'Net salary/income',
            type: 'number',
            required: true,
          },
          {
            key: 'manufactureYear',
            label: 'Year of Manufacture',
            placeholder: 'e.g. 2019',
            type: 'number',
          },
        ],
      },
      {
        key: 'vehicleDeclarations',
        title: 'Declarations',
        fields: [
          {
            key: 'insuranceConsent',
            label: 'I agree to bundle insurance quotation',
            type: 'checkbox',
          },
          {
            key: 'creditConsent',
            label: 'I allow credit check for this vehicle loan',
            type: 'checkbox',
            required: true,
          },
        ],
      },

      {
        key: 'documents',
        title: 'Upload Documents',
        description: 'Share required documents to complete your application.',
        fields: [
          {
            key: 'quoteUnavailable',
            label: 'Quote/Proforma not available',
            type: 'checkbox',
            helperText: 'Select if you do not have a dealer quote.',
            showOnTabs: ['used', 'loan_against_car'],
          },
          {
            key: 'documents',
            label: 'Upload Quotes/Proforma',
            placeholder: 'Dealer quote or proforma invoice',
            type: 'file',
            helperText: 'Upload PDF/image from your dealer.',
          },
        ],
      },
    ],
  },
  renovationLoan: {
    title: 'Renovation Loan',
    subtitle: 'Home upgrade details',
    description: 'Tell us about the renovation scope and cost.',
    steps: [
      {
        key: 'project',
        title: 'Project Details',
        fields: [
          {
            key: 'propertyAddress',
            label: 'Property Address',
            placeholder: 'Where renovation will happen',
            type: 'textarea',
            required: true,
          },
          {
            key: 'scope',
            label: 'Scope of Work',
            placeholder: 'Kitchen, flooring, paint, etc.',
            type: 'textarea',
            required: true,
          },
          {
            key: 'estimatedCost',
            label: 'Estimated Cost',
            placeholder: 'Total project cost in INR',
            type: 'number',
            required: true,
          },
          {
            key: 'loanAmount',
            label: 'Loan Amount Needed',
            placeholder: 'e.g. 8,00,000',
            type: 'number',
            required: true,
          },
          {
            key: 'isStructural',
            label: 'Does work involve structural changes?',
            type: 'checkbox',
          },
        ],
      },

      {
        key: 'documents',
        title: 'Upload Documents',
        description: 'Share required documents to complete your application.',
        fields: [
          {
            key: 'plans',
            label: 'Upload Plans/Quotes',
            placeholder: 'Contractor quote or BoQ',
            type: 'file',
          },
        ],
      },
    ],
  },
  workingCapitalLoan: {
    title: 'Working Capital Loan',
    subtitle: 'Cash-flow support',
    description: 'Share business cash-flow needs for a suitable WC line.',
    steps: [
      {
        key: 'wc',
        title: 'Requirement Details',
        fields: [
          {
            key: 'businessName',
            label: 'Business Name',
            placeholder: 'Registered business name',
            type: 'text',
            required: true,
          },
          {
            key: 'turnover',
            label: 'Annual Turnover',
            placeholder: 'e.g. 1,50,00,000',
            type: 'number',
            required: true,
          },
          {
            key: 'averageMonthly',
            label: 'Average Monthly Revenue',
            placeholder: 'Monthly sales in INR',
            type: 'number',
          },
          {
            key: 'wcNeed',
            label: 'Working Capital Needed',
            placeholder: 'e.g. 10,00,000',
            type: 'number',
            required: true,
          },
          {
            key: 'usage',
            label: 'Purpose',
            placeholder: 'Inventory / vendor payments / payroll',
            type: 'textarea',
          },
          {
            key: 'odFacility',
            label: 'Looking for overdraft/CC facility?',
            type: 'checkbox',
          },
          {
            key: 'gstFilingOnTime',
            label: 'GST filed on time last 3 returns?',
            type: 'checkbox',
          },
        ],
      },

      {
        key: 'documents',
        title: 'Upload Documents',
        description: 'Share required documents to complete your application.',
        fields: [
          {
            key: 'bankStatements',
            label: 'Upload Bank Statements',
            placeholder: 'Last 6 months PDF',
            type: 'file',
          },
        ],
      },
    ],
  },
  loanAgainstProperty: {
    title: 'Loan Against Property',
    subtitle: 'Collateral-based loan',
    description: 'Provide property collateral details to assess eligibility.',
    steps: [
      {
        key: 'collateral',
        title: 'Property Collateral',
        fields: [
          {
            key: 'propertyCategory',
            label: 'Property Category',
            placeholder: 'Select category',
            type: 'select',
            options: propertyCategoryOptions,
            resetOnChangeKeys: ['propertyType'],
            required: true,
          },
          {
            key: 'propertyType',
            label: 'Property Type',
            placeholder: 'Select type',
            type: 'select',
            parentKey: 'propertyCategory',
            optionsByParent: propertyTypeOptionsByCategory,
            required: true,
          },
          {
            key: 'state',
            label: 'State',
            placeholder: 'Select state',
            type: 'select',
            options: indiaStateOptions,
            required: true,
          },
          {
            key: 'propertyValue',
            label: 'Market Value',
            placeholder: 'e.g. 80,00,000',
            type: 'number',
            required: true,
          },
          {
            key: 'loanAmount',
            label: 'Loan Amount Needed',
            placeholder: 'e.g. 50,00,000',
            type: 'number',
            required: true,
          },
          {
            key: 'city',
            label: 'City',
            placeholder: 'Property city',
            type: 'text',
            required: true,
          },
          {
            key: 'coOwned',
            label: 'Is the property co-owned?',
            type: 'checkbox',
          },
          {
            key: 'encumbrance',
            label: 'Any existing mortgage/charge?',
            type: 'checkbox',
          },
        ],
      },

      {
        key: 'documents',
        title: 'Upload Documents',
        description: 'Share required documents to complete your application.',
        fields: [
          {
            key: 'ownershipDocs',
            label: 'Ownership Proof',
            placeholder: 'Sale deed / tax receipt',
            type: 'file',
            helperText: 'Clear scans speed up approval.',
          },
        ],
      },
    ],
  },
  loanAgainstSecurity: {
    title: 'Loan Against Security',
    subtitle: 'Pledge your investments',
    description: 'Tell us what security you will pledge for funds.',
    steps: [
      {
        key: 'security',
        title: 'Security Details',
        fields: [
          {
            key: 'instrument',
            label: 'Security Type',
            placeholder: 'Shares / MF / Bonds',
            type: 'text',
            required: true,
          },
          {
            key: 'portfolioValue',
            label: 'Portfolio Value',
            placeholder: 'Current market value',
            type: 'number',
            required: true,
          },
          {
            key: 'loanAmount',
            label: 'Loan Amount Needed',
            placeholder: 'e.g. 15,00,000',
            type: 'number',
            required: true,
          },
          {
            key: 'pledgeConsent',
            label: 'I consent to pledge these securities',
            type: 'checkbox',
            required: true,
          },
        ],
      },

      {
        key: 'documents',
        title: 'Upload Documents',
        description: 'Share required documents to complete your application.',
        fields: [
          {
            key: 'dpStatement',
            label: 'Upload DP Statement',
            placeholder: 'Latest holding statement',
            type: 'file',
            helperText: 'Attach NSDL/CDSL statement.',
          },
        ],
      },
    ],
  },
  loanAgainstCarValue: {
    title: 'Loan Against Car Value',
    subtitle: 'Use car as collateral',
    description: 'We evaluate your car to extend a secured line.',
    steps: [
      {
        key: 'car',
        title: 'Car Details',
        fields: [
          {
            key: 'makeModel',
            label: 'Make & Model',
            placeholder: 'e.g. Honda City VX',
            type: 'text',
            required: true,
          },
          {
            key: 'year',
            label: 'Year of Manufacture',
            placeholder: 'e.g. 2019',
            type: 'number',
            required: true,
          },
          {
            key: 'kmDriven',
            label: 'Kilometers Driven',
            placeholder: 'e.g. 35,000',
            type: 'number',
          },
          {
            key: 'loanAmount',
            label: 'Loan Amount Needed',
            placeholder: 'e.g. 4,00,000',
            type: 'number',
            required: true,
          },
          {
            key: 'insuranceActive',
            label: 'Is insurance currently active?',
            type: 'checkbox',
          },
        ],
      },

      {
        key: 'documents',
        title: 'Upload Documents',
        description: 'Share required documents to complete your application.',
        fields: [
          {
            key: 'inspectionPhotos',
            label: 'Upload Car Photos',
            placeholder: 'Front, back, sides, interior',
            type: 'file',
          },
        ],
      },
    ],
  },
  goldLoan: {
    title: 'Gold Loan',
    subtitle: 'Secure funds with gold',
    description: 'Share gold details to calculate an instant offer.',
    steps: [
      {
        key: 'gold',
        title: 'Gold Details',
        fields: [
          {
            key: 'goldType',
            label: 'Gold Type',
            placeholder: 'Jewellery / coins / bars',
            type: 'text',
            required: true,
          },
          {
            key: 'purity',
            label: 'Purity',
            placeholder: 'e.g. 22K / 24K',
            type: 'text',
            required: true,
          },
          {
            key: 'weight',
            label: 'Net Weight (grams)',
            placeholder: 'Total gold weight',
            type: 'number',
            required: true,
          },
          {
            key: 'loanAmount',
            label: 'Loan Amount Needed',
            placeholder: 'e.g. 2,00,000',
            type: 'number',
            required: true,
          },
          {
            key: 'agreeAssay',
            label: 'I agree to purity testing/assay',
            type: 'checkbox',
            required: true,
          },
        ],
      },

      {
        key: 'documents',
        title: 'Upload Documents',
        description: 'Share required documents to complete your application.',
        fields: [
          {
            key: 'valuationSlip',
            label: 'Upload Valuation/Photos',
            placeholder: 'Upload clear photos or slip',
            type: 'file',
          },
        ],
      },
    ],
  },
  healthInsurance: {
    title: 'Health Insurance',
    subtitle: 'Personal details',
    description:
      'Tell us about yourself and your coverage preferences so we can suggest the right health plan.',
    steps: [
      {
        key: 'personal',
        title: 'Personal details',
        description:
          'We need accurate contact and identity info to initiate the policy. Verification happens instantly.',
        fields: [
          {
            key: 'firstName',
            label: 'First name',
            placeholder: 'Enter as per PAN/Aadhaar',
            type: 'text',
            required: true,
          },
          {
            key: 'lastName',
            label: 'Last name',
            placeholder: 'Surname as per ID',
            type: 'text',
            required: true,
          },
          {
            key: 'dob',
            label: 'DOB',
            placeholder: 'Select date of birth (DD/MM/YYYY)',
            type: 'date',
            required: true,
          },
          {
            key: 'gender',
            label: 'Gender',
            placeholder: 'Select gender',
            type: 'select',
            options: [
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
              { label: 'Other', value: 'other' },
            ],
            required: true,
          },
          {
            key: 'mobile',
            label: 'Mobile no',
            placeholder: '10-digit phone used for policy updates',
            type: 'phone',
            required: true,
            verifyLabel: 'Verify',
            helperText: 'We will send a one-time code to confirm ownership.',
          },
          {
            key: 'email',
            label: 'Email address',
            placeholder: 'Official email for e-policy copy',
            type: 'email',
            required: true,
            verifyLabel: 'Verify',
            helperText: 'Use an email you check often for policy documents.',
          },
          {
            key: 'address',
            label: 'Full Address',
            placeholder: 'House/Flat, Street, Landmark',
            type: 'textarea',
            required: true,
            helperText: 'Address should match your ID proof for faster KYC.',
          },
          {
            key: 'state',
            label: 'State',
            placeholder: 'Select state',
            type: 'select',
            options: indiaStateOptions,
            required: true,
          },
          {
            key: 'city',
            label: 'City',
            placeholder: 'City',
            type: 'select',
            options: [
              { label: 'Mumbai', value: 'mumbai' },
              { label: 'Delhi', value: 'delhi' },
              { label: 'Bengaluru', value: 'bengaluru' },
            ],
            required: true,
          },
          {
            key: 'nomineeName',
            label: 'Nominee Name',
            placeholder: 'Full name of nominee',
            type: 'text',
            required: true,
          },
          {
            key: 'nomineeRelation',
            label: 'Nominee Relation',
            placeholder: 'Relation to you (spouse, parent, etc.)',
            type: 'text',
            required: true,
          },
          {
            key: 'occupation',
            label: 'Occupation',
            placeholder: 'e.g. Salaried, Self-employed',
            type: 'text',
          },
          {
            key: 'income',
            label: 'Annual Income',
            placeholder: 'Gross annual income in INR',
            type: 'number',
          },
        ],
      },
      {
        key: 'policy',
        title: 'Policy Details',
        description:
          'Share coverage expectations, medical history, and hospital preferences.',
        fields: [
          {
            key: 'insuranceType',
            label: 'Insurance Type',
            placeholder: 'Select',
            type: 'select',
            options: [
              { label: 'Individual', value: 'individual' },
              { label: 'Family Floater', value: 'family' },
            ],
            helperText:
              'Individual covers one member; family floater shares a single cover across members.',
          },
          {
            key: 'members',
            label: 'Number of Members covered',
            placeholder: 'Total dependents under this policy',
            type: 'number',
          },
          {
            key: 'primaryName',
            label: 'Name',
            placeholder: 'Primary insured full name',
            type: 'text',
          },
          {
            key: 'age',
            label: 'Age',
            placeholder: 'Age of primary insured',
            type: 'number',
          },
          {
            key: 'relation',
            label: 'Relation',
            placeholder: 'Relation to proposer',
            type: 'text',
          },
          {
            key: 'healthCondition',
            label: 'Health Condition of member',
            placeholder: 'Describe current health status',
            type: 'textarea',
          },
          {
            key: 'sumInsured',
            label: 'Sum Insured',
            placeholder: 'e.g. 5,00,000',
            type: 'number',
            helperText: 'Choose the cover amount you expect to need.',
          },
          {
            key: 'existingConditions',
            label: 'Existing Medical conditions',
            placeholder: 'List diagnosed conditions',
            type: 'textarea',
          },
          {
            key: 'preExisting',
            label: 'Pre-existing Diseases (if any)',
            placeholder: 'Select',
            type: 'select',
            options: [
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ],
            helperText: 'Helps us evaluate waiting periods and eligibility.',
          },
          {
            key: 'hospitalPreference',
            label: 'Hospital Preference (Optional)',
            placeholder: 'Select',
            type: 'select',
            options: [
              { label: 'Apollo', value: 'apollo' },
              { label: 'Fortis', value: 'fortis' },
              { label: 'Max', value: 'max' },
            ],
            helperText: 'Pick a preferred network hospital if you have one.',
          },
          {
            key: 'claimHistory',
            label: 'Claim History (if any)',
            placeholder: 'Select',
            type: 'select',
            options: [
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ],
            helperText: 'Disclose past claims for smoother underwriting.',
          },
        ],
        subtitle: 'Policy Details',
      },

      {
        key: 'documents',
        title: 'Upload Documents',
        description: 'Share required documents to complete your application.',
        fields: [
          {
            key: 'kycDocs',
            label: 'KYC Documents Upload',
            placeholder: 'Upload PAN / Aadhaar / DL',
            type: 'file',
            helperText: 'Add clear photos. Multiple files supported.',
          },
          {
            key: 'medicalReports',
            label: 'Upload Medical Reports',
            placeholder: 'Recent prescriptions, test results',
            type: 'file',
            helperText: 'Attach clear PDFs or images to speed up approvals.',
          },
        ],
      },
    ],
  },
  groupInsurance: {
    title: 'Group Insurance',
    subtitle: 'Member details',
    description:
      'Share group member details and coverage preferences for the best plan.',
    steps: [
      {
        key: 'personal',
        title: 'Member details',
        description:
          'We need accurate contact and identity info to initiate the policy. Verification happens instantly.',
        fields: [
          {
            key: 'firstName',
            label: 'First name',
            placeholder: 'Enter as per PAN/Aadhaar',
            type: 'text',
            required: true,
          },
          {
            key: 'lastName',
            label: 'Last name',
            placeholder: 'Surname as per ID',
            type: 'text',
            required: true,
          },
          {
            key: 'dob',
            label: 'DOB',
            placeholder: 'Select date of birth (DD/MM/YYYY)',
            type: 'date',
            required: true,
          },
          {
            key: 'gender',
            label: 'Gender',
            placeholder: 'Select gender',
            type: 'select',
            options: [
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
              { label: 'Other', value: 'other' },
            ],
            required: true,
          },
          {
            key: 'mobile',
            label: 'Mobile no',
            placeholder: '10-digit phone used for policy updates',
            type: 'phone',
            required: true,
            verifyLabel: 'Verify',
            helperText: 'We will send a one-time code to confirm ownership.',
          },
          {
            key: 'email',
            label: 'Email address',
            placeholder: 'Official email for e-policy copy',
            type: 'email',
            required: true,
            verifyLabel: 'Verify',
            helperText: 'Use an email you check often for policy documents.',
          },
          {
            key: 'address',
            label: 'Full Address',
            placeholder: 'House/Flat, Street, Landmark',
            type: 'textarea',
            required: true,
            helperText: 'Address should match your ID proof for faster KYC.',
          },
          {
            key: 'state',
            label: 'State',
            placeholder: 'Select state',
            type: 'select',
            options: indiaStateOptions,
            required: true,
          },
          {
            key: 'city',
            label: 'City',
            placeholder: 'City',
            type: 'select',
            options: [
              { label: 'Mumbai', value: 'mumbai' },
              { label: 'Delhi', value: 'delhi' },
              { label: 'Bengaluru', value: 'bengaluru' },
            ],
            required: true,
          },
          {
            key: 'nomineeName',
            label: 'Nominee Name',
            placeholder: 'Full name of nominee',
            type: 'text',
            required: true,
          },
          {
            key: 'nomineeRelation',
            label: 'Nominee Relation',
            placeholder: 'Relation to you (spouse, parent, etc.)',
            type: 'text',
            required: true,
          },
          {
            key: 'occupation',
            label: 'Occupation',
            placeholder: 'e.g. Salaried, Self-employed',
            type: 'text',
          },
          {
            key: 'income',
            label: 'Annual Income',
            placeholder: 'Gross annual income in INR',
            type: 'number',
          },
        ],
      },
      {
        key: 'policy',
        title: 'Coverage Details',
        description:
          'Share coverage expectations, member count, and medical history.',
        fields: [
          {
            key: 'insuranceType',
            label: 'Insurance Type',
            placeholder: 'Select',
            type: 'select',
            options: [
              { label: 'Individual', value: 'individual' },
              { label: 'Family Floater', value: 'family' },
            ],
            helperText:
              'Individual covers one member; family floater shares a single cover across members.',
          },
          {
            key: 'members',
            label: 'Number of Members covered',
            placeholder: 'Total dependents under this policy',
            type: 'number',
          },
          {
            key: 'primaryName',
            label: 'Name',
            placeholder: 'Primary insured full name',
            type: 'text',
          },
          {
            key: 'age',
            label: 'Age',
            placeholder: 'Age of primary insured',
            type: 'number',
          },
          {
            key: 'relation',
            label: 'Relation',
            placeholder: 'Relation to proposer',
            type: 'text',
          },
          {
            key: 'healthCondition',
            label: 'Health Condition of member',
            placeholder: 'Describe current health status',
            type: 'textarea',
          },
          {
            key: 'sumInsured',
            label: 'Sum Insured',
            placeholder: 'e.g. 5,00,000',
            type: 'number',
            helperText: 'Choose the cover amount you expect to need.',
          },
          {
            key: 'existingConditions',
            label: 'Existing Medical conditions',
            placeholder: 'List diagnosed conditions',
            type: 'textarea',
          },
          {
            key: 'preExisting',
            label: 'Pre-existing Diseases (if any)',
            placeholder: 'Select',
            type: 'select',
            options: [
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ],
            helperText: 'Helps us evaluate waiting periods and eligibility.',
          },
          {
            key: 'hospitalPreference',
            label: 'Hospital Preference (Optional)',
            placeholder: 'Select',
            type: 'select',
            options: [
              { label: 'Apollo', value: 'apollo' },
              { label: 'Fortis', value: 'fortis' },
              { label: 'Max', value: 'max' },
            ],
            helperText: 'Pick a preferred network hospital if you have one.',
          },
          {
            key: 'claimHistory',
            label: 'Claim History (if any)',
            placeholder: 'Select',
            type: 'select',
            options: [
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ],
            helperText: 'Disclose past claims for smoother underwriting.',
          },
        ],
        subtitle: 'Coverage Details',
      },

      {
        key: 'documents',
        title: 'Upload Documents',
        description: 'Share required documents to complete your application.',
        fields: [
          {
            key: 'kycDocs',
            label: 'KYC Documents Upload',
            placeholder: 'Upload PAN / Aadhaar / DL',
            type: 'file',
            helperText: 'Add clear photos. Multiple files supported.',
          },
          {
            key: 'medicalReports',
            label: 'Upload Medical Reports',
            placeholder: 'Recent prescriptions, test results',
            type: 'file',
            helperText: 'Attach clear PDFs or images to speed up approvals.',
          },
        ],
      },
    ],
  },
  lifeInsurance: {
    title: 'Life Insurance',
    subtitle: 'Policy Details',
    description:
      'Capture nominee and benefit details to customize your life cover.',
    steps: [
      {
        key: 'policy',
        title: 'Policy Details',
        fields: [
          {
            key: 'insuranceType',
            label: 'Insurance Type',
            placeholder: 'Select',
            type: 'select',
            options: [
              { label: 'Term', value: 'term' },
              { label: 'ULIP', value: 'ulip' },
            ],
            helperText:
              'Term offers pure protection; ULIP combines investment + cover.',
          },
          {
            key: 'memberName',
            label: 'Name',
            placeholder: 'Primary insured full name',
            type: 'text',
            required: true,
          },
          {
            key: 'memberAge',
            label: 'Age',
            placeholder: 'Age in years',
            type: 'number',
            required: true,
          },
          {
            key: 'relation',
            label: 'Relation',
            placeholder: 'Relation to proposer',
            type: 'text',
            required: true,
          },
          {
            key: 'healthCondition',
            label: 'Health Condition of member',
            placeholder: 'Note any ongoing conditions',
            type: 'textarea',
          },
          {
            key: 'sumInsured',
            label: 'Sum Insured',
            placeholder: 'Desired cover amount (e.g. 10,00,000)',
            type: 'number',
          },
          {
            key: 'existingConditions',
            label: 'Existing Medical conditions',
            placeholder: 'List diagnosed conditions',
            type: 'textarea',
          },
          {
            key: 'preExisting',
            label: 'Pre-existing Diseases (if any)',
            placeholder: 'Select',
            type: 'select',
            options: [
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ],
            helperText: 'Accurate disclosures prevent claim delays.',
          },
          {
            key: 'claimHistory',
            label: 'Claim History (if any)',
            placeholder: 'Select',
            type: 'select',
            options: [
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ],
          },
        ],
      },

      {
        key: 'documents',
        title: 'Upload Documents',
        description: 'Share required documents to complete your application.',
        fields: [
          {
            key: 'medicalReports',
            label: 'Upload Medical Reports',
            placeholder: 'Recent health reports (PDF/JPG)',
            type: 'file',
          },
        ],
      },
    ],
  },
  retirementPlanInsurance: {
    title: 'Retirement Plans',
    subtitle: 'Retirement details',
    description:
      'Share nominee and benefit details to tailor your retirement plan.',
    steps: [
      {
        key: 'policy',
        title: 'Plan Details',
        fields: [
          {
            key: 'insuranceType',
            label: 'Plan Type',
            placeholder: 'Select',
            type: 'select',
            options: [
              { label: 'Term', value: 'term' },
              { label: 'ULIP', value: 'ulip' },
            ],
            helperText:
              'Choose a plan based on protection vs investment preference.',
          },
          {
            key: 'memberName',
            label: 'Name',
            placeholder: 'Primary insured full name',
            type: 'text',
            required: true,
          },
          {
            key: 'memberAge',
            label: 'Age',
            placeholder: 'Age in years',
            type: 'number',
            required: true,
          },
          {
            key: 'relation',
            label: 'Nominee Relation',
            placeholder: 'Relation to proposer',
            type: 'text',
            required: true,
          },
          {
            key: 'healthCondition',
            label: 'Health Condition',
            placeholder: 'Note any ongoing conditions',
            type: 'textarea',
          },
          {
            key: 'sumInsured',
            label: 'Target Corpus',
            placeholder: 'Desired retirement corpus',
            type: 'number',
          },
          {
            key: 'existingConditions',
            label: 'Existing Medical conditions',
            placeholder: 'List diagnosed conditions',
            type: 'textarea',
          },
          {
            key: 'preExisting',
            label: 'Pre-existing Diseases (if any)',
            placeholder: 'Select',
            type: 'select',
            options: [
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ],
            helperText: 'Accurate disclosures prevent claim delays.',
          },
          {
            key: 'claimHistory',
            label: 'Claim History (if any)',
            placeholder: 'Select',
            type: 'select',
            options: [
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ],
          },
        ],
      },

      {
        key: 'documents',
        title: 'Upload Documents',
        description: 'Share required documents to complete your application.',
        fields: [
          {
            key: 'medicalReports',
            label: 'Upload Medical Reports',
            placeholder: 'Recent health reports (PDF/JPG)',
            type: 'file',
          },
        ],
      },
    ],
  },
  vehicleInsurance: {
    title: 'Vehicle Insurance',
    subtitle: 'Vehicle & driver details',
    description: 'Capture vehicle information for the right motor policy.',
    steps: [
      {
        key: 'vehicle',
        title: 'Vehicle Details',
        fields: [
          {
            key: 'registrationNumber',
            label: 'Registration Number',
            placeholder: 'e.g. MH12AB1234',
            type: 'text',
            pattern: '^[A-Z]{2}\\d{1,2}[A-Z]{0,3}\\d{4}$',
            patternError: 'Enter a valid registration number',
            maxLength: 10,
            helperText: 'Use the format shown above for faster lookup.',
            verifyLabel: 'Fetch',
            required: true,
          },
          {
            key: 'makeModel',
            label: 'Make & Model',
            placeholder: 'e.g. Hyundai i20 Sportz',
            type: 'text',
            required: true,
          },
          {
            key: 'year',
            label: 'Year of Manufacture',
            placeholder: 'e.g. 2022',
            type: 'number',
            required: true,
          },
          {
            key: 'fuelType',
            label: 'Fuel Type',
            placeholder: 'Petrol / Diesel / EV',
            type: 'text',
          },
          {
            key: 'previousInsurer',
            label: 'Previous Insurer',
            placeholder: 'If renewing, mention insurer name',
            type: 'text',
          },
          {
            key: 'policyExpiry',
            label: 'Current Policy Expiry',
            placeholder: 'DD/MM/YYYY',
            type: 'date',
          },
        ],
      },
      {
        key: 'driver',
        title: 'Driver Details',
        fields: [
          {
            key: 'driverName',
            label: 'Driver Name',
            placeholder: 'As per license',
            type: 'text',
            required: true,
          },
          {
            key: 'licenseNumber',
            label: 'License Number',
            placeholder: 'e.g. MH1420110xxxxx',
            type: 'text',
            required: true,
          },
          {
            key: 'licenseExpiry',
            label: 'License Expiry',
            placeholder: 'DD/MM/YYYY',
            type: 'date',
            required: true,
          },
          {
            key: 'claims',
            label: 'Past Claims',
            placeholder: 'Select',
            type: 'select',
            options: [
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ],
          },
        ],
      },

      {
        key: 'documents',
        title: 'Upload Documents',
        description: 'Share required documents to complete your application.',
        fields: [
          {
            key: 'rcUpload',
            label: 'Upload RC',
            placeholder: 'Clear photo or PDF of RC',
            type: 'file',
            helperText: 'Multiple files allowed.',
          },
          {
            key: 'inspectionPhotos',
            label: 'Upload Vehicle Photos',
            placeholder: 'Front, rear, sides',
            type: 'file',
            helperText: 'Upload multiple angles for faster approval.',
          },
        ],
      },
    ],
  },
  propertyInsurance: {
    title: 'Property Insurance',
    subtitle: 'Insure your property',
    description: 'Protect your property with the right coverage details.',
    steps: [
      {
        key: 'property',
        title: 'Property Details',
        fields: [
          {
            key: 'address',
            label: 'Property Address',
            placeholder: 'Full address',
            type: 'textarea',
            required: true,
          },
          {
            key: 'propertyCategory',
            label: 'Property Category',
            placeholder: 'Select category',
            type: 'select',
            options: propertyCategoryOptions,
            resetOnChangeKeys: ['propertyType'],
            required: true,
          },
          {
            key: 'propertyType',
            label: 'Property Type',
            placeholder: 'Select type',
            type: 'select',
            parentKey: 'propertyCategory',
            optionsByParent: propertyTypeOptionsByCategory,
            required: true,
          },
          {
            key: 'area',
            label: 'Built-up Area (sq ft)',
            placeholder: 'e.g. 1200',
            type: 'number',
            required: true,
          },
          {
            key: 'constructionYear',
            label: 'Year of Construction',
            placeholder: 'e.g. 2018',
            type: 'number',
          },
          {
            key: 'sumInsured',
            label: 'Sum Insured',
            placeholder: 'Reconstruction cost you expect',
            type: 'number',
            required: true,
          },
        ],
      },

      {
        key: 'documents',
        title: 'Upload Documents',
        description: 'Share required documents to complete your application.',
        fields: [
          {
            key: 'ownershipDocs',
            label: 'Ownership Proof',
            placeholder: 'Sale deed / tax receipt',
            type: 'file',
          },
        ],
      },
    ],
  },
  shopInsurance: {
    title: 'Shop Insurance',
    subtitle: 'Shop & premises details',
    description: 'Cover your shop, inventory, and premises under one policy.',
    steps: [
      {
        key: 'property',
        title: 'Shop Details',
        fields: [
          {
            key: 'address',
            label: 'Shop Address',
            placeholder: 'Full address',
            type: 'textarea',
            required: true,
          },
          {
            key: 'propertyCategory',
            label: 'Shop Category',
            placeholder: 'Select category',
            type: 'select',
            options: propertyCategoryOptions,
            resetOnChangeKeys: ['propertyType'],
            required: true,
          },
          {
            key: 'propertyType',
            label: 'Shop Type',
            placeholder: 'Select type',
            type: 'select',
            parentKey: 'propertyCategory',
            optionsByParent: propertyTypeOptionsByCategory,
            required: true,
          },
          {
            key: 'area',
            label: 'Built-up Area (sq ft)',
            placeholder: 'e.g. 1200',
            type: 'number',
            required: true,
          },
          {
            key: 'constructionYear',
            label: 'Year of Construction',
            placeholder: 'e.g. 2018',
            type: 'number',
          },
          {
            key: 'sumInsured',
            label: 'Sum Insured',
            placeholder: 'Cover amount for shop and stock',
            type: 'number',
            required: true,
          },
        ],
      },

      {
        key: 'documents',
        title: 'Upload Documents',
        description: 'Share required documents to complete your application.',
        fields: [
          {
            key: 'ownershipDocs',
            label: 'Ownership Proof',
            placeholder: 'License / tax receipt / lease deed',
            type: 'file',
          },
        ],
      },
    ],
  },
  stockInsurance: {
    title: 'Stock Insurance',
    subtitle: 'Inventory protection',
    description: 'Insure your stock and storage premises.',
    steps: [
      {
        key: 'property',
        title: 'Stock Details',
        fields: [
          {
            key: 'address',
            label: 'Storage Address',
            placeholder: 'Full address',
            type: 'textarea',
            required: true,
          },
          {
            key: 'propertyCategory',
            label: 'Storage Category',
            placeholder: 'Select category',
            type: 'select',
            options: propertyCategoryOptions,
            resetOnChangeKeys: ['propertyType'],
            required: true,
          },
          {
            key: 'propertyType',
            label: 'Storage Type',
            placeholder: 'Select type',
            type: 'select',
            parentKey: 'propertyCategory',
            optionsByParent: propertyTypeOptionsByCategory,
            required: true,
          },
          {
            key: 'area',
            label: 'Built-up Area (sq ft)',
            placeholder: 'e.g. 1200',
            type: 'number',
            required: true,
          },
          {
            key: 'constructionYear',
            label: 'Year of Construction',
            placeholder: 'e.g. 2018',
            type: 'number',
          },
          {
            key: 'sumInsured',
            label: 'Sum Insured',
            placeholder: 'Cover amount for stock',
            type: 'number',
            required: true,
          },
        ],
      },

      {
        key: 'documents',
        title: 'Upload Documents',
        description: 'Share required documents to complete your application.',
        fields: [
          {
            key: 'ownershipDocs',
            label: 'Ownership Proof',
            placeholder: 'Stock list / warehouse doc',
            type: 'file',
          },
        ],
      },
    ],
  },
  machineInsurance: {
    title: 'Machine Insurance',
    subtitle: 'Machinery protection',
    description: 'Cover your machinery and equipment against breakdown.',
    steps: [
      {
        key: 'property',
        title: 'Machinery Details',
        fields: [
          {
            key: 'address',
            label: 'Installation Address',
            placeholder: 'Full address',
            type: 'textarea',
            required: true,
          },
          {
            key: 'propertyCategory',
            label: 'Machinery Category',
            placeholder: 'Select category',
            type: 'select',
            options: propertyCategoryOptions,
            resetOnChangeKeys: ['propertyType'],
            required: true,
          },
          {
            key: 'propertyType',
            label: 'Machinery Type',
            placeholder: 'Select type',
            type: 'select',
            parentKey: 'propertyCategory',
            optionsByParent: propertyTypeOptionsByCategory,
            required: true,
          },
          {
            key: 'area',
            label: 'Floor Area (sq ft)',
            placeholder: 'e.g. 1200',
            type: 'number',
            required: true,
          },
          {
            key: 'constructionYear',
            label: 'Year of Installation',
            placeholder: 'e.g. 2018',
            type: 'number',
          },
          {
            key: 'sumInsured',
            label: 'Sum Insured',
            placeholder: 'Cover amount for machinery',
            type: 'number',
            required: true,
          },
        ],
      },

      {
        key: 'documents',
        title: 'Upload Documents',
        description: 'Share required documents to complete your application.',
        fields: [
          {
            key: 'ownershipDocs',
            label: 'Ownership Proof',
            placeholder: 'Invoice / asset list',
            type: 'file',
          },
        ],
      },
    ],
  },
  machineryStockInsurance: {
    title: 'Machinery Stock Insurance',
    subtitle: 'Machinery & stock cover',
    description: 'Protect machinery and stock under one cover.',
    steps: [
      {
        key: 'property',
        title: 'Machinery & Stock Details',
        fields: [
          {
            key: 'address',
            label: 'Storage Address',
            placeholder: 'Full address',
            type: 'textarea',
            required: true,
          },
          {
            key: 'propertyCategory',
            label: 'Category',
            placeholder: 'Select category',
            type: 'select',
            options: propertyCategoryOptions,
            resetOnChangeKeys: ['propertyType'],
            required: true,
          },
          {
            key: 'propertyType',
            label: 'Type',
            placeholder: 'Select type',
            type: 'select',
            parentKey: 'propertyCategory',
            optionsByParent: propertyTypeOptionsByCategory,
            required: true,
          },
          {
            key: 'area',
            label: 'Built-up Area (sq ft)',
            placeholder: 'e.g. 1200',
            type: 'number',
            required: true,
          },
          {
            key: 'constructionYear',
            label: 'Year of Construction',
            placeholder: 'e.g. 2018',
            type: 'number',
          },
          {
            key: 'sumInsured',
            label: 'Sum Insured',
            placeholder: 'Cover amount for machinery & stock',
            type: 'number',
            required: true,
          },
        ],
      },

      {
        key: 'documents',
        title: 'Upload Documents',
        description: 'Share required documents to complete your application.',
        fields: [
          {
            key: 'ownershipDocs',
            label: 'Ownership Proof',
            placeholder: 'Asset list / stock list',
            type: 'file',
          },
        ],
      },
    ],
  },
  travelInsurance: {
    title: 'Travel Insurance',
    subtitle: 'Trip details',
    description: 'Help us secure your trip with the right cover.',
    steps: [
      {
        key: 'trip',
        title: 'Trip Details',
        fields: [
          {
            key: 'destination',
            label: 'Destination Country',
            placeholder: 'e.g. USA',
            type: 'text',
            required: true,
          },
          {
            key: 'startDate',
            label: 'Trip Start Date',
            placeholder: 'DD/MM/YYYY',
            type: 'date',
            required: true,
          },
          {
            key: 'endDate',
            label: 'Trip End Date',
            placeholder: 'DD/MM/YYYY',
            type: 'date',
            required: true,
          },
          {
            key: 'travellers',
            label: 'Number of Travellers',
            placeholder: 'Total count',
            type: 'number',
            required: true,
          },
        ],
      },

      {
        key: 'documents',
        title: 'Upload Documents',
        description: 'Share required documents to complete your application.',
        fields: [
          {
            key: 'passportUpload',
            label: 'Passport Upload',
            placeholder: 'Front page image',
            type: 'file',
            helperText: 'Upload for each traveller if available.',
          },
        ],
      },
    ],
  },
  educationLoan: {
    title: 'Education Loan',
    subtitle: 'Student & course details',
    description: 'Share study plans so we can match the right education loan.',
    steps: [
      {
        key: 'student',
        title: 'Student Details',
        fields: [
          {
            key: 'studentName',
            label: 'Student Name',
            placeholder: 'Full name as per passport',
            type: 'text',
            required: true,
          },
          {
            key: 'email',
            label: 'Email',
            placeholder: 'For offer letters and updates',
            type: 'email',
            required: true,
          },
          {
            key: 'phone',
            label: 'Phone',
            placeholder: 'Primary contact number',
            type: 'phone',
            required: true,
          },
          {
            key: 'passport',
            label: 'Passport Number',
            placeholder: 'If studying abroad',
            type: 'text',
          },
        ],
      },
      {
        key: 'course',
        title: 'Course Details',
        fields: [
          {
            key: 'institution',
            label: 'Institution',
            placeholder: 'College/University name',
            type: 'text',
            required: true,
          },
          {
            key: 'country',
            label: 'Country',
            placeholder: 'Country of study',
            type: 'text',
            required: true,
          },
          {
            key: 'courseName',
            label: 'Course Name',
            placeholder: 'e.g. MS in Computer Science',
            type: 'text',
            required: true,
          },
          {
            key: 'duration',
            label: 'Course Duration',
            placeholder: 'e.g. 24 months',
            type: 'text',
            required: true,
          },
          {
            key: 'loanAmount',
            label: 'Required Loan Amount',
            placeholder: 'Tuition + living cost',
            type: 'number',
            required: true,
          },
        ],
      },

      {
        key: 'documents',
        title: 'Upload Documents',
        description: 'Share required documents to complete your application.',
        fields: [
          {
            key: 'admitLetter',
            label: 'Admission Letter',
            placeholder: 'Upload PDF/image',
            type: 'file',
            helperText: 'Attach offer/admit letter if received.',
          },
        ],
      },
    ],
  },
  termInsurance: {
    title: 'Term Insurance',
    subtitle: 'Protection details',
    description:
      'Protect your family with the right cover amount and nominee details.',
    steps: [
      {
        key: 'protection',
        title: 'Protection Details',
        fields: [
          {
            key: 'coverAmount',
            label: 'Cover Amount',
            placeholder: 'e.g. 1,00,00,000',
            type: 'number',
            required: true,
          },
          {
            key: 'policyTerm',
            label: 'Policy Term',
            placeholder: 'e.g. 30 years',
            type: 'number',
            required: true,
          },
          {
            key: 'smoker',
            label: 'Are you a smoker?',
            placeholder: 'Select',
            type: 'select',
            options: [
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ],
            required: true,
          },
          {
            key: 'nominee',
            label: 'Nominee Name',
            placeholder: 'Full name of nominee',
            type: 'text',
            required: true,
          },
          {
            key: 'nomineeRelation',
            label: 'Nominee Relation',
            placeholder: 'Relation to you',
            type: 'text',
            required: true,
          },
          {
            key: 'healthNotes',
            label: 'Health Notes',
            placeholder: 'Any health disclosures',
            type: 'textarea',
          },
        ],
      },

      {
        key: 'documents',
        title: 'Upload Documents',
        description: 'Share required documents to complete your application.',
        fields: [
          {
            key: 'medicalReports',
            label: 'Upload Medical Reports',
            placeholder: 'Health check docs',
            type: 'file',
          },
        ],
      },
    ],
  },
  loanSurakshaInsurance: {
    title: 'Loan Suraksha',
    subtitle: 'Protection details',
    description:
      'Secure your loan repayments with the right cover amount and nominee details.',
    steps: [
      {
        key: 'protection',
        title: 'Protection Details',
        fields: [
          {
            key: 'coverAmount',
            label: 'Cover Amount',
            placeholder: 'e.g. 1,00,00,000',
            type: 'number',
            required: true,
          },
          {
            key: 'policyTerm',
            label: 'Policy Term',
            placeholder: 'e.g. 30 years',
            type: 'number',
            required: true,
          },
          {
            key: 'smoker',
            label: 'Are you a smoker?',
            placeholder: 'Select',
            type: 'select',
            options: [
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ],
            required: true,
          },
          {
            key: 'nominee',
            label: 'Nominee Name',
            placeholder: 'Full name of nominee',
            type: 'text',
            required: true,
          },
          {
            key: 'nomineeRelation',
            label: 'Nominee Relation',
            placeholder: 'Relation to you',
            type: 'text',
            required: true,
          },
          {
            key: 'healthNotes',
            label: 'Health Notes',
            placeholder: 'Any health disclosures',
            type: 'textarea',
          },
        ],
      },

      {
        key: 'documents',
        title: 'Upload Documents',
        description: 'Share required documents to complete your application.',
        fields: [
          {
            key: 'medicalReports',
            label: 'Upload Medical Reports',
            placeholder: 'Health check docs',
            type: 'file',
          },
        ],
      },
    ],
  },
};
