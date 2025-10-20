import { InvestigationType } from '~/components/viewing-and-downloading-investigations/InvestigationResultDetailCard';

export const TERMS_OF_SERVICE = 'https://www.rastuc.com/terms';
export const PRIVACY_POLICY = 'https://www.rastuc.com/privacy';
export const HELP_CENTER = 'https://www.rastuc.com/#faqs';

export const FEEDBACK_FORM_URL = 'https://forms.gle/PzyxUkMwH8iXUSEj8';
export const BUG_REPORT_FORM_URL = 'https://forms.gle/yeVZGMueAL7yJTWL6';

export const UPLOAD_PROFILE_PICTURE = 'patients/profile-picture/upload-picture/';

export const GET_HEALTH_CARE_PROVIDER_DETAIL_WEB_URL = (healthCareProviderDetailId: number) =>
  `https://rastuc.com/doctors/${healthCareProviderDetailId}`;

export const GET_MAP_URL = (location: string) =>
  `https://www.google.com/maps/search/?api=1&query=${location}`;

export const PLAYSTORE_URL =
  'https://play.google.com/store/apps/details?id=com.rastuc_technologies.rastuc_patient';

const BackendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

export function GET_DOCTOR_PROFILE_PICTURE_URL(workerId: number) {
  return `${BackendUrl}/healthworkers/profile-picture/retrieve-picture/?workerId=${workerId}&thumbnail=true`;
}

export function GET_PATIENT_PROFILE_PICTURE_URL(patientId: number) {
  return `${BackendUrl}/patients/profile-picture/retrieve-picture/?patientId=${patientId}&thumbnail=true`;
}

export function GET_HEALTH_FACILITY_LOGO_URL(healthFacilityId: number) {
  return `${BackendUrl}/organizations/logo-picture/retrieve-picture?organizationId=${healthFacilityId}&thumbnail=true`;
}

export const DYNAMIC_INVESTIGATION_REPORT_FILE_URL = (
  investigationType: InvestigationType,
  reportId: number,
  storageKey: string
) => {
  let investigationTypePath = '';
  switch (investigationType) {
    case 'ImagingReport':
      investigationTypePath = 'imaging';
      break;
    case 'PathologyReport':
      investigationTypePath = 'pathology';
      break;
    default:
      investigationTypePath = 'lab';
      break;
  }
  return `encounters/${investigationTypePath}-reports/retrieve-file/?reportId=${reportId}&storageKey=${storageKey}`;
};

export const DYNAMIC_INVESTIGATION_REQUEST_FILE_URL = (
  investigationType: InvestigationType,
  requestId: number,
  storageKey: string
) => {
  let investigationTypePath = '';
  switch (investigationType) {
    case 'ImagingReport':
      investigationTypePath = 'imaging';
      break;
    case 'PathologyReport':
      investigationTypePath = 'pathology';
      break;
    default:
      investigationTypePath = 'lab';
      break;
  }
  return `encounters/${investigationTypePath}-requests/retrieve-file/?requestId=${requestId}&storageKey=${storageKey}`;
};

export const RETRIEVE_BILL_FILE_URL = (appointmentId: number) =>
  `appointments/booking-bill/retrieve-file/?appointmentId=${appointmentId}`;

export const RETRIEVE_DISCHARGE_SUMMARY_FILE_URL = (encounterId: number) =>
  `encounters/discharge-summaries/retrieve-file/?encounterId=${encounterId}`;

export const RETRIEVE_PATIENT_PRESCRIPTION_FILE_URL = (
  encounterId: number,
  generatedPrescriptionsId: number
) =>
  `encounters/discharge-prescriptions/retrieve-file/?encounterId=${encounterId}&prescriptionsId=${generatedPrescriptionsId}`;

export const DYNAMIC_INVESTIGATION_RESULTS_UPLOAD_URL = (investigationType: string) => {
  let investigationTypePath = '';
  switch (investigationType) {
    case 'ImagingReport':
      investigationTypePath = 'imaging';
      break;
    case 'PathologyReport':
      investigationTypePath = 'pathology';
      break;
    default:
      investigationTypePath = 'lab';
      break;
  }
  return `encounters/${investigationTypePath}-reports/upload-files/`;
};
