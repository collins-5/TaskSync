import {
  AppointmentStatuses,
  BookOrganisationAppointmentMutation,
  DurationType,
  EncounterModes,
  GetHealthCareProviderDetailsQuery,
  GetHealthCareProvidersQuery,
  GetHealthFacilitiesQuery,
  GetHealthFacilityClinicsQuery,
  GetImagingRequestsQuery,
  GetLabRequestsQuery,
  GetPathologyRequestsQuery,
  GetPatientAppointmentsQuery,
  OrganizationHealthCareServiceAvailabilitySchedule,
} from '~/lib/graphql/generated/graphql';

export type CreateProfileSteps = 'optional' | 'required' | 'nextOfKin';

export type InvestigationRequest =
  | GetLabRequestsQuery['retrieveLabRequests']['items'][number]
  | GetImagingRequestsQuery['retrieveImagingRequests']['items'][number]
  | GetPathologyRequestsQuery['retrievePathologyRequests']['items'][number];

export type Block = {
  id: string;
  type: string;
  data: any;
};

export type DischargeSummaryContent = (string | { [key: string]: string })[];

export type ParsedDischargeSummary = {
  [section: string]: {
    content: DischargeSummaryContent;
  };
};

export type DischargeSummarySection = {
  name: string;
  content: DischargeSummaryContent;
};

export type HealthFacilityServiceKeys = 'Labs' | 'Radiology' | 'Services';

export interface HealthFacilityService {
  id: number;
  name: string;
  price: number;
  duration: DurationType;
  description: string;
  schedules: Omit<OrganizationHealthCareServiceAvailabilitySchedule, 'id'>[];
  clinicId: number;
  isAvailable: boolean;
}

export type HealthCareProvider =
  GetHealthCareProvidersQuery['retrieveHealthWorkers']['items'][number];

export type Appointment = GetPatientAppointmentsQuery['retrieveAppointments']['items'][number];

export type HomeAppointmentStatuses = AppointmentStatuses.Ongoing | AppointmentStatuses.Pending;

type HealthWorkerProviderBooked = Appointment['doctor'];

type AppointmentDoctor = Pick<
  NonNullable<HealthWorkerProviderBooked>,
  | 'id'
  | 'title'
  | 'firstName'
  | 'middleName'
  | 'lastName'
  | 'profilePicture'
  | 'primarySpecialty'
  | 'primaryClinicPractice'
  | 'qualifications'
  | 'subSpecialties'
>;
export type AppointmentDetailsCardProps = Pick<
  Appointment,
  | 'id'
  | 'startTime'
  | 'cost'
  | 'paymentCompleted'
  | 'encounter'
  | 'encounterMode'
  | 'meetingLinkGenerated'
  | 'meetingLink'
> & {
  doctor?: AppointmentDoctor | null;
};

export type ParamsWithId = {
  id: string;
};

export type HealthFacilityTabValues =
  | 'clinics'
  | 'labs'
  | 'services'
  | 'radiologies'
  | (string & {});

export type HealthFacilityClinic =
  GetHealthFacilityClinicsQuery['retrieveOrganizationClinics']['items'][number];

export type Organisation = GetHealthFacilitiesQuery['retrieveOrganizations']['items'][number];

export interface SelectedOption {
  value: string;
  label: string;
}

export interface ConsultationMode {
  label: string;
  icon: 'video' | 'hospital-building' | 'home';
  description: string;
  value: EncounterModes;
  isAvailable: boolean | undefined;
  price: number | undefined;
}

export type PaymentType = 'now' | 'later';

type Doctor = Omit<
  NonNullable<BookOrganisationAppointmentMutation['createOrganizationAppointment']['doctor']>,
  '__typename' | 'primarySpecialty'
> & {
  primarySpecialty?: Omit<
    NonNullable<
      NonNullable<
        BookOrganisationAppointmentMutation['createOrganizationAppointment']['doctor']
      >['primarySpecialty']
    >,
    '__typename'
  > | null;
};

export type OrganisationAppointment = Partial<
  Omit<
    NonNullable<BookOrganisationAppointmentMutation['createOrganizationAppointment']>,
    'doctor'
  > & {
    doctor?: Doctor | null;
  }
>;

export type HealthCareProviderDetails = GetHealthCareProviderDetailsQuery['retrieveHealthWorker'];
