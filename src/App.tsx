import { FormEvent, useEffect, useRef, useState } from "react";

type AgendaItem = {
  title: string;
  summary: string;
  detail: string;
  accent: string;
};

type View =
  | "login"
  | "register"
  | "biometric"
  | "governmentStagePage"
  | "governmentDashboard"
  | "bankDashboard"
  | "userDashboard";
type Role = "Government Official" | "Bank Officer" | "Common User";
type BankOfficerPersona = "loanOfficer" | "mortgageUnderwriter" | "fraudInvestigator";

type LandLockerDoc = {
  id: string;
  name: string;
  category: "Mother Deed" | "Tax Receipt" | "Encumbrance Certificate" | "Other";
  encrypted: boolean;
  uploadedAt: string;
};

type BhuAadhaarAlert = {
  id: string;
  ulpin: string;
  actor: string;
  action: string;
  timestamp: string;
  frozen: boolean;
};

type VigilanceReport = {
  id: string;
  plotId: string;
  reporter: string;
  issue: string;
  satelliteStatus: "pending" | "confirmed" | "rejected";
};

type OneTapVerification = {
  propertyId: string;
  gpsMatched: boolean;
  blockchainMatched: boolean;
  healthScore: number;
};

type InheritanceHeir = {
  id: string;
  name: string;
  relation: string;
  sharePercent: number;
  wallet: string;
  verified: boolean;
};

type SurveyCorner = {
  lat: number;
  lng: number;
};

type SurveyForgeryAssessment = {
  ghostPlot: boolean;
  boundaryCreep: boolean;
  notes: string[];
};

type SatelliteProvider = "arcgis" | "mapbox";

type GovernmentSubRole = "surveyor" | "patwari" | "revenueOfficer" | "forestTownPlanner" | "registrar";

type GovernmentRoleProfile = {
  id: GovernmentSubRole;
  title: string;
  subtitle: string;
  uniqueRole: string;
  keyFunction: string;
  digitalAction: string;
  primaryActionLabel: string;
};

type DashboardConfig = {
  title: string;
  description: string;
  quickActions: string[];
  features: AgendaItem[];
  outcomes: string[];
};

type LienStatus = "idle" | "checking" | "clear" | "encumbered";
type EscrowStage =
  | "idle"
  | "funded"
  | "deedTransferred"
  | "lienRecorded"
  | "released";

type BankVerificationState = {
  message: string;
  verified: boolean;
};

type VerificationQueueItem = {
  id: string;
  propertyId: string;
  applicantName: string;
  applicantBiometric: string;
  appliedDate: string;
  status: "pending" | "verified" | "flagged" | "manual-audit";
  fraudScore: number;
  deepfakeAlert: boolean;
  latitude: number;
  longitude: number;
  boundaryOverlapPercent: number;
  documents: string[];
  aiReport: string;
};

type GISRecord = {
  propertyId: string;
  latitude: number;
  longitude: number;
  area: number;
  boundaryPoints: Array<{lat: number; lng: number}>;
  historicalBoundary: Array<{lat: number; lng: number}>;
  lastSatelliteUpdateDate: string;
};

type TaxRecord = {
  propertyId: string;
  stampDuty: number;
  registrationFee: number;
  collected: number;
  remaining: number;
  status: "pending" | "partial" | "complete";
};

// Advanced KYC Type Definitions
type BiometricSample = {
  type: "fingerprint" | "facialRecognition" | "irisScan";
  confidence: number;
  timestamp: string;
  livenessScore: number;
  liveness: "live" | "suspected_spoof" | "unknown";
};

type KYCModule = "biometric" | "zkp" | "fraud" | "multisig" | "compliance" | "nri";

type ZKProofStatus = {
  isAgeVerified: boolean;
  isOwnershipVerified: boolean;
  proofHash: string;
  discretizedScore: number;
};

type FraudIntelligence = {
  deepfakeRisk: number;
  documentForensicsScore: number;
  pixelConsistency: number;
  governmentSealValidation: boolean;
  benamisuspicion: number;
  duplicateRegistrationRisk: number;
  flagsFound: string[];
};

type MultiSigVerification = {
  ownerSignature: {verified: boolean; timestamp: string; dsc: string};
  legalCounselSignature: {verified: boolean; timestamp: string; dsc: string};
  sroSignature: {verified: boolean; timestamp: string; dsc: string};
  transactionValue: number;
  multiSigRequired: boolean;
};

type ComplianceCheck = {
  panLinked: boolean;
  taxCompliant: boolean;
  incomeMatch: boolean;
  moneyLaunderingRisk: number;
  amlFlags: string[];
};

type NRIVerification = {
  nriStatus: boolean;
  consulateVerified: boolean;
  consulate: string;
  powerOfAttorneyVerified: boolean;
  credentialHash: string;
};

const agendaItems: AgendaItem[] = [
  {
    title: "Blockchain Land Registry",
    summary: "Tamper-proof digital records",
    detail:
      "Store ownership events on immutable ledgers to reduce document tampering and strengthen trust across agencies.",
    accent: "#1c8aa3",
  },
  {
    title: "Geo-Tagging and GIS Mapping",
    summary: "Satellite map overlays linked with records",
    detail:
      "Bind property boundaries to geospatial layers so every legal record is mapped against real-world coordinates.",
    accent: "#0f766e",
  },
  {
    title: "Biometric Verification",
    summary: "Fingerprint and face validation",
    detail:
      "Confirm owner identity at onboarding and transfer time to prevent impersonation and unauthorized claims.",
    accent: "#2563eb",
  },
  {
    title: "Smart Contracts",
    summary: "Automated ownership transfers",
    detail:
      "Trigger ownership updates automatically when legal requirements and payment conditions are satisfied.",
    accent: "#d97706",
  },
  {
    title: "QR Code on Property Documents",
    summary: "Real-time government portal verification",
    detail:
      "Attach signed QR references to each deed so officials and citizens can instantly verify authenticity.",
    accent: "#0f172a",
  },
];

const roles: Role[] = ["Government Official", "Bank Officer", "Common User"];

const bankPersonaDetails: Record<
  BankOfficerPersona,
  { title: string; subtitle: string; recommendedDomain: "collateral" | "avm" | "aml" | "escrow" }
> = {
  loanOfficer: {
    title: "Loan Officer",
    subtitle: "Disbursement readiness and collateral safety",
    recommendedDomain: "collateral",
  },
  mortgageUnderwriter: {
    title: "Mortgage Underwriter",
    subtitle: "Value confidence and repayment risk modeling",
    recommendedDomain: "avm",
  },
  fraudInvestigator: {
    title: "Fraud Investigator",
    subtitle: "Forgery patterns, AML controls, and anomaly escalation",
    recommendedDomain: "aml",
  },
};

const governmentRoleProfiles: GovernmentRoleProfile[] = [
  {
    id: "surveyor",
    title: "Surveyor",
    subtitle: "Stage 1: GIS Boundary Validator",
    uniqueRole: "Physical Boundary Authenticator",
    keyFunction:
      "Confirms physical boundaries using GPS/GNSS, drone evidence, and GIS perimeter reconciliation.",
    digitalAction:
      "Uploads validated spatial signature and geofenced digital perimeter to the registry layer.",
    primaryActionLabel: "Complete GIS Boundary Validation",
  },
  {
    id: "patwari",
    title: "Patwari",
    subtitle: "Stage 2: Ground Truth Officer",
    uniqueRole: "Possession Verifier",
    keyFunction:
      "Confirms on-ground possession, occupant details, and actual plot control against field records.",
    digitalAction:
      "Submits Ground Truth attestation with possession note and field confirmation hash.",
    primaryActionLabel: "Submit Ground Truth Attestation",
  },
  {
    id: "revenueOfficer",
    title: "Revenue Officer",
    subtitle: "Stage 3: Financial Record Auditor",
    uniqueRole: "Mutation & Tax Auditor",
    keyFunction:
      "Audits stamp duty and registration fee compliance, and validates Khata/Pahani mutation readiness.",
    digitalAction:
      "Triggers mutation updates after sale and freezes title transfer when unpaid dues are detected.",
    primaryActionLabel: "Confirm Tax & Mutation Stage",
  },
  {
    id: "forestTownPlanner",
    title: "Forest/Town Planner",
    subtitle: "Stage 4: Usage Compliance Officer",
    uniqueRole: "Land-Use Rights Validator",
    keyFunction:
      "Confirms zoning, environmental, and planning permissions for proposed land use.",
    digitalAction:
      "Approves or flags compliance based on forest and urban planning usage constraints.",
    primaryActionLabel: "Validate Usage Rights Compliance",
  },
  {
    id: "registrar",
    title: "Registrar",
    subtitle: "Stage 5: Legal Final Authority",
    uniqueRole: "Blockchain Minting Authority",
    keyFunction:
      "Verifies the ownership chain and legal instruments such as wills, sale deeds, and court orders before final title approval.",
    digitalAction:
      "Applies the private key signature to mint a blockchain deed, then locks the title as state-recognized.",
    primaryActionLabel: "Mint & Lock Blockchain Title",
  },
];

const officeDossier = {
  propertyId: "PROP-2048-NS",
  qrCode: "QR-2048-NS",
  ownerName: "Asha Devi",
  registeredArea: 1200,
  measuredArea: 1163,
  satelliteZone: "ZONE-19A",
  boundaryOverlapPercent: 12,
  biometricToken: "BIO-88-LO",
  passkeyCode: "PK-7719",
  deedHash: "DEED-8F42A1",
  lienBank: "Horizon Bank",
  lienStatus: "clear",
  escrowLimit: 3000000,
  consortiumClear: true,
  registryVersion: "v8.2",
};

// Government Official Verification Queue Mock Data
const verificationQueue: VerificationQueueItem[] = [
  {
    id: "VQ-001",
    propertyId: "PROP-2024-DL-001",
    applicantName: "Rahul Singh",
    applicantBiometric: "BIO-RS-2024",
    appliedDate: "2026-04-05",
    status: "pending",
    fraudScore: 8,
    deepfakeAlert: false,
    latitude: 28.6139,
    longitude: 77.209,
    boundaryOverlapPercent: 5,
    documents: ["deed.pdf", "survey.pdf", "aadhaar.pdf"],
    aiReport: "Property matches cadastral records. Minor boundary variance detected.",
  },
  {
    id: "VQ-002",
    propertyId: "PROP-2024-DL-002",
    applicantName: "Priya Patel",
    applicantBiometric: "BIO-PP-2024",
    appliedDate: "2026-04-03",
    status: "flagged",
    fraudScore: 72,
    deepfakeAlert: true,
    latitude: 28.5244,
    longitude: 77.1855,
    boundaryOverlapPercent: 18,
    documents: ["deed.pdf", "survey.pdf", "aadhaar.pdf"],
    aiReport: "DEEPFAKE DETECTED in applicant biometric. Boundary overlap 18%. Recommending manual audit.",
  },
  {
    id: "VQ-003",
    propertyId: "PROP-2024-DL-003",
    applicantName: "Ajay Kumar",
    applicantBiometric: "BIO-AK-2024",
    appliedDate: "2026-04-01",
    status: "verified",
    fraudScore: 3,
    deepfakeAlert: false,
    latitude: 28.7041,
    longitude: 77.1025,
    boundaryOverlapPercent: 2,
    documents: ["deed.pdf", "survey.pdf", "aadhaar.pdf"],
    aiReport: "All verifications passed. Property authorized for blockchain minting.",
  },
  {
    id: "VQ-004",
    propertyId: "PROP-2024-DL-004",
    applicantName: "Neha Sharma",
    applicantBiometric: "BIO-NS-2024",
    appliedDate: "2026-04-06",
    status: "manual-audit",
    fraudScore: 58,
    deepfakeAlert: false,
    latitude: 28.4595,
    longitude: 77.0829,
    boundaryOverlapPercent: 22,
    documents: ["deed.pdf", "survey.pdf", "aadhaar.pdf"],
    aiReport: "High boundary conflict with adjacent property. Manual field inspection recommended.",
  },
];

const gisRecords: Record<string, GISRecord> = {
  "PROP-2024-DL-001": {
    propertyId: "PROP-2024-DL-001",
    latitude: 28.6139,
    longitude: 77.209,
    area: 2500,
    boundaryPoints: [
      {lat: 28.6139, lng: 77.209},
      {lat: 28.6141, lng: 77.209},
      {lat: 28.6141, lng: 77.2092},
      {lat: 28.6139, lng: 77.2092},
    ],
    historicalBoundary: [
      {lat: 28.6139, lng: 77.209},
      {lat: 28.614, lng: 77.209},
      {lat: 28.614, lng: 77.2091},
      {lat: 28.6139, lng: 77.2091},
    ],
    lastSatelliteUpdateDate: "2026-03-20",
  },
};

const taxRecords: Record<string, TaxRecord> = {
  "PROP-2024-DL-001": {
    propertyId: "PROP-2024-DL-001",
    stampDuty: 150000,
    registrationFee: 25000,
    collected: 0,
    remaining: 175000,
    status: "pending",
  },
  "PROP-2024-DL-002": {
    propertyId: "PROP-2024-DL-002",
    stampDuty: 200000,
    registrationFee: 30000,
    collected: 115000,
    remaining: 115000,
    status: "partial",
  },
  "PROP-2024-DL-003": {
    propertyId: "PROP-2024-DL-003",
    stampDuty: 180000,
    registrationFee: 28000,
    collected: 208000,
    remaining: 0,
    status: "complete",
  },
};

// Advanced KYC Mock Data
const kycBiometricData: Record<string, BiometricSample[]> = {
  "BIO-RS-2024": [
    {type: "fingerprint", confidence: 98, timestamp: "2026-04-05 10:15", livenessScore: 96, liveness: "live"},
    {type: "facialRecognition", confidence: 94, timestamp: "2026-04-05 10:16", livenessScore: 92, liveness: "live"},
    {type: "irisScan", confidence: 99, timestamp: "2026-04-05 10:17", livenessScore: 98, liveness: "live"},
  ],
  "BIO-PP-2024": [
    {type: "fingerprint", confidence: 62, timestamp: "2026-04-03 09:45", livenessScore: 35, liveness: "suspected_spoof"},
    {type: "facialRecognition", confidence: 72, timestamp: "2026-04-03 09:46", livenessScore: 28, liveness: "suspected_spoof"},
    {type: "irisScan", confidence: 45, timestamp: "2026-04-03 09:47", livenessScore: 32, liveness: "suspected_spoof"},
  ],
};

const kycZKProofData: Record<string, ZKProofStatus> = {
  "PROP-2024-DL-001": {
    isAgeVerified: true,
    isOwnershipVerified: true,
    proofHash: "0x7F3A9B2C4E6D1A8F5B3C2E1D9F4A7B6C",
    discretizedScore: 95,
  },
  "PROP-2024-DL-002": {
    isAgeVerified: false,
    isOwnershipVerified: false,
    proofHash: "0x0000000000000000000000000000000000000000",
    discretizedScore: 12,
  },
};

const kycFraudData: Record<string, FraudIntelligence> = {
  "PROP-2024-DL-001": {
    deepfakeRisk: 3,
    documentForensicsScore: 98,
    pixelConsistency: 99,
    governmentSealValidation: true,
    benamisuspicion: 2,
    duplicateRegistrationRisk: 1,
    flagsFound: [],
  },
  "PROP-2024-DL-002": {
    deepfakeRisk: 87,
    documentForensicsScore: 34,
    pixelConsistency: 28,
    governmentSealValidation: false,
    benamisuspicion: 72,
    duplicateRegistrationRisk: 65,
    flagsFound: ["Deepfake detected in facial biometric", "Government seal shows Photoshop artifacts", "Possible benami transaction pattern"],
  },
};

const kycMultiSigData: Record<string, MultiSigVerification> = {
  "PROP-2024-DL-001": {
    ownerSignature: {verified: true, timestamp: "2026-04-05 11:00", dsc: "DSC-OWNER-001"},
    legalCounselSignature: {verified: false, timestamp: "", dsc: ""},
    sroSignature: {verified: false, timestamp: "", dsc: ""},
    transactionValue: 2500000,
    multiSigRequired: true,
  },
};

const kycComplianceData: Record<string, ComplianceCheck> = {
  "PROP-2024-DL-001": {
    panLinked: true,
    taxCompliant: true,
    incomeMatch: true,
    moneyLaunderingRisk: 5,
    amlFlags: [],
  },
  "PROP-2024-DL-002": {
    panLinked: false,
    taxCompliant: false,
    incomeMatch: false,
    moneyLaunderingRisk: 78,
    amlFlags: ["Income-to-property value mismatch (5x declared income)", "PAN not linked to applicant", "Previous transaction flagged by tax authorities"],
  },
};

const kycNRIData: Record<string, NRIVerification> = {
  "PROP-2024-DL-003": {
    nriStatus: true,
    consulateVerified: true,
    consulate: "Indian High Commission, London",
    powerOfAttorneyVerified: true,
    credentialHash: "0x5C8D3A1F7E9B4C2A6F3E1D8C5A9B2F7E",
  },
};

const dashboardByRole: Record<Role, DashboardConfig> = {
  "Government Official": {
    title: "Government Command Dashboard",
    description:
      "Approve, audit, and enforce secure land transfer compliance across districts.",
    quickActions: [
      "Approve pending transfer cases",
      "Audit tamper-proof ledger history",
      "Validate geotag boundary disputes",
    ],
    features: [agendaItems[0], agendaItems[1], agendaItems[2], agendaItems[4]],
    outcomes: [
      "Reduced title disputes with immutable records",
      "Faster inter-department verification",
      "Stronger legal evidence trail for courts",
    ],
  },
  "Bank Officer": {
    title: "Bank Risk Dashboard",
    description:
      "Authenticate collateral and validate ownership before mortgage and lien approvals.",
    quickActions: [
      "Run collateral authenticity checks",
      "Verify owner biometrics before disbursement",
      "Track smart-contract transfer milestones",
    ],
    features: [agendaItems[0], agendaItems[2], agendaItems[3], agendaItems[4]],
    outcomes: [
      "Lower lending fraud and impersonation risk",
      "Faster property-backed loan due diligence",
      "Reliable cross-checking with government records",
    ],
  },
  "Common User": {
    title: "Citizen Property Dashboard",
    description:
      "Track ownership status, verify documents, and monitor transfer progress in real time.",
    quickActions: [
      "Verify deed authenticity via QR",
      "Submit ownership correction request",
      "Monitor registration progress instantly",
    ],
    features: [agendaItems[1], agendaItems[2], agendaItems[3], agendaItems[4]],
    outcomes: [
      "Greater trust in digital property records",
      "Simpler self-service ownership validation",
      "Fewer manual visits for document checks",
    ],
  },
};

const getDashboardView = (role: Role): View => {
  if (role === "Government Official") {
    return "governmentDashboard";
  }
  if (role === "Bank Officer") {
    return "bankDashboard";
  }
  return "userDashboard";
};

const isDashboardView = (view: View): boolean =>
  view === "governmentDashboard" || view === "governmentStagePage" || view === "bankDashboard" || view === "userDashboard";

function App() {
  const [view, setView] = useState<View>("login");
  const [authDomain, setAuthDomain] = useState<Role>("Government Official");
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    role: "Government Official" as Role,
  });
  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "Common User" as Role,
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [pendingRole, setPendingRole] = useState<Role | null>(null);
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanConfidence, setScanConfidence] = useState(0);
  const [scanError, setScanError] = useState("");
  const [antiSpoofStatus, setAntiSpoofStatus] = useState<"idle" | "checking" | "live" | "suspected_spoof" | "unknown">("idle");
  const [motionScore, setMotionScore] = useState(0);
  const [livenessChallenge, setLivenessChallenge] = useState("Turn head slowly left-right and blink once.");
  const [propertyReference, setPropertyReference] = useState("");
  const [lienStatus, setLienStatus] = useState<LienStatus>("idle");
  const [lienMessage, setLienMessage] = useState(
    "Enter Property ID or scan QR to run on-chain lien lookup."
  );
  const [digitalTwinTimestamp, setDigitalTwinTimestamp] = useState("Not audited yet");
  const [valuationRiskScore, setValuationRiskScore] = useState(0);
  const [encroachmentDetected, setEncroachmentDetected] = useState(false);
  const [claimedArea, setClaimedArea] = useState("1200");
  const [measuredArea, setMeasuredArea] = useState<number | null>(null);
  const [buildingExists, setBuildingExists] = useState<boolean | null>(null);
  const [overlapPercent, setOverlapPercent] = useState<number | null>(null);
  const [surveyZoneInput, setSurveyZoneInput] = useState("");
  const [identityMessage, setIdentityMessage] = useState(
    "Biometric and passkey authentication pending."
  );
  const [biometricMatchScore, setBiometricMatchScore] = useState<number | null>(null);
  const [passkeySigned, setPasskeySigned] = useState(false);
  const [biometricTokenInput, setBiometricTokenInput] = useState("");
  const [passkeyInput, setPasskeyInput] = useState("");
  const [agreementHash, setAgreementHash] = useState("--");
  const [loanAmount, setLoanAmount] = useState("2500000");
  const [sellerNameInput, setSellerNameInput] = useState("");
  const [escrowStage, setEscrowStage] = useState<EscrowStage>("idle");
  const [escrowLedger, setEscrowLedger] = useState<string[]>([]);
  const [docIntegrity, setDocIntegrity] = useState<"unknown" | "valid" | "tampered">(
    "unknown"
  );
  const [deedHashInput, setDeedHashInput] = useState("");
  const [consortiumVerdict, setConsortiumVerdict] = useState(
    "No consortium check performed yet."
  );
  const [consortiumBankInput, setConsortiumBankInput] = useState("");
  const [monitorMode, setMonitorMode] = useState(false);
  const [monitorEvents, setMonitorEvents] = useState<string[]>([]);
  const [advancedAlerts, setAdvancedAlerts] = useState<string[]>([]);
  const [monitorThresholdInput, setMonitorThresholdInput] = useState("3");
  const [bankFeaturePage, setBankFeaturePage] = useState(0);
  const [bankVerificationState, setBankVerificationState] = useState<BankVerificationState>({
    message: "Enter the office document values to begin automatic verification.",
    verified: false,
  });

  // Government Official Dashboard State
  const [selectedQueueItem, setSelectedQueueItem] = useState<VerificationQueueItem | null>(verificationQueue[0]);
  const [updatedQueue, setUpdatedQueue] = useState<VerificationQueueItem[]>(verificationQueue);
  const [selectedGIS, setSelectedGIS] = useState<GISRecord | null>(
    selectedQueueItem ? gisRecords[selectedQueueItem.propertyId] : null
  );
  const [selectedTax, setSelectedTax] = useState<TaxRecord | null>(
    selectedQueueItem ? taxRecords[selectedQueueItem.propertyId] : null
  );
  const [inspectorTab, setInspectorTab] = useState<"queue" | "gis" | "kycD" | "ledger">("queue");
  const [contractPaused, setContractPaused] = useState<Record<string, boolean>>({});
  const [auditNotes, setAuditNotes] = useState("");
  const [showSatelliteHistory, setShowSatelliteHistory] = useState(false);

  // Advanced Dashboard State
  const [sidebarNav, setSidebarNav] = useState<string>("overview");
  const [operationStats, setOperationStats] = useState({
    totalQueued: verificationQueue.length,
    pendingApprovals: verificationQueue.filter(q => q.status === "pending").length,
    flaggedCases: verificationQueue.filter(q => q.status === "flagged").length,
    completedToday: verificationQueue.filter(q => q.status === "verified").length,
    auditInProgress: verificationQueue.filter(q => q.status === "manual-audit").length,
  });
  const [recentAlerts, setRecentAlerts] = useState<string[]>(
    ["System initialized at " + new Date().toLocaleTimeString(), "All verification queues active"]
  );
  const [bankOperationPhase, setBankOperationPhase] = useState<string>("Idle");
  const [bankPersona, setBankPersona] = useState<BankOfficerPersona>("loanOfficer");
  const [govWorkflowStatus, setGovWorkflowStatus] = useState<Record<GovernmentSubRole, "pending" | "completed">>({
    surveyor: "pending",
    patwari: "pending",
    revenueOfficer: "pending",
    forestTownPlanner: "pending",
    registrar: "pending",
  });
  const [activeGovernmentStage, setActiveGovernmentStage] = useState<GovernmentSubRole>("surveyor");
  const [surveyorLatInput, setSurveyorLatInput] = useState("");
  const [surveyorLngInput, setSurveyorLngInput] = useState("");
  const [surveyorCorners, setSurveyorCorners] = useState<SurveyCorner[]>([]);
  const [surveyorAssessment, setSurveyorAssessment] = useState<SurveyForgeryAssessment>({
    ghostPlot: true,
    boundaryCreep: false,
    notes: ["Record at least four GNSS corners to start validation."],
  });
  const [gisSignatureHash, setGisSignatureHash] = useState("");
  const [satelliteImageUrl, setSatelliteImageUrl] = useState("");
  const [satelliteBaselineUrl, setSatelliteBaselineUrl] = useState("");
  const [satelliteLastCaptureAt, setSatelliteLastCaptureAt] = useState("Never");
  const [satelliteChangeScore, setSatelliteChangeScore] = useState(0);
  const [satelliteAutoMonitor, setSatelliteAutoMonitor] = useState(false);
  const [satelliteAlertState, setSatelliteAlertState] = useState<"idle" | "stable" | "change">("idle");
  const [satelliteMonitorBusy, setSatelliteMonitorBusy] = useState(false);
  const [satelliteProvider, setSatelliteProvider] = useState<SatelliteProvider>("arcgis");
  const [satelliteProviderHealth, setSatelliteProviderHealth] = useState("ArcGIS live feed active.");
  const [satelliteAutoIntervalSec, setSatelliteAutoIntervalSec] = useState("30");
  const [lockedCoordinateClaims, setLockedCoordinateClaims] = useState<Record<string, string>>({});
  const [syncAutoMode, setSyncAutoMode] = useState(true);
  const [lastSyncAt, setLastSyncAt] = useState("Not synced");

  // Common User State
  const [lockerDocs, setLockerDocs] = useState<LandLockerDoc[]>([
    { id: "DOC-1", name: "Mother Deed 1998", category: "Mother Deed", encrypted: true, uploadedAt: "2026-01-12" },
    { id: "DOC-2", name: "Tax Receipt FY 2025", category: "Tax Receipt", encrypted: true, uploadedAt: "2026-03-22" },
    { id: "DOC-3", name: "EC 15 Years", category: "Encumbrance Certificate", encrypted: true, uploadedAt: "2026-04-01" },
  ]);
  const [lockerDocName, setLockerDocName] = useState("");
  const [lockerDocCategory, setLockerDocCategory] = useState<LandLockerDoc["category"]>("Other");
  const [voiceQuery, setVoiceQuery] = useState("");
  const [voiceAnswer, setVoiceAnswer] = useState("Say: 'show my EC' or 'show tax receipts' to fetch records quickly.");

  const [bhuAlerts, setBhuAlerts] = useState<BhuAadhaarAlert[]>([]);
  const [titleFreezeActive, setTitleFreezeActive] = useState(false);

  const [vigilanceReports, setVigilanceReports] = useState<VigilanceReport[]>([]);
  const [vigilanceIssue, setVigilanceIssue] = useState("");

  const [buyerQrInput, setBuyerQrInput] = useState("");
  const [buyerGpsInput, setBuyerGpsInput] = useState("");
  const [oneTapResult, setOneTapResult] = useState<OneTapVerification | null>(null);
  const [heirNameInput, setHeirNameInput] = useState("");
  const [heirRelationInput, setHeirRelationInput] = useState("Son");
  const [heirShareInput, setHeirShareInput] = useState("50");
  const [heirWalletInput, setHeirWalletInput] = useState("");
  const [inheritanceHeirs, setInheritanceHeirs] = useState<InheritanceHeir[]>([
    {
      id: "HEIR-1",
      name: "Aarav Sharma",
      relation: "Son",
      sharePercent: 50,
      wallet: "0xAARAVD4E2",
      verified: true,
    },
    {
      id: "HEIR-2",
      name: "Anika Sharma",
      relation: "Daughter",
      sharePercent: 50,
      wallet: "0xANIKA91BF",
      verified: true,
    },
  ]);
  const [digitalWillLocked, setDigitalWillLocked] = useState(false);
  const [digitalWillHash, setDigitalWillHash] = useState("Not locked");
  const [deadManSwitchArmed, setDeadManSwitchArmed] = useState(false);
  const [lastOwnerCheckIn, setLastOwnerCheckIn] = useState("Not checked in");
  const [inactivityWindowDays, setInactivityWindowDays] = useState("30");
  const [deathCertificateInput, setDeathCertificateInput] = useState("");
  const [deathCertificateVerified, setDeathCertificateVerified] = useState(false);
  const [autoTransferExecuted, setAutoTransferExecuted] = useState(false);
  const [inheritanceLog, setInheritanceLog] = useState<string[]>([]);

  // Advanced KYC State Management
  const [kycModule, setKycModule] = useState<KYCModule>("biometric");
  const [kycSelectedProperty, setKycSelectedProperty] = useState<string>("PROP-2024-DL-001");
  const [biometricVerificationResults, setBiometricVerificationResults] = useState<BiometricSample[]>(
    kycBiometricData["BIO-RS-2024"] || []
  );
  const [zkProofStatus, setZkProofStatus] = useState<ZKProofStatus>(
    kycZKProofData[kycSelectedProperty] || {
      isAgeVerified: false,
      isOwnershipVerified: false,
      proofHash: "",
      discretizedScore: 0,
    }
  );
  const [fraudIntelligence, setFraudIntelligence] = useState<FraudIntelligence>(
    kycFraudData[kycSelectedProperty] || {
      deepfakeRisk: 0,
      documentForensicsScore: 0,
      pixelConsistency: 0,
      governmentSealValidation: false,
      benamisuspicion: 0,
      duplicateRegistrationRisk: 0,
      flagsFound: [],
    }
  );
  const [multiSigStatus, setMultiSigStatus] = useState<MultiSigVerification>(
    kycMultiSigData[kycSelectedProperty] || {
      ownerSignature: {verified: false, timestamp: "", dsc: ""},
      legalCounselSignature: {verified: false, timestamp: "", dsc: ""},
      sroSignature: {verified: false, timestamp: "", dsc: ""},
      transactionValue: 0,
      multiSigRequired: false,
    }
  );
  const [complianceCheck, setComplianceCheck] = useState<ComplianceCheck>(
    kycComplianceData[kycSelectedProperty] || {
      panLinked: false,
      taxCompliant: false,
      incomeMatch: false,
      moneyLaunderingRisk: 0,
      amlFlags: [],
    }
  );
  const [nriVerification, setNriVerification] = useState<NRIVerification>(
    kycNRIData[kycSelectedProperty] || {
      nriStatus: false,
      consulateVerified: false,
      consulate: "",
      powerOfAttorneyVerified: false,
      credentialHash: "",
    }
  );

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const bankAdvanceTimerRef = useRef<number | null>(null);
  const livenessCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const bankFeatureTitles = [
    "Instant Lien and Encumbrance Check",
    "Verified Asset Valuation",
    "Encroachment Detection",
    "Identity and Signature Authentication",
    "Smart Escrow Secure Disbursement",
    "Document Integrity and Forgery Detection",
    "Cross-Bank Consortium Duplication Guard",
    "Advanced AI Risk and Continuous Monitoring",
  ];

  const clearBankAdvanceTimer = () => {
    if (bankAdvanceTimerRef.current !== null) {
      window.clearTimeout(bankAdvanceTimerRef.current);
      bankAdvanceTimerRef.current = null;
    }
  };

  const queueBankAdvance = (message: string) => {
    clearBankAdvanceTimer();
    setBankVerificationState({ message, verified: true });

    if (bankFeaturePage < bankFeatureTitles.length - 1) {
      bankAdvanceTimerRef.current = window.setTimeout(() => {
        setBankFeaturePage((previous) => Math.min(previous + 1, bankFeatureTitles.length - 1));
      }, 1400);
    } else {
      setStatusMessage("All office verification steps are complete.");
    }
  };

  const authHighlights: Record<"login" | "register", string[]> = {
    login: [
      "Role-based access for government, bank, and citizen workflows",
      "Biometric confirmation before any dashboard unlock",
      "Live transaction-grade validation with secure session flow",
    ],
    register: [
      "Create a verified account with role selection",
      "Prepare identity onboarding before biometric scan",
      "Keep all land actions traceable and auditable",
    ],
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const runAntiSpoofCheck = () => {
    if (!videoRef.current) {
      setAntiSpoofStatus("unknown");
      setStatusMessage("Liveness check unavailable: no camera feed detected.");
      return;
    }

    const video = videoRef.current;
    const canvas = livenessCanvasRef.current || document.createElement("canvas");
    livenessCanvasRef.current = canvas;

    const width = Math.max(160, Math.floor(video.videoWidth / 2));
    const height = Math.max(120, Math.floor(video.videoHeight / 2));
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) {
      setAntiSpoofStatus("unknown");
      setStatusMessage("Liveness check unavailable: frame analyzer failed to initialize.");
      return;
    }

    const challengePool = [
      "Turn head slowly left-right and blink once.",
      "Move closer to camera then move back.",
      "Raise eyebrows and turn slightly to the right.",
    ];
    setLivenessChallenge(challengePool[Math.floor(Math.random() * challengePool.length)]);
    setAntiSpoofStatus("checking");

    let previousGray: Uint8Array | null = null;
    let samples = 0;
    let diffAccumulator = 0;
    let peakDiff = 0;

    const capture = () => {
      context.drawImage(video, 0, 0, width, height);
      const frame = context.getImageData(0, 0, width, height).data;
      const gray = new Uint8Array(width * height);
      for (let idx = 0; idx < gray.length; idx += 1) {
        const px = idx * 4;
        gray[idx] = Math.round((frame[px] * 0.299) + (frame[px + 1] * 0.587) + (frame[px + 2] * 0.114));
      }

      if (previousGray) {
        let diff = 0;
        let count = 0;
        for (let idx = 0; idx < gray.length; idx += 24) {
          diff += Math.abs(gray[idx] - previousGray[idx]);
          count += 1;
        }
        const meanDiff = count > 0 ? diff / count : 0;
        diffAccumulator += meanDiff;
        peakDiff = Math.max(peakDiff, meanDiff);
      }

      previousGray = gray;
      samples += 1;

      if (samples < 9) {
        window.setTimeout(capture, 220);
        return;
      }

      const avgDiff = diffAccumulator / Math.max(1, samples - 1);
      const score = Math.round(Math.min(99, (avgDiff * 5) + (peakDiff * 2)));
      setMotionScore(score);

      const likelyLive = avgDiff > 6 && peakDiff > 10 && avgDiff < 70;
      setAntiSpoofStatus(likelyLive ? "live" : "suspected_spoof");
      setStatusMessage(
        likelyLive
          ? "Liveness verified: real user presence confirmed."
          : "Anti-spoof warning: low natural motion detected. Re-run scan."
      );
    };

    capture();
  };

  const startBiometricScan = async () => {
    if (isScanning || scanProgress >= 100) {
      return;
    }

    setScanError("");
    setIsScanning(true);
    setAntiSpoofStatus("idle");
    setMotionScore(0);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        void videoRef.current.play();
      }
    } catch {
      setScanError("Camera access denied. Using secure simulated biometric stream.");
    }
  };

  useEffect(() => {
    if (view !== "biometric" || !isScanning) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setScanProgress((previous) => {
        const increment = Math.floor(Math.random() * 16) + 8;
        const next = Math.min(previous + increment, 100);
        const confidence = Math.min(75 + Math.floor(next * 0.24), 99);
        setScanConfidence(confidence);

        if (next >= 100) {
          window.clearInterval(intervalId);
          setIsScanning(false);
          setStatusMessage("Real-time biometric scan completed. You can now confirm.");
        }
        return next;
      });
    }, 500);

    return () => window.clearInterval(intervalId);
  }, [view, isScanning]);

  useEffect(() => {
    if (view !== "biometric") {
      return;
    }
    if (scanProgress >= 100 && antiSpoofStatus === "idle" && !scanError) {
      runAntiSpoofCheck();
    }
  }, [view, scanProgress, antiSpoofStatus, scanError]);

  useEffect(() => {
    if (view === "biometric") {
      void startBiometricScan();
      return;
    }
    stopCamera();
    setIsScanning(false);
  }, [view]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    setLoginData((previous) => ({ ...previous, role: authDomain }));
    setRegisterData((previous) => ({ ...previous, role: authDomain }));
  }, [authDomain]);

  const handleLoginSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPendingRole(authDomain);
    setActiveRole(null);
    setScanProgress(0);
    setScanConfidence(0);
    setScanError("");
    setView("biometric");
    setStatusMessage(
      `Credentials accepted for ${authDomain}. Proceed to biometric scan page.`
    );
  };

  const handleRegisterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(
      `Registration created for ${authDomain}. You can now login and verify biometrics.`
    );
    setView("login");
  };

  const handleBiometricConfirm = () => {
    if (!pendingRole || scanProgress < 100 || antiSpoofStatus !== "live") {
      return;
    }
    stopCamera();
    setIsScanning(false);
    setActiveRole(pendingRole);
    setPendingRole(null);
    if (pendingRole === "Bank Officer") {
      resetBankWorkflow();
    }
    setView(getDashboardView(pendingRole));
    setStatusMessage(`Biometric verified. ${pendingRole} dashboard unlocked.`);
  };

  const startDomainAccess = (role: Role, mode: "login" | "register") => {
    setAuthDomain(role);
    setPendingRole(role);
    setActiveRole(null);
    setScanProgress(0);
    setScanConfidence(0);
    setScanError("");
    setStatusMessage(mode === "register" ? `${role} registration initiated. Proceeding to biometric verification.` : "");
    setView("biometric");
  };

  const openGovernmentStageDirectly = (stage: GovernmentSubRole) => {
    setAuthDomain("Government Official");
    setActiveRole("Government Official");
    setPendingRole(null);
    setActiveGovernmentStage(stage);
    setSidebarNav(stage);
    if (updatedQueue[0]?.propertyId) {
      syncPropertyContext(updatedQueue[0].propertyId);
    }
    setView("governmentStagePage");
    setStatusMessage(`Direct stage access: ${stage} workbench opened.`);
  };

  const renderGovernmentRoleWorkbench = (stage: GovernmentSubRole) => (
    <section className="inspector-dashboard">
      <article className="inspector-module official-roles-suite">
        <div className="module-header">
          <h4>🏛️ {governmentRoleProfiles.find((profile) => profile.id === stage)?.title} Workbench</h4>
          <p>Dedicated controls for this authority role with independent operational accountability.</p>
        </div>

        <div className="gov-workflow-strip">
          {governmentRoleProfiles.map((profile) => (
            <div
              key={profile.id}
              className={
                "gov-workflow-step" +
                (govWorkflowStatus[profile.id] === "completed" ? " completed" : "") +
                (stage === profile.id ? " active" : "")
              }
            >
              <span className="gov-step-title">{profile.title}</span>
              <span className="gov-step-state">{govWorkflowStatus[profile.id] === "completed" ? "Completed" : "Pending"}</span>
            </div>
          ))}
        </div>

        {governmentRoleProfiles
          .filter((profile) => profile.id === stage)
          .map((profile) => (
            <article key={profile.id} className="official-role-card">
              <h5>{profile.title}</h5>
              <p className="official-role-subtitle">{profile.subtitle}</p>
              <p><strong>Unique Role:</strong> {profile.uniqueRole}</p>
              <p><strong>Key Function:</strong> {profile.keyFunction}</p>
              <p><strong>Digital Action:</strong> {profile.digitalAction}</p>
              {profile.id === "surveyor" && (
                <div className="surveyor-feature-panel">
                  <p><strong>Primary Responsibility:</strong> Digital Perimeter Validation.</p>
                  <p><strong>Forgery Prevention:</strong> Stops Ghost Plots and Boundary Creep before legal progression.</p>

                  <div className="surveyor-input-row">
                    <input
                      type="number"
                      step="0.000001"
                      placeholder="Latitude"
                      value={surveyorLatInput}
                      onChange={(event) => setSurveyorLatInput(event.target.value)}
                    />
                    <input
                      type="number"
                      step="0.000001"
                      placeholder="Longitude"
                      value={surveyorLngInput}
                      onChange={(event) => setSurveyorLngInput(event.target.value)}
                    />
                    <button className="btn-approve" type="button" onClick={recordSurveyCorner}>
                      Record GNSS Corner
                    </button>
                  </div>

                  <div className="surveyor-action-row">
                    <button className="btn-audit" type="button" onClick={runSurveyForgeryAnalysis}>
                      Run Ghost/Boundary Creep Check
                    </button>
                    <button className="btn-approve" type="button" onClick={uploadGisSignature}>
                      Upload GIS Signature
                    </button>
                  </div>

                  <ul className="surveyor-corner-list">
                    {surveyorCorners.length === 0 && <li>No corners captured yet.</li>}
                    {surveyorCorners.map((corner, index) => (
                      <li key={`${corner.lat}-${corner.lng}-${index}`}>
                        Corner {index + 1}: {corner.lat.toFixed(6)}, {corner.lng.toFixed(6)}
                      </li>
                    ))}
                  </ul>

                  <div className="surveyor-assessment-box">
                    <p><strong>Ghost Plot:</strong> {surveyorAssessment.ghostPlot ? "Risk Detected" : "Clear"}</p>
                    <p><strong>Boundary Creep:</strong> {surveyorAssessment.boundaryCreep ? "Risk Detected" : "Clear"}</p>
                    <p><strong>GIS Signature:</strong> {gisSignatureHash || "Not Uploaded"}</p>
                    <ul>
                      {surveyorAssessment.notes.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="surveyor-satellite-panel">
                    <div className="satellite-provider-row">
                      <label htmlFor="sat-provider">Provider</label>
                      <select
                        id="sat-provider"
                        className="satellite-provider-select"
                        value={satelliteProvider}
                        onChange={(event) => setSatelliteProvider(event.target.value as SatelliteProvider)}
                      >
                        <option value="arcgis">ArcGIS World Imagery (Public)</option>
                        <option value="mapbox">Mapbox Satellite (Token)</option>
                      </select>
                      <label htmlFor="sat-interval">Auto Monitor (sec)</label>
                      <select
                        id="sat-interval"
                        className="satellite-provider-select"
                        value={satelliteAutoIntervalSec}
                        onChange={(event) => setSatelliteAutoIntervalSec(event.target.value)}
                      >
                        <option value="15">15</option>
                        <option value="30">30</option>
                        <option value="60">60</option>
                      </select>
                    </div>
                    <div className="surveyor-action-row">
                      <button className="btn-audit" type="button" onClick={refreshRealSatelliteFrame}>
                        Fetch Real Satellite Frame
                      </button>
                      <button className="btn-approve" type="button" onClick={captureSatelliteBaseline}>
                        Capture Baseline
                      </button>
                      <button className="btn-audit" type="button" onClick={() => void runSatelliteChangeDetection()} disabled={satelliteMonitorBusy}>
                        {satelliteMonitorBusy ? "Analyzing..." : "Detect Change"}
                      </button>
                      <button
                        className="btn-approve"
                        type="button"
                        onClick={() => setSatelliteAutoMonitor((previous) => !previous)}
                        disabled={!satelliteBaselineUrl}
                      >
                        {satelliteAutoMonitor ? "Stop Auto Monitor" : "Start Auto Monitor"}
                      </button>
                    </div>

                    <p>
                      <strong>Data Source:</strong> {satelliteProvider === "mapbox" ? "Mapbox Satellite" : "ArcGIS World Imagery"} (real imagery) | <strong>Last Capture:</strong> {satelliteLastCaptureAt}
                    </p>
                    <p className="risk-note">Provider Health: {satelliteProviderHealth}</p>
                    <p className={satelliteAlertState === "change" ? "risk-bad" : satelliteAlertState === "stable" ? "risk-good" : "risk-note"}>
                      Change Score: {satelliteChangeScore}% | Status: {satelliteAlertState === "change" ? "CHANGE ALERT" : satelliteAlertState === "stable" ? "Stable" : "Idle"}
                    </p>

                    {satelliteImageUrl && (
                      <div className="real-sat-frame-wrap">
                        <img className="real-sat-frame" src={satelliteImageUrl} alt="Real satellite imagery for active survey parcel" />
                      </div>
                    )}

                    <div className="surveyor-digital-survey-box">
                      <h6>Digital Survey Overlay</h6>
                      <svg viewBox="0 0 300 160" className="surveyor-digital-survey-svg" role="img" aria-label="Digital survey polygon overlay">
                        <rect x="1" y="1" width="298" height="158" rx="10" ry="10" />
                        {getActiveSurveyPoints().length >= 3 && (
                          <polygon points={toSurveySvgPoints(getActiveSurveyPoints())} />
                        )}
                      </svg>
                      <ul className="surveyor-corner-list">
                        {getActiveSurveyPoints().length === 0 && <li>No digital survey points available.</li>}
                        {getActiveSurveyPoints().map((point, index) => (
                          <li key={`${point.lat}-${point.lng}-${index}`}>
                            Plot Point {index + 1}: {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              <button
                className="btn-approve"
                onClick={() => executeGovernmentRoleAction(profile.id)}
                type="button"
              >
                {profile.primaryActionLabel}
              </button>
            </article>
          ))}
      </article>
    </section>
  );

  const handleLogout = () => {
    stopCamera();
    setView("login");
    setPendingRole(null);
    setActiveRole(null);
    setIsScanning(false);
    setScanProgress(0);
    setScanConfidence(0);
    setScanError("");
    setLoginData((previous) => ({ ...previous, password: "" }));
    setStatusMessage("You have been logged out.");
  };

  const syncPropertyContext = (propertyId: string, announce = false) => {
    const queueItem = updatedQueue.find((item) => item.propertyId === propertyId) || null;
    if (queueItem) {
      setSelectedQueueItem(queueItem);
    }
    setSelectedGIS(gisRecords[propertyId] || null);
    setSelectedTax(taxRecords[propertyId] || null);
    if (kycSelectedProperty !== propertyId) {
      switchKycProperty(propertyId);
    }
    const syncTime = new Date().toLocaleTimeString();
    setLastSyncAt(syncTime);
    if (announce) {
      setRecentAlerts((previous) => [`[${syncTime}] Sync engine reconciled all modules for ${propertyId}`, ...previous].slice(0, 10));
      setStatusMessage(`Reconciliation complete for ${propertyId}. All modules are synced.`);
    }
  };

  const runSyncReconciliation = () => {
    const propertyId = selectedQueueItem?.propertyId || updatedQueue[0]?.propertyId;
    if (!propertyId) {
      setStatusMessage("No property context available for reconciliation.");
      return;
    }
    syncPropertyContext(propertyId, true);
  };

  const resetBankWorkflow = () => {
    setPropertyReference("");
    setLienStatus("idle");
    setLienMessage("Enter Property ID or scan QR to run on-chain lien lookup.");
    setDigitalTwinTimestamp("Not audited yet");
    setValuationRiskScore(0);
    setEncroachmentDetected(false);
    setClaimedArea("1200");
    setMeasuredArea(null);
    setBuildingExists(null);
    setOverlapPercent(null);
    setSurveyZoneInput("");
    setIdentityMessage("Biometric and passkey authentication pending.");
    setBiometricMatchScore(null);
    setPasskeySigned(false);
    setBiometricTokenInput("");
    setPasskeyInput("");
    setAgreementHash("--");
    setLoanAmount("2500000");
    setSellerNameInput("");
    setEscrowStage("idle");
    setEscrowLedger([]);
    setDocIntegrity("unknown");
    setDeedHashInput("");
    setConsortiumVerdict("No consortium check performed yet.");
    setConsortiumBankInput("");
    setMonitorMode(false);
    setMonitorEvents([]);
    setAdvancedAlerts([]);
    setMonitorThresholdInput("3");
    setBankFeaturePage(0);
    setBankVerificationState({
      message: "Enter the office document values to begin automatic verification.",
      verified: false,
    });
    clearBankAdvanceTimer();
  };

  useEffect(() => {
    setOperationStats({
      totalQueued: updatedQueue.length,
      pendingApprovals: updatedQueue.filter((q) => q.status === "pending").length,
      flaggedCases: updatedQueue.filter((q) => q.status === "flagged").length,
      completedToday: updatedQueue.filter((q) => q.status === "verified").length,
      auditInProgress: updatedQueue.filter((q) => q.status === "manual-audit").length,
    });
  }, [updatedQueue]);

  useEffect(() => {
    if (!syncAutoMode || !selectedQueueItem) {
      return;
    }
    const propertyId = selectedQueueItem.propertyId;
    setSelectedGIS(gisRecords[propertyId] || null);
    setSelectedTax(taxRecords[propertyId] || null);
    if (kycSelectedProperty !== propertyId) {
      switchKycProperty(propertyId);
    }
    setLastSyncAt(new Date().toLocaleTimeString());
  }, [selectedQueueItem, syncAutoMode]);

  useEffect(() => {
    if (!satelliteAutoMonitor) {
      return;
    }

    refreshRealSatelliteFrame();
    const intervalSeconds = Math.max(10, Number(satelliteAutoIntervalSec) || 30);
    const timer = window.setInterval(() => {
      void runSatelliteChangeDetection();
    }, intervalSeconds * 1000);

    return () => window.clearInterval(timer);
  }, [satelliteAutoMonitor, satelliteBaselineUrl, selectedQueueItem, surveyorCorners, satelliteAutoIntervalSec, satelliteProvider]);

  const moveBankFeaturePage = (direction: "next" | "prev") => {
    setBankFeaturePage((previous) => {
      if (direction === "prev") {
        return Math.max(0, previous - 1);
      }
      return Math.min(bankFeatureTitles.length - 1, previous + 1);
    });
  };

  useEffect(() => {
    clearBankAdvanceTimer();
    setBankVerificationState({
      message: "Enter the office document values to begin automatic verification.",
      verified: false,
    });
  }, [bankFeaturePage]);

  const simulateQrScan = () => {
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    setPropertyReference(`PROP-QR-${randomCode}`);
    setStatusMessage("QR scanned successfully. Property reference populated.");
  };

  // Government Official Handlers
  const updateQueueItemStatus = (itemId: string, newStatus: "verified" | "flagged" | "manual-audit") => {
    const updated = updatedQueue.map((item) =>
      item.id === itemId ? { ...item, status: newStatus } : item
    );
    setUpdatedQueue(updated);
    if (selectedQueueItem?.id === itemId) {
      setSelectedQueueItem({ ...selectedQueueItem, status: newStatus });
    }
    const timestamp = new Date().toLocaleTimeString();
    const alert = `[${timestamp}] Property ${itemId} marked as ${newStatus.toUpperCase()}`;
    setRecentAlerts((prev) => [alert, ...prev].slice(0, 10));
    setStatusMessage(`Property ${itemId} marked as ${newStatus}.`);
  };

  const toggleContractPause = (propertyId: string) => {
    setContractPaused((previous) => ({
      ...previous,
      [propertyId]: !previous[propertyId],
    }));
    const newState = !contractPaused[propertyId];
    const timestamp = new Date().toLocaleTimeString();
    const alert = `[${timestamp}] Smart contract ${propertyId} ${newState ? "PAUSED" : "RESUMED"}`;
    setRecentAlerts((prev) => [alert, ...prev].slice(0, 10));
    setStatusMessage(`Smart contract for ${propertyId} ${newState ? "PAUSED" : "RESUMED"}.`);
  };

  const collectTax = (propertyId: string, amount: number) => {
    if (!selectedTax) return;
    const newCollected = Math.min(selectedTax.collected + amount, selectedTax.stampDuty + selectedTax.registrationFee);
    const newRemaining = selectedTax.stampDuty + selectedTax.registrationFee - newCollected;
    const newStatus = newRemaining === 0 ? "complete" : newCollected > 0 ? "partial" : "pending";
    setSelectedTax({
      ...selectedTax,
      collected: newCollected,
      remaining: newRemaining,
      status: newStatus,
    });
    const timestamp = new Date().toLocaleTimeString();
    const alert = `[${timestamp}] Tax collected ₹${amount} for ${propertyId} (₹${newRemaining} remaining)`;
    setRecentAlerts((prev) => [alert, ...prev].slice(0, 10));
    setStatusMessage(`Tax collected: ₹${amount}. Updated escrow ledger.`);
  };

  const triggerManualAudit = (propertyId: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const alert = `[${timestamp}] MANUAL AUDIT TRIGGERED for ${propertyId} - Officials summoned`;
    setRecentAlerts((prev) => [alert, ...prev].slice(0, 10));
    setStatusMessage(`MANUAL AUDIT TRIGGERED for ${propertyId}. Officials summoned for physical verification.`);
    setAuditNotes(`Field inspection scheduled. Site: ${selectedQueueItem?.applicantName}'s property`);
  };

  const approveAndMint = (propertyId: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const alert = `[${timestamp}] BLOCKCHAIN MINTING: Property ${propertyId} approved with cryptographic signature`;
    setRecentAlerts((prev) => [alert, ...prev].slice(0, 10));
    setStatusMessage(`Property ${propertyId} APPROVED for blockchain minting. Cryptographic signature applied.`);
  };

  // Advanced KYC Handlers
  const switchKycProperty = (propertyId: string) => {
    setKycSelectedProperty(propertyId);
    // Load KYC data for selected property
    const biometricId = updatedQueue.find(q => q.propertyId === propertyId)?.applicantBiometric || "BIO-RS-2024";
    setBiometricVerificationResults(kycBiometricData[biometricId] || []);
    setZkProofStatus(kycZKProofData[propertyId] || {isAgeVerified: false, isOwnershipVerified: false, proofHash: "", discretizedScore: 0});
    setFraudIntelligence(kycFraudData[propertyId] || {deepfakeRisk: 0, documentForensicsScore: 0, pixelConsistency: 0, governmentSealValidation: false, benamisuspicion: 0, duplicateRegistrationRisk: 0, flagsFound: []});
    setMultiSigStatus(kycMultiSigData[propertyId] || {ownerSignature: {verified: false, timestamp: "", dsc: ""}, legalCounselSignature: {verified: false, timestamp: "", dsc: ""}, sroSignature: {verified: false, timestamp: "", dsc: ""}, transactionValue: 0, multiSigRequired: false});
    setComplianceCheck(kycComplianceData[propertyId] || {panLinked: false, taxCompliant: false, incomeMatch: false, moneyLaunderingRisk: 0, amlFlags: []});
    setNriVerification(kycNRIData[propertyId] || {nriStatus: false, consulateVerified: false, consulate: "", powerOfAttorneyVerified: false, credentialHash: ""});
  };

  const approveMultiSig = (role: "owner" | "counsel" | "sro") => {
    const timestamp = new Date().toLocaleTimeString();
    const dscPrefix = {owner: "DSC-OWN", counsel: "DSC-LAW", sro: "DSC-SRO"}[role];
    const newStatus = {...multiSigStatus};
    if (role === "owner") {
      newStatus.ownerSignature = {verified: true, timestamp, dsc: `${dscPrefix}-${Date.now()}`};
    } else if (role === "counsel") {
      newStatus.legalCounselSignature = {verified: true, timestamp, dsc: `${dscPrefix}-${Date.now()}`};
    } else {
      newStatus.sroSignature = {verified: true, timestamp, dsc: `${dscPrefix}-${Date.now()}`};
    }
    setMultiSigStatus(newStatus);
    const alert = `[${timestamp}] Multi-Sig: ${role.charAt(0).toUpperCase() + role.slice(1)} signature approved (DSC: ${newStatus[role === "owner" ? "ownerSignature" : role === "counsel" ? "legalCounselSignature" : "sroSignature"].dsc})`;
    setRecentAlerts((prev) => [alert, ...prev].slice(0, 10));
  };

  const generateZKProof = () => {
    const newProof: ZKProofStatus = {
      isAgeVerified: Math.random() > 0.3,
      isOwnershipVerified: Math.random() > 0.2,
      proofHash: "0x" + Math.random().toString(16).substring(2, 34).padEnd(32, "0"),
      discretizedScore: Math.floor(Math.random() * 100),
    };
    setZkProofStatus(newProof);
    const timestamp = new Date().toLocaleTimeString();
    const alert = `[${timestamp}] Zero-Knowledge Proof generated: Age=${newProof.isAgeVerified} | Ownership=${newProof.isOwnershipVerified}`;
    setRecentAlerts((prev) => [alert, ...prev].slice(0, 10));
  };

  const performNRIConsulateVerification = (consulate: string) => {
    const newNRIStatus: NRIVerification = {
      nriStatus: true,
      consulateVerified: true,
      consulate,
      powerOfAttorneyVerified: true,
      credentialHash: "0x" + Math.random().toString(16).substring(2, 34).padEnd(32, "0"),
    };
    setNriVerification(newNRIStatus);
    const timestamp = new Date().toLocaleTimeString();
    const alert = `[${timestamp}] NRI Verification: ${consulate} approved Power of Attorney and e-credentials`;
    setRecentAlerts((prev) => [alert, ...prev].slice(0, 10));
  };

  const recordSurveyCorner = () => {
    const lat = Number(surveyorLatInput);
    const lng = Number(surveyorLngInput);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      setStatusMessage("Enter valid GNSS latitude and longitude values.");
      return;
    }
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setStatusMessage("GNSS coordinates out of range. Latitude must be -90 to 90 and longitude -180 to 180.");
      return;
    }
    setSurveyorCorners((previous) => [...previous, { lat, lng }]);
    setSurveyorLatInput("");
    setSurveyorLngInput("");
    setStatusMessage("GNSS corner recorded for digital perimeter validation.");
  };

  const getActiveSurveyPoints = (): SurveyCorner[] => {
    if (surveyorCorners.length >= 3) {
      return surveyorCorners;
    }
    if (selectedGIS?.boundaryPoints?.length) {
      return selectedGIS.boundaryPoints;
    }
    if (selectedGIS) {
      return [{ lat: selectedGIS.latitude, lng: selectedGIS.longitude }];
    }
    return [];
  };

  const buildRealSatelliteImageUrl = () => {
    const points = getActiveSurveyPoints();
    const mapboxToken = (import.meta.env.VITE_MAPBOX_TOKEN as string | undefined) || "";

    let minLng: number;
    let minLat: number;
    let maxLng: number;
    let maxLat: number;

    if (points.length === 0) {
      minLng = 77.20 - 0.004;
      maxLng = 77.20 + 0.004;
      minLat = 28.61 - 0.004;
      maxLat = 28.61 + 0.004;
    } else if (points.length === 1) {
      minLng = points[0].lng - 0.0035;
      maxLng = points[0].lng + 0.0035;
      minLat = points[0].lat - 0.0035;
      maxLat = points[0].lat + 0.0035;
    } else {
      minLng = Math.min(...points.map((point) => point.lng));
      maxLng = Math.max(...points.map((point) => point.lng));
      minLat = Math.min(...points.map((point) => point.lat));
      maxLat = Math.max(...points.map((point) => point.lat));
      const padLng = Math.max((maxLng - minLng) * 0.35, 0.0012);
      const padLat = Math.max((maxLat - minLat) * 0.35, 0.0012);
      minLng -= padLng;
      maxLng += padLng;
      minLat -= padLat;
      maxLat += padLat;
    }

    const bbox = `${minLng},${minLat},${maxLng},${maxLat}`;

    if (satelliteProvider === "mapbox") {
      if (!mapboxToken) {
        setSatelliteProviderHealth("Mapbox token missing. Falling back to ArcGIS real imagery.");
      } else {
        const centerLng = (minLng + maxLng) / 2;
        const centerLat = (minLat + maxLat) / 2;
        const lngSpan = Math.max(maxLng - minLng, 0.0003);
        const zoom = lngSpan < 0.002 ? 18 : lngSpan < 0.004 ? 17 : lngSpan < 0.008 ? 16 : 15;
        setSatelliteProviderHealth("Mapbox real satellite feed active.");
        return `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${centerLng},${centerLat},${zoom},0/1120x560?logo=false&attribution=false&access_token=${mapboxToken}&t=${Date.now()}`;
      }
    }

    setSatelliteProviderHealth("ArcGIS live feed active.");
    return `https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=${bbox}&bboxSR=4326&size=1120,560&imageSR=4326&format=jpg&f=image&t=${Date.now()}`;
  };

  const refreshRealSatelliteFrame = () => {
    const url = buildRealSatelliteImageUrl();
    setSatelliteImageUrl(url);
    setSatelliteLastCaptureAt(new Date().toLocaleString());
    setStatusMessage("Fetched latest real satellite image from selected provider feed.");
  };

  const captureSatelliteBaseline = () => {
    const url = buildRealSatelliteImageUrl();
    setSatelliteImageUrl(url);
    setSatelliteBaselineUrl(url);
    setSatelliteChangeScore(0);
    setSatelliteAlertState("idle");
    setSatelliteLastCaptureAt(new Date().toLocaleString());
    setStatusMessage("Baseline satellite frame captured for change monitoring.");
  };

  const loadImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("image-load-failed"));
      image.src = url;
    });

  const runSatelliteChangeDetection = async () => {
    if (!satelliteBaselineUrl) {
      setStatusMessage("Capture baseline frame before change detection.");
      return;
    }

    setSatelliteMonitorBusy(true);
    const latestUrl = buildRealSatelliteImageUrl();
    setSatelliteImageUrl(latestUrl);
    setSatelliteLastCaptureAt(new Date().toLocaleString());

    try {
      const [baseImage, latestImage] = await Promise.all([
        loadImage(satelliteBaselineUrl),
        loadImage(latestUrl),
      ]);

      const canvas = document.createElement("canvas");
      const width = 320;
      const height = 240;
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("canvas-unavailable");
      }

      context.drawImage(baseImage, 0, 0, width, height);
      const baseData = context.getImageData(0, 0, width, height).data;
      context.clearRect(0, 0, width, height);
      context.drawImage(latestImage, 0, 0, width, height);
      const currentData = context.getImageData(0, 0, width, height).data;

      let aggregate = 0;
      let samples = 0;
      for (let index = 0; index < baseData.length; index += 16) {
        const dr = Math.abs(baseData[index] - currentData[index]);
        const dg = Math.abs(baseData[index + 1] - currentData[index + 1]);
        const db = Math.abs(baseData[index + 2] - currentData[index + 2]);
        aggregate += (dr + dg + db) / 3;
        samples += 1;
      }

      const averageDiff = samples ? aggregate / samples : 0;
      const score = Math.min(100, Math.round((averageDiff / 255) * 220));
      const changeDetected = score >= 12;

      setSatelliteChangeScore(score);
      setSatelliteAlertState(changeDetected ? "change" : "stable");

      if (changeDetected) {
        const propertyId = selectedQueueItem?.propertyId || "UNASSIGNED";
        const recipients = "Surveyor, Registrar, Property Owner, Bank Risk Officer";
        const timestamp = new Date().toLocaleTimeString();
        setRecentAlerts((previous) => [
          `[${timestamp}] Satellite change alert for ${propertyId}. Score=${score}. Notified: ${recipients}.`,
          ...previous,
        ].slice(0, 10));
        setStatusMessage(`Real satellite image shows land-level change risk (${score}%). Alerts sent to concerned persons.`);
      } else {
        setStatusMessage(`No material land-surface change detected. Change score ${score}%.`);
      }
    } catch {
      setStatusMessage("Unable to run image diff on this browser/network. Real image is still visible for manual survey review.");
    } finally {
      setSatelliteMonitorBusy(false);
    }
  };

  const toSurveySvgPoints = (points: SurveyCorner[]) => {
    if (!points.length) {
      return "";
    }
    const minLat = Math.min(...points.map((point) => point.lat));
    const maxLat = Math.max(...points.map((point) => point.lat));
    const minLng = Math.min(...points.map((point) => point.lng));
    const maxLng = Math.max(...points.map((point) => point.lng));
    const latSpan = Math.max(maxLat - minLat, 0.0001);
    const lngSpan = Math.max(maxLng - minLng, 0.0001);

    return points
      .map((point) => {
        const x = 14 + ((point.lng - minLng) / lngSpan) * 272;
        const y = 14 + (1 - (point.lat - minLat) / latSpan) * 132;
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");
  };

  const runSurveyForgeryAnalysis = () => {
    const propertyId = selectedQueueItem?.propertyId || "UNASSIGNED";
    const notes: string[] = [];
    const ghostPlot = surveyorCorners.length < 4;
    if (ghostPlot) {
      notes.push("Ghost Plot risk: fewer than four corners captured.");
    } else {
      notes.push("Corner count sufficient for perimeter closure.");
    }

    let boundaryCreep = false;
    if (selectedGIS && surveyorCorners.length >= 4 && selectedGIS.boundaryPoints.length >= 4) {
      const pointsToCheck = Math.min(surveyorCorners.length, selectedGIS.boundaryPoints.length);
      let maxDriftMeters = 0;
      for (let index = 0; index < pointsToCheck; index += 1) {
        const captured = surveyorCorners[index];
        const baseline = selectedGIS.boundaryPoints[index];
        const latMeters = Math.abs(captured.lat - baseline.lat) * 111000;
        const lngMeters = Math.abs(captured.lng - baseline.lng) * 111000;
        maxDriftMeters = Math.max(maxDriftMeters, latMeters + lngMeters);
      }
      boundaryCreep = maxDriftMeters > 8;
      notes.push(boundaryCreep
        ? `Boundary Creep risk: max drift ${maxDriftMeters.toFixed(2)}m exceeds tolerance.`
        : `Boundary drift ${maxDriftMeters.toFixed(2)}m within tolerance.`);
    } else {
      notes.push("Boundary Creep check pending baseline GIS data and four valid corners.");
    }

    setSurveyorAssessment({ ghostPlot, boundaryCreep, notes });
    const timestamp = new Date().toLocaleTimeString();
    setRecentAlerts((previous) => [`[${timestamp}] Surveyor analysis completed for ${propertyId}: ghost=${ghostPlot}, creep=${boundaryCreep}`, ...previous].slice(0, 10));
  };

  const uploadGisSignature = () => {
    const propertyId = selectedQueueItem?.propertyId || "UNASSIGNED";
    if (surveyorCorners.length < 4) {
      setStatusMessage("Capture at least four GNSS corners before uploading GIS signature.");
      return;
    }
    const coordinateKey = surveyorCorners
      .map((corner) => `${corner.lat.toFixed(6)},${corner.lng.toFixed(6)}`)
      .sort()
      .join("|");

    const existingClaim = lockedCoordinateClaims[coordinateKey];
    if (existingClaim && existingClaim !== propertyId) {
      setStatusMessage(`GIS Signature blocked: coordinates are already locked by ${existingClaim}.`);
      return;
    }

    const signature = `GIS-${propertyId}-${Date.now().toString(16).toUpperCase()}`;
    setGisSignatureHash(signature);
    setLockedCoordinateClaims((previous) => ({ ...previous, [coordinateKey]: propertyId }));
    const timestamp = new Date().toLocaleTimeString();
    setRecentAlerts((previous) => [`[${timestamp}] GIS Signature uploaded for ${propertyId} (${signature})`, ...previous].slice(0, 10));
    setStatusMessage("GIS Signature uploaded and coordinates locked against duplicate claims.");
  };

  const executeGovernmentRoleAction = (subRole: GovernmentSubRole) => {
    const propertyId = selectedQueueItem?.propertyId || updatedQueue[0]?.propertyId || "UNASSIGNED";
    const timestamp = new Date().toLocaleTimeString();

    if (subRole === "registrar") {
      const requiredBeforeRegistrar: GovernmentSubRole[] = [
        "surveyor",
        "patwari",
        "revenueOfficer",
        "forestTownPlanner",
      ];
      const pendingStages = requiredBeforeRegistrar.filter((stage) => govWorkflowStatus[stage] !== "completed");
      if (pendingStages.length > 0) {
        setStatusMessage(`Registrar stage blocked. Complete prior stages: ${pendingStages.join(", ")}.`);
        return;
      }
      approveAndMint(propertyId);
      setGovWorkflowStatus((previous) => ({ ...previous, registrar: "completed" }));
      const alert = `[${timestamp}] Registrar: Blockchain minting finalized for ${propertyId}`;
      setRecentAlerts((prev) => [alert, ...prev].slice(0, 10));
      setStatusMessage(`Registrar finalized blockchain minting for ${propertyId}.`);
      return;
    }

    if (subRole === "surveyor") {
      if (surveyorAssessment.ghostPlot || surveyorAssessment.boundaryCreep) {
        setStatusMessage("Surveyor stage blocked: resolve Ghost Plot/Boundary Creep risks before completion.");
        return;
      }
      if (!gisSignatureHash) {
        setStatusMessage("Surveyor stage blocked: upload GIS Signature before marking stage complete.");
        return;
      }
      setShowSatelliteHistory(true);
      setGovWorkflowStatus((previous) => ({ ...previous, surveyor: "completed" }));
      setAuditNotes(`Surveyor GIS signature ${gisSignatureHash} validated for ${propertyId}. Boundary review synced to GIS layer.`);
      const alert = `[${timestamp}] Surveyor: GIS boundary confirmation and signature lock completed for ${propertyId}`;
      setRecentAlerts((prev) => [alert, ...prev].slice(0, 10));
      setStatusMessage(`Surveyor completed GIS boundary stage for ${propertyId}.`);
      return;
    }

    if (subRole === "patwari") {
      setGovWorkflowStatus((previous) => ({ ...previous, patwari: "completed" }));
      setAuditNotes(`Patwari ground truth attested for ${propertyId}: physical possession confirmed on field visit.`);
      const alert = `[${timestamp}] Patwari: Ground possession attestation submitted for ${propertyId}`;
      setRecentAlerts((prev) => [alert, ...prev].slice(0, 10));
      setStatusMessage(`Patwari completed ground-truth possession stage for ${propertyId}.`);
      return;
    }

    if (subRole === "revenueOfficer") {
      toggleContractPause(propertyId);
      setGovWorkflowStatus((previous) => ({ ...previous, revenueOfficer: "completed" }));
      const alert = `[${timestamp}] Revenue Officer: Tax and mutation controls verified for ${propertyId}`;
      setRecentAlerts((prev) => [alert, ...prev].slice(0, 10));
      setStatusMessage(`Revenue Officer executed mutation/tax control for ${propertyId}.`);
      return;
    }

    setGovWorkflowStatus((previous) => ({ ...previous, forestTownPlanner: "completed" }));
    const alert = `[${timestamp}] Forest/Town Planner: Usage rights compliance approved for ${propertyId}`;
    setRecentAlerts((prev) => [alert, ...prev].slice(0, 10));
    setStatusMessage(`Forest/Town Planner completed usage rights compliance stage for ${propertyId}.`);
  };

  const runLienCheck = () => {
    if (!propertyReference.trim()) {
      setLienStatus("idle");
      setLienMessage("Provide Property ID/QR value before checking liens.");
      return;
    }

    setLienStatus("checking");
    window.setTimeout(() => {
      const input = propertyReference.trim().toUpperCase();
      const isMatch =
        input === officeDossier.propertyId.toUpperCase() || input === officeDossier.qrCode.toUpperCase();

      if (!isMatch) {
        setLienStatus("encumbered");
        setLienMessage(
          `Office record mismatch. Expected ${officeDossier.propertyId} or ${officeDossier.qrCode}.`
        );
        return;
      }

      if (officeDossier.lienStatus !== "clear") {
        setLienStatus("encumbered");
        setLienMessage(
          `Office record shows active lien at ${officeDossier.lienBank}. Double financing blocked.`
        );
      } else {
        setLienStatus("clear");
        setLienMessage(
          `Office deed verified. No active external mortgage found for ${officeDossier.ownerName}.`
        );
        queueBankAdvance("Lien check passed using the office deed record.");
      }
    }, 700);
  };

  const runValuationAudit = () => {
    const claim = Number(claimedArea) || 0;
    const registered = officeDossier.registeredArea;
    const measured = officeDossier.measuredArea;
    const exists = true;
    const overlap = officeDossier.boundaryOverlapPercent;
    const mismatchPenalty = Math.abs(claim - registered) <= 5 ? 8 : 38;
    const risk = Math.min(95, Math.round((exists ? 16 : 52) + mismatchPenalty + overlap * 0.8));

    setBuildingExists(exists);
    setMeasuredArea(measured);
    setOverlapPercent(overlap);
    setValuationRiskScore(risk);
    setEncroachmentDetected(risk > 44);
    setDigitalTwinTimestamp(new Date().toLocaleString());

    if (Math.abs(claim - registered) <= 5) {
      queueBankAdvance("GIS valuation matched the office digital twin record.");
    } else {
      setStatusMessage(
        `Valuation mismatch. Office record shows ${registered} sq ft, but the officer entered ${claim} sq ft.`
      );
    }
  };

  const runEncroachmentCheck = () => {
    if (!surveyZoneInput.trim()) {
      setStatusMessage("Enter the office survey zone code before boundary verification.");
      return;
    }

    const zoneMatch = surveyZoneInput.trim().toUpperCase() === officeDossier.satelliteZone.toUpperCase();
    setOverlapPercent(officeDossier.boundaryOverlapPercent);
    setEncroachmentDetected(officeDossier.boundaryOverlapPercent > 0);

    if (!zoneMatch) {
      setStatusMessage(
        `Survey zone mismatch. Office map file uses ${officeDossier.satelliteZone}.`
      );
      return;
    }

    if (officeDossier.boundaryOverlapPercent > 0) {
      setStatusMessage(
        `Boundary overlap of ${officeDossier.boundaryOverlapPercent}% detected from office GIS layer. Manual review required.`
      );
    } else {
      queueBankAdvance("Boundary scan matched the office satellite layer.");
    }
  };

  const runIdentityAndSignatureAuth = () => {
    if (scanConfidence < 85) {
      setIdentityMessage(
        "Live biometric confidence is below threshold. Re-run biometric verification."
      );
      setBiometricMatchScore(Math.max(40, scanConfidence));
      setPasskeySigned(false);
      return;
    }

    if (biometricTokenInput.trim().toUpperCase() !== officeDossier.biometricToken.toUpperCase()) {
      setIdentityMessage(
        `Biometric token mismatch. Office identity file expects ${officeDossier.biometricToken}.`
      );
      setBiometricMatchScore(scanConfidence);
      setPasskeySigned(false);
      return;
    }

    if (passkeyInput.trim().toUpperCase() !== officeDossier.passkeyCode.toUpperCase()) {
      setIdentityMessage(
        `Passkey mismatch. Office signature registry expects ${officeDossier.passkeyCode}.`
      );
      setBiometricMatchScore(scanConfidence);
      setPasskeySigned(false);
      return;
    }

    const match = Math.min(99, Math.max(90, scanConfidence + 2));
    const hash = `TXN-${Date.now().toString(36).toUpperCase()}`;
    setBiometricMatchScore(match);
    setPasskeySigned(true);
    setAgreementHash(hash);
    setIdentityMessage(
      "Applicant biometric and passkey matched against the office identity file."
    );
    queueBankAdvance("Identity and signature matched the office dossier.");
  };

  const advanceEscrow = () => {
    if (lienStatus !== "clear") {
      setStatusMessage("Escrow lock: collateral must be lien-clear before escrow can move.");
      return;
    }
    if (!passkeySigned) {
      setStatusMessage("Escrow lock: passkey signature is required before controlled release.");
      return;
    }

    const amount = Number(loanAmount) || 0;
    if (amount <= 0 || amount > officeDossier.escrowLimit) {
      setStatusMessage(
        `Loan amount must be within office escrow limit of INR ${officeDossier.escrowLimit}.`
      );
      return;
    }
    if (sellerNameInput.trim().toLowerCase() !== officeDossier.ownerName.toLowerCase()) {
      setStatusMessage(
        `Seller name mismatch. Office transfer file lists ${officeDossier.ownerName}.`
      );
      return;
    }

    if (escrowStage !== "idle") {
      return;
    }

    setEscrowLedger((previous) => [
      ...previous,
      `Escrow funded with INR ${amount} from office-approved limit at ${new Date().toLocaleTimeString()}`,
    ]);
    setEscrowStage("funded");

    window.setTimeout(() => {
      setEscrowStage("deedTransferred");
      setEscrowLedger((previous) => [
        ...previous,
        `Digital deed transferred after office confirmation at ${new Date().toLocaleTimeString()}`,
      ]);
    }, 700);

    window.setTimeout(() => {
      setEscrowStage("lienRecorded");
      setEscrowLedger((previous) => [
        ...previous,
        `Bank lien recorded on-chain at ${new Date().toLocaleTimeString()}`,
      ]);
    }, 1400);

    window.setTimeout(() => {
      setEscrowStage("released");
      setEscrowLedger((previous) => [
        ...previous,
        `Escrow released to seller at ${new Date().toLocaleTimeString()}`,
      ]);
      queueBankAdvance("Smart escrow completed after office deed transfer and lien recording.");
    }, 2100);
  };

  const runDocumentIntegrityCheck = () => {
    if (!deedHashInput.trim()) {
      setStatusMessage("Enter the deed hash from the office file before integrity verification.");
      return;
    }

    const valid = deedHashInput.trim().toUpperCase() === officeDossier.deedHash.toUpperCase();
    setDocIntegrity(valid ? "valid" : "tampered");
    if (valid) {
      queueBankAdvance("Document hash matched the office deed registry.");
    }
  };

  const runConsortiumCheck = () => {
    if (!consortiumBankInput.trim()) {
      setStatusMessage("Enter the requesting bank name before consortium verification.");
      return;
    }

    const bank = consortiumBankInput.trim();
    const flagged = !officeDossier.consortiumClear || bank.toLowerCase() === officeDossier.lienBank.toLowerCase();
    setConsortiumVerdict(
      flagged
        ? `Consortium warning: ${bank} already appears in the office mortgage ledger.`
        : `Consortium clear: ${bank} did not register duplicate financing against this deed.`
    );
    if (!flagged) {
      queueBankAdvance("Cross-bank duplicate check matched office registry rules.");
    }
  };

  const runAdvancedRiskEngine = () => {
    const alerts: string[] = [];
    const fingerprint = propertyReference || "default-property";
    const threshold = Number(monitorThresholdInput) || 3;
    const complexity = fingerprint.length + scanConfidence + threshold;

    if (complexity % 2 === 0) {
      alerts.push("AI anomaly monitor: application behavior deviates from historical profile.");
    }
    if (complexity % 3 === 0) {
      alerts.push("Title chain forensics: suspicious ownership hop pattern in last 24 months.");
    }
    if (complexity % 5 === 0) {
      alerts.push("Sanctions and PEP screening: potential name similarity match requires manual review.");
    }
    alerts.push("Climate resilience score generated from flood/heat maps for long-term collateral risk.");
    alerts.push("Continuous covenant monitor armed: alerts if post-disbursement encumbrance is detected.");

    setAdvancedAlerts(alerts);
    setMonitorMode(true);
    setMonitorEvents([
      `Office monitor started for registry ${officeDossier.registryVersion} in ${officeDossier.satelliteZone}.`,
    ]);
    window.setTimeout(() => {
      queueBankAdvance("Advanced monitoring completed against office risk controls.");
    }, 2000);
  };

  useEffect(() => {
    if (!monitorMode) {
      return;
    }

    const monitorId = window.setInterval(() => {
      setMonitorEvents((previous) => {
        const event = `Monitor pulse ${new Date().toLocaleTimeString()}: No adverse mutation in lien/deed graph.`;
        return [event, ...previous].slice(0, 5);
      });
    }, 3000);

    return () => window.clearInterval(monitorId);
  }, [monitorMode]);

  const addLockerDocument = () => {
    if (!lockerDocName.trim()) {
      setStatusMessage("Enter document name before uploading to Digital Land Locker.");
      return;
    }
    const doc: LandLockerDoc = {
      id: `DOC-${Date.now()}`,
      name: lockerDocName.trim(),
      category: lockerDocCategory,
      encrypted: true,
      uploadedAt: new Date().toISOString().slice(0, 10),
    };
    setLockerDocs((previous) => [doc, ...previous]);
    setLockerDocName("");
    setStatusMessage(`Document '${doc.name}' encrypted and stored in Digital Land Locker.`);
  };

  const runVoiceAssistant = () => {
    const query = voiceQuery.trim().toLowerCase();
    if (!query) {
      setVoiceAnswer("Please say what you want, for example: show my mother deed.");
      return;
    }
    if (query.includes("ec") || query.includes("encumbrance")) {
      setVoiceAnswer("Voice AI: I found your latest Encumbrance Certificate in the locker.");
    } else if (query.includes("tax")) {
      setVoiceAnswer("Voice AI: I found your tax receipts. Two records are ready for download.");
    } else if (query.includes("mother") || query.includes("deed")) {
      setVoiceAnswer("Voice AI: Mother deed located and integrity-verified in encrypted vault.");
    } else {
      setVoiceAnswer("Voice AI: I can help with mother deed, tax receipts, and EC files.");
    }
  };

  const simulateBhuAadhaarQuery = () => {
    const alert: BhuAadhaarAlert = {
      id: `AL-${Date.now()}`,
      ulpin: "ULPIN-29-4488-1102",
      actor: "Registry Query Node",
      action: "ULPIN queried / transfer initiation requested",
      timestamp: new Date().toLocaleString(),
      frozen: false,
    };
    setBhuAlerts((previous) => [alert, ...previous]);
    setRecentAlerts((previous) => [`[${new Date().toLocaleTimeString()}] Bhu-Aadhaar alert generated for ${alert.ulpin}`, ...previous].slice(0, 10));
    setStatusMessage("Anti-theft alert sent. You can freeze the title instantly.");
  };

  const freezeTitleFromAlert = (alertId: string) => {
    setBhuAlerts((previous) => previous.map((item) => (item.id === alertId ? { ...item, frozen: true } : item)));
    setTitleFreezeActive(true);
    setStatusMessage("Title freeze activated. Transfer blocked until physical verification.");
  };

  const submitVigilanceReport = () => {
    if (!vigilanceIssue.trim()) {
      setStatusMessage("Describe unauthorized construction or boundary issue to report.");
      return;
    }
    const reportId = `VR-${Date.now()}`;
    const newReport: VigilanceReport = {
      id: reportId,
      plotId: "PROP-2024-DL-001",
      reporter: "Verified Neighbor",
      issue: vigilanceIssue.trim(),
      satelliteStatus: "pending",
    };
    setVigilanceReports((previous) => [newReport, ...previous]);
    setVigilanceIssue("");
    setStatusMessage("Community report submitted. Satellite confirmation initiated.");
    window.setTimeout(() => {
      setVigilanceReports((previous) =>
        previous.map((item) =>
          item.id === reportId ? { ...item, satelliteStatus: Math.random() > 0.4 ? "confirmed" : "rejected" } : item
        )
      );
    }, 1300);
  };

  const runOneTapBuyerVerification = () => {
    const qrMatched = buyerQrInput.trim().toUpperCase() === officeDossier.qrCode.toUpperCase();
    const gpsMatched = buyerGpsInput.includes("28.61") || buyerGpsInput.includes("77.20");
    const score = qrMatched && gpsMatched ? 93 : qrMatched ? 74 : 41;
    setOneTapResult({
      propertyId: officeDossier.propertyId,
      gpsMatched,
      blockchainMatched: qrMatched,
      healthScore: score,
    });
    setStatusMessage(
      qrMatched && gpsMatched
        ? "One-Tap verification passed. Location and blockchain record are consistent."
        : "One-Tap verification found mismatch. Perform manual due diligence before purchase."
    );
  };

  const totalHeirShare = inheritanceHeirs.reduce((sum, heir) => sum + heir.sharePercent, 0);
  const verifiedHeirs = inheritanceHeirs.filter((heir) => heir.verified);

  const addInheritanceHeir = () => {
    if (digitalWillLocked) {
      setStatusMessage("Digital Will is locked. Unlock is not permitted after on-chain seal.");
      return;
    }
    const heirName = heirNameInput.trim();
    const heirWallet = heirWalletInput.trim();
    const heirShare = Number(heirShareInput);

    if (!heirName || !heirWallet || Number.isNaN(heirShare)) {
      setStatusMessage("Enter heir name, wallet ID, and share percentage.");
      return;
    }
    if (heirShare <= 0 || heirShare > 100) {
      setStatusMessage("Heir share must be between 1 and 100.");
      return;
    }

    const candidateTotal = totalHeirShare + heirShare;
    if (candidateTotal > 100) {
      setStatusMessage(`Total succession share cannot exceed 100%. Current: ${totalHeirShare}%`);
      return;
    }

    const heir: InheritanceHeir = {
      id: `HEIR-${Date.now()}`,
      name: heirName,
      relation: heirRelationInput,
      sharePercent: heirShare,
      wallet: heirWallet,
      verified: false,
    };
    setInheritanceHeirs((previous) => [...previous, heir]);
    setHeirNameInput("");
    setHeirWalletInput("");
    setHeirShareInput("0");
    setStatusMessage(`Heir ${heir.name} added to succession draft.`);
  };

  const verifyHeirIdentity = (heirId: string) => {
    setInheritanceHeirs((previous) =>
      previous.map((item) => (item.id === heirId ? { ...item, verified: true } : item))
    );
    setStatusMessage("Heir identity verified through Aadhaar + biometric proof.");
  };

  const lockDigitalWill = () => {
    if (inheritanceHeirs.length === 0) {
      setStatusMessage("Add at least one heir before locking Digital Will.");
      return;
    }
    if (totalHeirShare !== 100) {
      setStatusMessage(`Digital Will requires exact 100% share allocation. Current: ${totalHeirShare}%`);
      return;
    }
    if (verifiedHeirs.length !== inheritanceHeirs.length) {
      setStatusMessage("Verify all heirs before locking Digital Will.");
      return;
    }

    const hash = `WILL-${Date.now().toString(36).toUpperCase()}`;
    setDigitalWillLocked(true);
    setDigitalWillHash(hash);
    setInheritanceLog((previous) => [
      `[${new Date().toLocaleTimeString()}] Digital Will hash sealed on-chain: ${hash}`,
      ...previous,
    ].slice(0, 8));
    setRecentAlerts((previous) => [
      `[${new Date().toLocaleTimeString()}] Succession plan locked with hash ${hash}`,
      ...previous,
    ].slice(0, 10));
    setStatusMessage("Digital Will locked. Paper-will forgery attempts are now invalid against on-chain hash.");
  };

  const armDeadManSwitch = () => {
    if (!digitalWillLocked) {
      setStatusMessage("Lock Digital Will before arming Dead Man's Switch.");
      return;
    }
    setDeadManSwitchArmed(true);
    setLastOwnerCheckIn(new Date().toLocaleString());
    setStatusMessage(`Dead Man's Switch armed with ${inactivityWindowDays}-day inactivity window.`);
  };

  const ownerHeartbeatCheckIn = () => {
    setLastOwnerCheckIn(new Date().toLocaleString());
    setStatusMessage("Owner heartbeat received. Auto-transfer timer reset.");
  };

  const verifyDeathCertificate = () => {
    const token = deathCertificateInput.trim().toUpperCase();
    if (!token) {
      setStatusMessage("Enter death certificate reference to verify.");
      return;
    }
    const looksValid = token.startsWith("DC-") || token.startsWith("DEATH-") || token.length >= 10;
    setDeathCertificateVerified(looksValid);
    setStatusMessage(
      looksValid
        ? "Death certificate verified with municipal registry and e-signature node."
        : "Death certificate verification failed. Please recheck certificate ID."
    );
  };

  const executeInheritanceTransfer = () => {
    if (!deadManSwitchArmed) {
      setStatusMessage("Arm Dead Man's Switch before triggering inheritance contract.");
      return;
    }
    if (!digitalWillLocked) {
      setStatusMessage("Digital Will must be locked before ownership transfer.");
      return;
    }
    if (!deathCertificateVerified) {
      setStatusMessage("Digital death certificate verification is required.");
      return;
    }
    if (autoTransferExecuted) {
      setStatusMessage("Inheritance smart contract already executed.");
      return;
    }

    const transferEvents = inheritanceHeirs.map(
      (heir) => `Ownership tranche ${heir.sharePercent}% transferred to ${heir.name} (${heir.wallet}).`
    );
    setAutoTransferExecuted(true);
    setInheritanceLog((previous) => [
      `[${new Date().toLocaleTimeString()}] Death cert accepted. Inheritance contract executed.`,
      ...transferEvents,
      ...previous,
    ].slice(0, 10));
    setRecentAlerts((previous) => [
      `[${new Date().toLocaleTimeString()}] Auto inheritance transfer completed for ${officeDossier.propertyId}`,
      ...previous,
    ].slice(0, 10));
    setStatusMessage("Smart inheritance transfer completed for all verified heirs.");
  };

  const renderDashboard = (role: Role) => {
    const config = dashboardByRole[role];
    const isGovernmentRolePage = (value: string): value is GovernmentSubRole =>
      value === "surveyor" ||
      value === "patwari" ||
      value === "revenueOfficer" ||
      value === "forestTownPlanner" ||
      value === "registrar";
    const isBankDomainPage = (value: string): value is "collateral" | "avm" | "aml" | "escrow" =>
      value === "collateral" || value === "avm" || value === "aml" || value === "escrow";

    // Sidebar navigation items based on role
    const getSidebarItems = () => {
      if (role === "Government Official") {
        return [
          { id: "overview", label: "📊 Operations Overview", icon: "📊" },
          { id: "surveyor", label: "🗺️ Surveyor", icon: "🗺️" },
          { id: "patwari", label: "📍 Patwari", icon: "📍" },
          { id: "revenueOfficer", label: "💰 Revenue Officer", icon: "💰" },
          { id: "forestTownPlanner", label: "🌲 Forest/Town Planner", icon: "🌲" },
          { id: "registrar", label: "🏛️ Registrar", icon: "🏛️" },
          { id: "queue", label: "📋 Verification Queue", icon: "📋" },
          { id: "gis", label: "🗺️ GIS & Satellite Audit", icon: "🗺️" },
          { id: "kyc", label: "🔐 Identity & KYC", icon: "🔐" },
          { id: "ledger", label: "⛓️ Ledger Management", icon: "⛓️" },
        ];
      } else if (role === "Bank Officer") {
        return [
          { id: "overview", label: "📊 Operation Status", icon: "📊" },
          { id: "collateral", label: "🏦 Collateral Integrity", icon: "🏦" },
          { id: "avm", label: "🛰️ AVM Audit", icon: "🛰️" },
          { id: "aml", label: "🧾 Financial Identity & AML", icon: "🧾" },
          { id: "escrow", label: "💰 Smart Escrow Control", icon: "💰" },
        ];
      } else {
        return [
          { id: "overview", label: "📊 My Properties", icon: "📊" },
          { id: "locker", label: "🗃️ Digital Land Locker", icon: "🗃️" },
          { id: "inheritance", label: "🧬 Smart Inheritance", icon: "🧬" },
          { id: "alerts", label: "🚨 Bhu-Aadhaar Alerts", icon: "🚨" },
          { id: "vigilance", label: "🧭 Vigilance Map", icon: "🧭" },
          { id: "onetap", label: "📲 One-Tap Verify", icon: "📲" },
        ];
      }
    };

    const navigateSidebar = (itemId: string) => {
      if (role === "Government Official" && isGovernmentRolePage(itemId)) {
        setActiveGovernmentStage(itemId);
        setSidebarNav(itemId);
        setView("governmentDashboard");
        return;
      }
      setSidebarNav(itemId);
      if (role === "Government Official") {
        if (itemId === "queue") setInspectorTab("queue");
        if (itemId === "gis") setInspectorTab("gis");
        if (itemId === "kyc") setInspectorTab("kycD");
        if (itemId === "ledger") setInspectorTab("ledger");
        setView("governmentDashboard");
      } else if (role === "Bank Officer") {
        setView("bankDashboard");
      } else {
        setView("userDashboard");
      }
    };

    const flowItems = getSidebarItems().map((item) => item.id);
    const flowIndex = Math.max(0, flowItems.indexOf(sidebarNav));
    const flowPercent = Math.round(((flowIndex + 1) / flowItems.length) * 100);

    const moveRoleFlow = (direction: "prev" | "next") => {
      const nextIndex = direction === "next"
        ? Math.min(flowItems.length - 1, flowIndex + 1)
        : Math.max(0, flowIndex - 1);
      navigateSidebar(flowItems[nextIndex]);
    };

    const syncChecks = {
      queueGis:
        !selectedQueueItem || !selectedGIS
          ? false
          : selectedQueueItem.propertyId === selectedGIS.propertyId,
      queueTax:
        !selectedQueueItem || !selectedTax
          ? false
          : selectedQueueItem.propertyId === selectedTax.propertyId,
      queueKyc: !selectedQueueItem ? false : selectedQueueItem.propertyId === kycSelectedProperty,
      surveyorSignatureLock: !gisSignatureHash || Object.values(lockedCoordinateClaims).includes(selectedQueueItem?.propertyId || ""),
    };
    const syncScore = Math.round(
      (Object.values(syncChecks).filter(Boolean).length / Object.values(syncChecks).length) * 100
    );

    return (
      <section className="advanced-dashboard">
        {/* LEFT SIDEBAR NAVIGATION */}
        <aside className="sidebar-nav">
          <div className="sidebar-header">
            <h4>Operations</h4>
            <p className="role-badge">{role}</p>
          </div>
          <nav className="sidebar-menu">
            {getSidebarItems().map((item) => (
              <button
                key={item.id}
                className={sidebarNav === item.id ? "sidebar-item active" : "sidebar-item"}
                onClick={() => navigateSidebar(item.id)}
                type="button"
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="sidebar-footer">
            <button className="logout-btn sidebar-logout" onClick={handleLogout} type="button">
              🚪 Logout
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <section className="dashboard-main">
          <article className="dashboard-head advanced-head">
            <div className="head-title">
              <h2>{config.title}</h2>
              <p>{config.description}</p>
            </div>
            <div className="dash-actions-grid">
              {config.quickActions.map((action) => (
                <span key={action} className="quick-action-badge">{action}</span>
              ))}
            </div>
          </article>

          <article className="role-flow-strip">
            <div className="role-flow-top">
              <p className="role-flow-title">
                Continuous Flow: Step {flowIndex + 1} of {flowItems.length}
              </p>
            </div>
            <div className="role-flow-track">
              <div className="role-flow-fill" style={{ width: `${flowPercent}%` }} />
            </div>
            <div className="role-flow-actions">
              <button
                className="bank-btn secondary"
                type="button"
                onClick={() => moveRoleFlow("prev")}
                disabled={flowIndex === 0}
              >
                Previous Step
              </button>
              <button
                className="bank-btn"
                type="button"
                onClick={() => moveRoleFlow("next")}
                disabled={flowIndex === flowItems.length - 1}
              >
                Next Step
              </button>
            </div>
          </article>

          {/* OPERATIONS OVERVIEW (All Roles) */}
          {sidebarNav === "overview" && (
            <article className="operations-overview">
              <h3>Operations Dashboard</h3>
              <div className="stats-grid">
                <div className="stat-card queued">
                  <div className="stat-number">{operationStats.totalQueued}</div>
                  <div className="stat-label">Total in Queue</div>
                </div>
                <div className="stat-card pending">
                  <div className="stat-number">{operationStats.pendingApprovals}</div>
                  <div className="stat-label">Pending Approvals</div>
                </div>
                <div className="stat-card flagged">
                  <div className="stat-number">{operationStats.flaggedCases}</div>
                  <div className="stat-label">Flagged Cases</div>
                </div>
                <div className="stat-card completed">
                  <div className="stat-number">{operationStats.completedToday}</div>
                  <div className="stat-label">Completed Today</div>
                </div>
                <div className="stat-card audit">
                  <div className="stat-number">{operationStats.auditInProgress}</div>
                  <div className="stat-label">Audits In Progress</div>
                </div>
              </div>
            </article>
          )}

          {/* DEFAULT CONTENT FOR ALL ROLES */}
          {sidebarNav === "overview" && role !== "Government Official" && role !== "Bank Officer" && (
            <main className="content-grid">
              {config.features.map((item, index) => (
                <article
                  key={item.title}
                  className="agenda-card"
                  style={{ ["--accent" as string]: item.accent, animationDelay: `${
                    index * 120
                  }ms` }}
                >
                  <p className="card-index">0{index + 1}</p>
                  <h2>{item.title}</h2>
                  <p className="summary">{item.summary}</p>
                  <p>{item.detail}</p>
                </article>
              ))}
            </main>
          )}

          {/* GOVERNMENT OFFICIAL SPECIFIC TABS */}
          {role === "Government Official" && sidebarNav !== "overview" && (
            isGovernmentRolePage(sidebarNav) ? renderGovernmentRoleWorkbench(sidebarNav) : (
            <section className="inspector-dashboard">
              <nav className="inspector-tabs">
                <button
                  className={inspectorTab === "queue" ? "tab-btn active" : "tab-btn"}
                  onClick={() => setInspectorTab("queue")}
                  type="button"
                >
                  📋 Verification Queue
                </button>
                <button
                  className={inspectorTab === "gis" ? "tab-btn active" : "tab-btn"}
                  onClick={() => setInspectorTab("gis")}
                  type="button"
                >
                  🗺️ GIS & Satellite Audit
                </button>
                <button
                  className={inspectorTab === "kycD" ? "tab-btn active" : "tab-btn"}
                  onClick={() => setInspectorTab("kycD")}
                  type="button"
                >
                  🔐 Identity & KYC
                </button>
                <button
                  className={inspectorTab === "ledger" ? "tab-btn active" : "tab-btn"}
                  onClick={() => setInspectorTab("ledger")}
                  type="button"
                >
                  ⛓️ Ledger Management
                </button>
              </nav>

            {inspectorTab === "queue" && (
              <article className="inspector-module">
                <h3>Verification Queue: Land Parcels Awaiting Approval</h3>
                <div className="queue-grid">
                  {updatedQueue.map((item) => (
                    <div
                      key={item.id}
                      className={`queue-card status-${item.status}`}
                      onClick={() => syncPropertyContext(item.propertyId)}
                    >
                      <div className="queue-header">
                        <strong>{item.propertyId}</strong>
                        <span className={`status-badge status-${item.status}`}>{item.status}</span>
                      </div>
                      <p><strong>Applicant:</strong> {item.applicantName}</p>
                      <p><strong>Applied:</strong> {item.appliedDate}</p>
                      <p><strong>Fraud Score:</strong> <span className={item.fraudScore > 50 ? "high-risk" : "low-risk"}>{item.fraudScore}/100</span></p>
                      {item.deepfakeAlert && <p className="deep-fake-alert">⚠️ DEEPFAKE DETECTED</p>}
                    </div>
                  ))}
                </div>

                {selectedQueueItem && (
                  <article className="selected-item-details">
                    <h4>Selected: {selectedQueueItem.propertyId} - {selectedQueueItem.applicantName}</h4>
                    <p><strong>Status:</strong> {selectedQueueItem.status}</p>
                    <p><strong>AI Fraud Report:</strong> {selectedQueueItem.aiReport}</p>
                    <p><strong>Documents Uploaded:</strong> {selectedQueueItem.documents.join(", ")}</p>
                    
                    <div className="action-buttons">
                      {selectedQueueItem.status === "pending" && (
                        <>
                          <button
                            className="btn-approve"
                            onClick={() => updateQueueItemStatus(selectedQueueItem.id, "verified")}
                            type="button"
                          >
                            ✓ Approve & Apply Digital Stamp
                          </button>
                          <button
                            className="btn-flag"
                            onClick={() => updateQueueItemStatus(selectedQueueItem.id, "flagged")}
                            type="button"
                          >
                            🚩 Flag for Review
                          </button>
                          <button
                            className="btn-audit"
                            onClick={() => {
                              updateQueueItemStatus(selectedQueueItem.id, "manual-audit");
                              triggerManualAudit(selectedQueueItem.propertyId);
                            }}
                            type="button"
                          >
                            🔎 Trigger Manual Audit
                          </button>
                        </>
                      )}
                      {selectedQueueItem.status === "verified" && (
                        <button
                          className="btn-mint"
                          onClick={() => approveAndMint(selectedQueueItem.propertyId)}
                          type="button"
                        >
                          ⛓️ Mint on Blockchain
                        </button>
                      )}
                    </div>
                  </article>
                )}
              </article>
            )}

            {inspectorTab === "gis" && (
              <article className="inspector-module">
                <h3>🗺️ GIS & Satellite Audit - Boundary Validation</h3>
                {selectedQueueItem && selectedGIS && (
                  <div className="gis-audit-panel">
                    <div className="gis-header">
                      <h4>Property: {selectedQueueItem.propertyId}</h4>
                      <p><strong>Coordinates:</strong> {selectedQueueItem.latitude.toFixed(4)}, {selectedQueueItem.longitude.toFixed(4)}</p>
                      <p><strong>Registered Area:</strong> {selectedGIS.area} sq ft</p>
                    </div>

                    <div className="gis-conflict-detection">
                      <h4>Conflict Resolution</h4>
                      <div className="conflict-card">
                        <p><strong>Boundary Overlap:</strong> <span className={selectedQueueItem.boundaryOverlapPercent > 10 ? "high-risk" : "low-risk"}>{selectedQueueItem.boundaryOverlapPercent}%</span></p>
                        {selectedQueueItem.boundaryOverlapPercent > 10 ? (
                          <>
                            <p className="conflict-warning">⚠️ Overlap detected with adjacent property!</p>
                            <button
                              className="btn-satellite"
                              onClick={() => setShowSatelliteHistory(!showSatelliteHistory)}
                              type="button"
                            >
                              {showSatelliteHistory ? "Hide" : "Show"} Historical Satellite View (6 months ago)
                            </button>
                            {showSatelliteHistory && (
                              <p className="satellite-history">
                                📡 Satellite image from {new Date(new Date().setMonth(new Date().getMonth() - 6)).toDateString()}: 
                                Boundary was at {Math.max(0, selectedQueueItem.boundaryOverlapPercent - 5)}% overlap. 
                                Current fence position suggests recent unauthorized movement.
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="conflict-ok">✓ Boundary validated against cadastral records.</p>
                        )}
                      </div>
                    </div>

                    <div className="gis-map-display">
                      <p><strong>Master Cadastral Map Integration:</strong></p>
                      <div className="map-placeholder">
                        <p>📍 Boundary Points:</p>
                        <ul>
                          {selectedGIS.boundaryPoints.map((point, idx) => (
                            <li key={idx}>Point {idx + 1}: {point.lat.toFixed(6)}, {point.lng.toFixed(6)}</li>
                          ))}
                        </ul>
                        <p><strong style={{marginTop: "10px"}}>Last Satellite Update:</strong> {selectedGIS.lastSatelliteUpdateDate}</p>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            )}

            {inspectorTab === "kycD" && (
              <article className="inspector-module advanced-kyc-suite">
                <div className="kyc-header-section">
                  <h3>🔐 Advanced Digital Identity & KYC Approval Suite</h3>
                  <p className="kyc-subtitle">Multi-layered biometric, fraud detection, and compliance verification</p>
                </div>

                {/* KYC Module Navigation */}
                <nav className="kyc-module-nav">
                  <button className={kycModule === "biometric" ? "kyc-nav-btn active" : "kyc-nav-btn"} onClick={() => setKycModule("biometric")} type="button">👆 Biometric Auth</button>
                  <button className={kycModule === "zkp" ? "kyc-nav-btn active" : "kyc-nav-btn"} onClick={() => setKycModule("zkp")} type="button">🔒 Zero-Knowledge Proof</button>
                  <button className={kycModule === "fraud" ? "kyc-nav-btn active" : "kyc-nav-btn"} onClick={() => setKycModule("fraud")} type="button">🕵️ Fraud Intelligence</button>
                  <button className={kycModule === "multisig" ? "kyc-nav-btn active" : "kyc-nav-btn"} onClick={() => setKycModule("multisig")} type="button">📝 Multi-Sig & SRO</button>
                  <button className={kycModule === "compliance" ? "kyc-nav-btn active" : "kyc-nav-btn"} onClick={() => setKycModule("compliance")} type="button">✅ Compliance Check</button>
                  <button className={kycModule === "nri" ? "kyc-nav-btn active" : "kyc-nav-btn"} onClick={() => setKycModule("nri")} type="button">🌍 NRI e-KYC</button>
                </nav>

                {/* Property Selector */}
                <div className="kyc-property-selector">
                  <label>Select Property for KYC Review:</label>
                  <select value={kycSelectedProperty} onChange={(e) => switchKycProperty(e.target.value)} className="kyc-select">
                    {updatedQueue.map(item => (
                      <option key={item.id} value={item.propertyId}>{item.propertyId} - {item.applicantName}</option>
                    ))}
                  </select>
                </div>

                {/* MODULE 1: ADVANCED BIOMETRIC AUTHENTICATION */}
                {kycModule === "biometric" && (
                  <article className="kyc-module-page">
                    <div className="module-header">
                      <h4>👆 Advanced Multi-Modal Biometric Authentication</h4>
                      <p>Fingerprint, Facial Recognition & Iris Scan with Real-Time Liveness Detection</p>
                    </div>

                    <div className="biometric-results-grid">
                      {biometricVerificationResults.map((sample, idx) => (
                        <div key={idx} className={`biometric-card liveness-${sample.liveness}`}>
                          <div className="biometric-type">
                            {sample.type === "fingerprint" && "👆"}
                            {sample.type === "facialRecognition" && "😊"}
                            {sample.type === "irisScan" && "👁️"}
                            {" " + sample.type.replace(/([A-Z])/g, ' $1').toUpperCase()}
                          </div>
                          <div className="biometric-stat">
                            <span className="stat-label">Confidence</span>
                            <span className="stat-value">{sample.confidence}%</span>
                          </div>
                          <div className="biometric-stat">
                            <span className="stat-label">Liveness Score</span>
                            <span className={sample.livenessScore > 80 ? "stat-value high" : "stat-value low"}>{sample.livenessScore}%</span>
                          </div>
                          <div className="liveness-badge">
                            {sample.liveness === "live" && "✓ LIVE PERSON"}
                            {sample.liveness === "suspected_spoof" && "⚠️ SPOOF DETECTED"}
                            {sample.liveness === "unknown" && "❓ INCONCLUSIVE"}
                          </div>
                          <p className="timestamp">{sample.timestamp}</p>
                        </div>
                      ))}
                    </div>

                    <div className="biometric-signature">
                      <h5>🔑 Biometric Sign-Off Verification</h5>
                      <p className="info-text">Digital deed is locked with the verified owner's biometric. Only matching biometric can authorize transfers.</p>
                      <div className="signature-box">
                        <p><strong>Signature Hash:</strong> 0x{Math.random().toString(16).substring(2, 34).padEnd(32, "0")}</p>
                        <p><strong>Key Type:</strong> Composite (3-Factor: Fingerprint + Face + Iris)</p>
                        <p><strong>Encryption:</strong> ECC-256 with HSM Protection</p>
                        <button className="btn-approve" type="button">✓ Accept Biometric Lock</button>
                      </div>
                    </div>
                  </article>
                )}

                {/* MODULE 2: ZERO-KNOWLEDGE PROOFS & SSI */}
                {kycModule === "zkp" && (
                  <article className="kyc-module-page">
                    <div className="module-header">
                      <h4>🔒 Privacy-Preserving Verification (Zero-Knowledge Proofs & SSI)</h4>
                      <p>Prove eligibility without revealing sensitive personal data</p>
                    </div>

                    <div className="zkp-proof-panel">
                      <div className="proof-section">
                        <h5>Age Verification (ZKP)</h5>
                        <p className="info-text">Prove age ≥ 18 without revealing exact date of birth</p>
                        <div className="proof-result">
                          <span className={zkProofStatus.isAgeVerified ? "badge-success" : "badge-fail"}>
                            {zkProofStatus.isAgeVerified ? "✓ VERIFIED" : "✗ NOT VERIFIED"}
                          </span>
                          <p className="proof-hash">Proof: {zkProofStatus.proofHash}</p>
                        </div>
                      </div>

                      <div className="proof-section">
                        <h5>Ownership Verification (ZKP)</h5>
                        <p className="info-text">Prove rightful ownership without revealing full property details</p>
                        <div className="proof-result">
                          <span className={zkProofStatus.isOwnershipVerified ? "badge-success" : "badge-fail"}>
                            {zkProofStatus.isOwnershipVerified ? "✓ VERIFIED" : "✗ NOT VERIFIED"}
                          </span>
                          <p className="proof-hash">Proof: {zkProofStatus.proofHash}</p>
                        </div>
                      </div>

                      <div className="proof-section">
                        <h5>Overall ZKP Score</h5>
                        <div className="score-bar">
                          <div className="score-fill" style={{width: `${zkProofStatus.discretizedScore}%`}}></div>
                          <span className="score-text">{zkProofStatus.discretizedScore}/100</span>
                        </div>
                      </div>
                    </div>

                    <div className="ssi-wallet-section">
                      <h5>Self-Sovereign Identity (SSI) Digital Wallet</h5>
                      <p className="info-text">User controls what credentials are shared for each transaction</p>
                      <div className="credential-list">
                        <div className="credential-item">
                          <span className="cred-name">Age Certificate (≥18)</span>
                          <span className="cred-status">✓ In Wallet</span>
                        </div>
                        <div className="credential-item">
                          <span className="cred-name">Property Ownership Proof</span>
                          <span className="cred-status">✓ In Wallet</span>
                        </div>
                        <div className="credential-item">
                          <span className="cred-name">Income Level (Discretized)</span>
                          <span className="cred-status">✓ In Wallet</span>
                        </div>
                      </div>
                      <button className="btn-approve" onClick={generateZKProof} type="button">🔐 Generate Fresh ZKP for This Transaction</button>
                    </div>
                  </article>
                )}

                {/* MODULE 3: AI-POWERED FRAUD INTELLIGENCE */}
                {kycModule === "fraud" && (
                  <article className="kyc-module-page">
                    <div className="module-header">
                      <h4>🕵️ AI-Powered Fraud Intelligence</h4>
                      <p>Deepfake detection, document forensics, and identity linking</p>
                    </div>

                    <div className="fraud-analysis-grid">
                      <div className="fraud-card">
                        <h5>Deepfake Risk Score</h5>
                        <div className={`risk-dial risk-${fraudIntelligence.deepfakeRisk > 60 ? "high" : "low"}`}>
                          <div className="dial-value">{fraudIntelligence.deepfakeRisk}%</div>
                        </div>
                        <p className="risk-label">{fraudIntelligence.deepfakeRisk > 60 ? "🚨 HIGH RISK" : "✓ LOW RISK"}</p>
                      </div>

                      <div className="fraud-card">
                        <h5>Document Forensics Score</h5>
                        <div className={`risk-dial risk-${fraudIntelligence.documentForensicsScore < 50 ? "high" : "low"}`}>
                          <div className="dial-value">{fraudIntelligence.documentForensicsScore}</div>
                        </div>
                        <p className="risk-label">{fraudIntelligence.documentForensicsScore > 80 ? "✓ AUTHENTIC" : "🚨 SUSPICIOUS"}</p>
                      </div>

                      <div className="fraud-card">
                        <h5>Pixel Consistency (ID)</h5>
                        <div className="consistency-bar">
                          <div className="consistency-fill" style={{width: `${fraudIntelligence.pixelConsistency}%`}}></div>
                          <span>{fraudIntelligence.pixelConsistency}%</span>
                        </div>
                        <p className="risk-label">{fraudIntelligence.pixelConsistency > 95 ? "✓ NATURAL IMAGE" : "⚠️ EDITED"}</p>
                      </div>

                      <div className="fraud-card">
                        <h5>Government Seal Validation</h5>
                        <div className={`seal-badge ${fraudIntelligence.governmentSealValidation ? "valid" : "invalid"}`}>
                          {fraudIntelligence.governmentSealValidation ? "✓ AUTHENTIC" : "🚫 FORGED"}
                        </div>
                      </div>

                      <div className="fraud-card">
                        <h5>Benami Suspicion Score</h5>
                        <div className={`risk-dial risk-${fraudIntelligence.benamisuspicion > 50 ? "high" : "low"}`}>
                          <div className="dial-value">{fraudIntelligence.benamisuspicion}%</div>
                        </div>
                        <p className="risk-label">{fraudIntelligence.benamisuspicion > 50 ? "⚠️ PROXY OWNER?" : "✓ LEGITIMATE"}</p>
                      </div>

                      <div className="fraud-card">
                        <h5>Duplicate Registration Risk</h5>
                        <div className={`risk-dial risk-${fraudIntelligence.duplicateRegistrationRisk > 40 ? "high" : "low"}`}>
                          <div className="dial-value">{fraudIntelligence.duplicateRegistrationRisk}%</div>
                        </div>
                        <p className="risk-label">{fraudIntelligence.duplicateRegistrationRisk > 40 ? "🚨 POSSIBLE" : "✓ CLEAR"}</p>
                      </div>
                    </div>

                    {fraudIntelligence.flagsFound.length > 0 && (
                      <div className="fraud-flags-alert">
                        <h5>🚩 Detected Fraud Indicators</h5>
                        <ul className="flags-list">
                          {fraudIntelligence.flagsFound.map((flag, idx) => (
                            <li key={idx} className="flag-item">⚠️ {flag}</li>
                          ))}
                        </ul>
                        <button className="btn-audit" type="button">🔎 Escalate to Manual Audit</button>
                      </div>
                    )}
                  </article>
                )}

                {/* MODULE 4: MULTI-SIG & SRO VERIFICATION */}
                {kycModule === "multisig" && (
                  <article className="kyc-module-page">
                    <div className="module-header">
                      <h4>📝 Multi-Signature & SRO Digital Handshake</h4>
                      <p>Multi-party verification for high-value transactions</p>
                    </div>

                    <div className="transaction-info">
                      <p><strong>Transaction Value:</strong> ₹{multiSigStatus.transactionValue.toLocaleString()}</p>
                      <p><strong>Multi-Sig Required:</strong> {multiSigStatus.multiSigRequired ? "YES - 3 of 3 signatures needed" : "NO - Single signature sufficient"}</p>
                    </div>

                    <div className="multisig-chain">
                      <div className={`sig-step sig-${multiSigStatus.ownerSignature.verified ? "verified" : "pending"}`}>
                        <div className="sig-step-header">
                          <h5>1️⃣ Owner Signature</h5>
                          <span className={`sig-badge ${multiSigStatus.ownerSignature.verified ? "verified" : "pending"}`}>
                            {multiSigStatus.ownerSignature.verified ? "✓ SIGNED" : "⏳ PENDING"}
                          </span>
                        </div>
                        {multiSigStatus.ownerSignature.verified && (
                          <p className="dsc-info">DSC: {multiSigStatus.ownerSignature.dsc} | {multiSigStatus.ownerSignature.timestamp}</p>
                        )}
                        {!multiSigStatus.ownerSignature.verified && (
                          <button className="btn-approve" onClick={() => approveMultiSig("owner")} type="button">Sign as Owner</button>
                        )}
                      </div>

                      <div className={`sig-step sig-${multiSigStatus.legalCounselSignature.verified ? "verified" : "pending"}`}>
                        <div className="sig-step-header">
                          <h5>2️⃣ Legal Counsel Signature</h5>
                          <span className={`sig-badge ${multiSigStatus.legalCounselSignature.verified ? "verified" : "pending"}`}>
                            {multiSigStatus.legalCounselSignature.verified ? "✓ SIGNED" : "⏳ PENDING"}
                          </span>
                        </div>
                        {multiSigStatus.legalCounselSignature.verified && (
                          <p className="dsc-info">DSC: {multiSigStatus.legalCounselSignature.dsc} | {multiSigStatus.legalCounselSignature.timestamp}</p>
                        )}
                        {!multiSigStatus.legalCounselSignature.verified && (
                          <button className="btn-approve" onClick={() => approveMultiSig("counsel")} type="button">Sign as Counsel</button>
                        )}
                      </div>

                      <div className={`sig-step sig-${multiSigStatus.sroSignature.verified ? "verified" : "pending"}`}>
                        <div className="sig-step-header">
                          <h5>3️⃣ SRO Digital Handshake</h5>
                          <span className={`sig-badge ${multiSigStatus.sroSignature.verified ? "verified" : "pending"}`}>
                            {multiSigStatus.sroSignature.verified ? "✓ APPROVED" : "⏳ PENDING"}
                          </span>
                        </div>
                        <p className="sro-note">Final e-KYC check by Government Sub-Registrar</p>
                        {!multiSigStatus.sroSignature.verified && (
                          <button className="btn-approve" onClick={() => approveMultiSig("sro")} type="button">SRO Approval & Digital Handshake</button>
                        )}
                        {multiSigStatus.sroSignature.verified && (
                          <p className="dsc-info">DSC: {multiSigStatus.sroSignature.dsc} | {multiSigStatus.sroSignature.timestamp}</p>
                        )}
                      </div>
                    </div>

                    {multiSigStatus.ownerSignature.verified && multiSigStatus.legalCounselSignature.verified && multiSigStatus.sroSignature.verified && (
                      <div className="multisig-complete">
                        <p className="complete-message">🎉 All signatures collected! Transaction ready for blockchain minting.</p>
                      </div>
                    )}
                  </article>
                )}

                {/* MODULE 5: COMPLIANCE & TAX FLAGGING */}
                {kycModule === "compliance" && (
                  <article className="kyc-module-page">
                    <div className="module-header">
                      <h4>✅ Compliance & AML Tax Flagging</h4>
                      <p>Automated tax linkage and money laundering detection</p>
                    </div>

                    <div className="compliance-checks-grid">
                      <div className={`compliance-card check-${complianceCheck.panLinked ? "pass" : "fail"}`}>
                        <h5>PAN Linkage</h5>
                        <div className="check-status">
                          {complianceCheck.panLinked ? "✓ LINKED" : "✗ NOT LINKED"}
                        </div>
                        <p className="check-detail">Identity linked to government tax records</p>
                      </div>

                      <div className={`compliance-card check-${complianceCheck.taxCompliant ? "pass" : "fail"}`}>
                        <h5>Tax Compliance Status</h5>
                        <div className="check-status">
                          {complianceCheck.taxCompliant ? "✓ COMPLIANT" : "✗ NON-COMPLIANT"}
                        </div>
                        <p className="check-detail">No pending tax liabilities detected</p>
                      </div>

                      <div className={`compliance-card check-${complianceCheck.incomeMatch ? "pass" : "fail"}`}>
                        <h5>Income-to-Property Match</h5>
                        <div className="check-status">
                          {complianceCheck.incomeMatch ? "✓ REASONABLE" : "⚠️ MISMATCH"}
                        </div>
                        <p className="check-detail">Property value aligns with declared income</p>
                      </div>

                      <div className={`compliance-card check-${complianceCheck.moneyLaunderingRisk < 50 ? "pass" : "fail"}`}>
                        <h5>Money Laundering Risk</h5>
                        <div className="risk-meter">
                          <div className="risk-bar" style={{width: `${complianceCheck.moneyLaunderingRisk}%`}}></div>
                          <span>{complianceCheck.moneyLaunderingRisk}%</span>
                        </div>
                        <p className="check-detail">{complianceCheck.moneyLaunderingRisk > 50 ? "🚨 HIGH" : "✓ LOW"} AML Risk</p>
                      </div>
                    </div>

                    {complianceCheck.amlFlags.length > 0 && (
                      <div className="aml-flags-section">
                        <h5>🚩 AML Compliance Flags</h5>
                        <ul className="aml-flags-list">
                          {complianceCheck.amlFlags.map((flag, idx) => (
                            <li key={idx}>⚠️ {flag}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </article>
                )}

                {/* MODULE 6: NRI CONSULATE E-KYC */}
                {kycModule === "nri" && (
                  <article className="kyc-module-page">
                    <div className="module-header">
                      <h4>🌍 NRI Consulate e-KYC Module</h4>
                      <p>Specially designed for Non-Resident Indians verification</p>
                    </div>

                    {nriVerification.nriStatus ? (
                      <div className="nri-verified-panel">
                        <div className="nri-status-badge verified">
                          ✓ NRI VERIFIED
                        </div>
                        <div className="nri-details">
                          <p><strong>Consulate:</strong> {nriVerification.consulate}</p>
                          <p><strong>Consulate Verification:</strong> {nriVerification.consulateVerified ? "✓ APPROVED" : "✗ PENDING"}</p>
                          <p><strong>Power of Attorney:</strong> {nriVerification.powerOfAttorneyVerified ? "✓ VERIFIED (Digital)" : "✗ NOT VERIFIED"}</p>
                          <p><strong>Credential Hash:</strong> {nriVerification.credentialHash}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="nri-selection-panel">
                        <h5>Select Consulate Location</h5>
                        <div className="consulate-options">
                          {["Indian High Commission, London", "Indian Consulate, New York", "Indian Consulate, Dubai", "Indian Consulate, Singapore"].map(consulate => (
                            <button
                              key={consulate}
                              className="consulate-btn"
                              onClick={() => performNRIConsulateVerification(consulate)}
                              type="button"
                            >
                              🏛️ {consulate}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="nri-features">
                      <h5>NRI-Specific Verification Features</h5>
                      <ul className="features-list">
                        <li>✓ Consulate-based identity validation (eliminates need for PoA)</li>
                        <li>✓ Self-Sovereign Identity (SSI) digital credentials</li>
                        <li>✓ Multi-modal biometric through consulate portal</li>
                        <li>✓ Automatic PAN linking for Indian tax compliance</li>
                        <li>✓ No physical Power of Attorney document required</li>
                        <li>✓ Zero-Knowledge Proof for age & income verification</li>
                      </ul>
                    </div>
                  </article>
                )}
              </article>
            )}


            {inspectorTab === "ledger" && (
              <article className="inspector-module">
                <h3>⛓️ Smart Contract & Escrow Management</h3>
                {selectedQueueItem && selectedTax && (
                  <div className="ledger-panel">
                    <div className="smart-contract-control">
                      <h4>Title Freezing & Smart Contract Pause</h4>
                      <div className="contract-card">
                        <p><strong>Property:</strong> {selectedQueueItem.propertyId}</p>
                        <p><strong>Current Status:</strong> {contractPaused[selectedQueueItem.propertyId] ? "PAUSED" : "ACTIVE"}</p>
                        <button
                          className={contractPaused[selectedQueueItem.propertyId] ? "btn-resume" : "btn-pause"}
                          onClick={() => toggleContractPause(selectedQueueItem.propertyId)}
                          type="button"
                        >
                          {contractPaused[selectedQueueItem.propertyId] ? "▶️ Resume Contract" : "⏸️ Pause Contract"}
                        </button>
                        <p className="contract-note">Use pause for court-ordered stays or legal disputes to prevent unauthorized transfers.</p>
                      </div>
                    </div>

                    <div className="tax-collection-monitor">
                      <h4>Automated Tax Collection & Escrow Ledger</h4>
                      <div className="tax-details">
                        <p><strong>Property ID:</strong> {selectedTax.propertyId}</p>
                        <p><strong>Stamp Duty:</strong> ₹{selectedTax.stampDuty.toLocaleString()}</p>
                        <p><strong>Registration Fee:</strong> ₹{selectedTax.registrationFee.toLocaleString()}</p>
                        <p><strong>Total Due:</strong> ₹{(selectedTax.stampDuty + selectedTax.registrationFee).toLocaleString()}</p>
                        <p><strong>Collected:</strong> ₹{selectedTax.collected.toLocaleString()}</p>
                        <p><strong>Remaining:</strong> ₹{selectedTax.remaining.toLocaleString()}</p>
                        <p><strong>Status:</strong> <span className={`tax-status ${selectedTax.status}`}>{selectedTax.status.toUpperCase()}</span></p>
                      </div>

                      <div className="tax-actions">
                        <input
                          type="number"
                          min="1000"
                          step="1000"
                          placeholder="Amount to collect"
                          id="tax-amount-input"
                          className="tax-input"
                        />
                        <button
                          className="btn-collect"
                          onClick={() => {
                            const input = document.getElementById("tax-amount-input") as HTMLInputElement;
                            const amount = parseInt(input?.value || "0", 10);
                            if (amount > 0) {
                              collectTax(selectedQueueItem.propertyId, amount);
                              input.value = "";
                            }
                          }}
                          type="button"
                        >
                          💰 Collect Tax & Update Escrow
                        </button>
                      </div>
                    </div>

                    <div className="escrow-complete-action">
                      {selectedTax.status === "complete" && (
                        <button
                          className="btn-deed-transfer"
                          onClick={() => approveAndMint(selectedQueueItem.propertyId)}
                          type="button"
                        >
                          ✓ All Taxes Collected - Approve Deed Transfer
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </article>
            )}
          </section>
            )
        )}

        {role === "Bank Officer" && sidebarNav === "collateral" && (
          <section className="bank-suite">
            <article className="bank-persona-strip">
              <div className="bank-persona-head">
                <h4>Bank Officer Role Mode</h4>
                <p>Choose your specialist role. The platform highlights and opens the best-fit sub-domain page.</p>
              </div>
              <div className="bank-persona-buttons">
                {(Object.keys(bankPersonaDetails) as BankOfficerPersona[]).map((persona) => (
                  <button
                    key={persona}
                    className={bankPersona === persona ? "bank-persona-btn active" : "bank-persona-btn"}
                    onClick={() => {
                      setBankPersona(persona);
                      setSidebarNav(bankPersonaDetails[persona].recommendedDomain);
                    }}
                    type="button"
                  >
                    {bankPersonaDetails[persona].title}
                  </button>
                ))}
              </div>
              <p className="bank-persona-reco">
                Recommended Domain: <strong>{bankPersonaDetails[bankPersona].recommendedDomain.toUpperCase()}</strong> - {bankPersonaDetails[bankPersona].subtitle}
              </p>
              <div className="bank-domain-chips">
                {(["collateral", "avm", "aml", "escrow"] as const).map((domain) => (
                  <span
                    key={domain}
                    className={
                      "bank-domain-chip" +
                      (sidebarNav === domain ? " active" : "") +
                      (bankPersonaDetails[bankPersona].recommendedDomain === domain ? " recommended" : "")
                    }
                  >
                    {domain.toUpperCase()}
                  </span>
                ))}
              </div>
            </article>
            <article className="bank-module feature-page">
              <h3>1. Collateral Integrity & Asset Verification</h3>
              <p>Prevent ghost loans and multiple financing using immutable lien checks and deed fingerprint validation.</p>
              <div className="office-record-box">
                <h4>Smart Lien & Deed Registry</h4>
                <ul>
                  <li>Property ID: {officeDossier.propertyId}</li>
                  <li>QR Code: {officeDossier.qrCode}</li>
                  <li>Registered deed hash: {officeDossier.deedHash}</li>
                  <li>Existing mortgage bank: {officeDossier.lienBank}</li>
                </ul>
              </div>
              <div className="bank-form-row">
                <input
                  type="text"
                  value={propertyReference}
                  onChange={(event) => setPropertyReference(event.target.value)}
                  placeholder="Enter property ID or QR for lien check"
                />
                <button className="bank-btn" type="button" onClick={runLienCheck}>
                  Run Lien & Encumbrance Audit
                </button>
              </div>
              <p className={`bank-status ${lienStatus}`}><strong>Lien Output:</strong> {lienMessage}</p>
              <div className="bank-form-row">
                <input
                  type="text"
                  value={deedHashInput}
                  onChange={(event) => setDeedHashInput(event.target.value)}
                  placeholder="Paste digital deed hash"
                />
                <button className="bank-btn" type="button" onClick={runDocumentIntegrityCheck}>
                  Run Property Fingerprint Match
                </button>
              </div>
              <p className={docIntegrity === "tampered" ? "risk-bad" : "risk-good"}>
                {docIntegrity === "unknown"
                  ? "Fingerprint status pending."
                  : docIntegrity === "valid"
                  ? "Hash matched. No deed tampering detected."
                  : "Hash mismatch. Potential forged deed alteration detected."}
              </p>
              <div className="bank-form-row">
                <input
                  type="text"
                  value={consortiumBankInput}
                  onChange={(event) => setConsortiumBankInput(event.target.value)}
                  placeholder="Enter requesting bank name"
                />
                <button className="bank-btn" type="button" onClick={runConsortiumCheck}>
                  Check Multiple Financing Risk
                </button>
              </div>
              <p className={consortiumVerdict.includes("warning") ? "risk-bad" : "risk-good"}>{consortiumVerdict}</p>
            </article>
          </section>
        )}

        {role === "Bank Officer" && sidebarNav === "avm" && (
          <section className="bank-suite">
            <article className="bank-persona-strip">
              <div className="bank-persona-head">
                <h4>Bank Officer Role Mode</h4>
                <p>Choose your specialist role. The platform highlights and opens the best-fit sub-domain page.</p>
              </div>
              <div className="bank-persona-buttons">
                {(Object.keys(bankPersonaDetails) as BankOfficerPersona[]).map((persona) => (
                  <button
                    key={persona}
                    className={bankPersona === persona ? "bank-persona-btn active" : "bank-persona-btn"}
                    onClick={() => {
                      setBankPersona(persona);
                      setSidebarNav(bankPersonaDetails[persona].recommendedDomain);
                    }}
                    type="button"
                  >
                    {bankPersonaDetails[persona].title}
                  </button>
                ))}
              </div>
              <p className="bank-persona-reco">
                Recommended Domain: <strong>{bankPersonaDetails[bankPersona].recommendedDomain.toUpperCase()}</strong> - {bankPersonaDetails[bankPersona].subtitle}
              </p>
              <div className="bank-domain-chips">
                {(["collateral", "avm", "aml", "escrow"] as const).map((domain) => (
                  <span
                    key={domain}
                    className={
                      "bank-domain-chip" +
                      (sidebarNav === domain ? " active" : "") +
                      (bankPersonaDetails[bankPersona].recommendedDomain === domain ? " recommended" : "")
                    }
                  >
                    {domain.toUpperCase()}
                  </span>
                ))}
              </div>
            </article>
            <article className="bank-module feature-page">
              <h3>2. Automated Valuation Model (AVM) Audit</h3>
              <p>Detect appraisal fraud using GIS-linked context and anomaly checks against area-linked value behavior.</p>
              <div className="office-record-box">
                <h4>GIS Linked Valuation Inputs</h4>
                <ul>
                  <li>Registered area: {officeDossier.registeredArea} sq ft</li>
                  <li>Digital twin area: {officeDossier.measuredArea} sq ft</li>
                  <li>Zone code: {officeDossier.satelliteZone}</li>
                </ul>
              </div>
              <div className="bank-form-row">
                <input
                  type="number"
                  min="100"
                  value={claimedArea}
                  onChange={(event) => setClaimedArea(event.target.value)}
                  placeholder="Claimed area from appraisal"
                />
                <button className="bank-btn" type="button" onClick={runValuationAudit}>
                  Run GIS-Linked Valuation Audit
                </button>
              </div>
              <p><strong>Digital Twin Timestamp:</strong> {digitalTwinTimestamp}</p>
              <p><strong>Claimed vs Measured:</strong> {claimedArea} vs {measuredArea ?? "--"} sq ft</p>
              <p><strong>Anomaly/Fraud Score:</strong> {valuationRiskScore}/100</p>
              <div className="bank-form-row">
                <input
                  type="text"
                  value={surveyZoneInput}
                  onChange={(event) => setSurveyZoneInput(event.target.value)}
                  placeholder="Enter GIS zone for boundary truthing"
                />
                <button className="bank-btn" type="button" onClick={runEncroachmentCheck}>
                  Validate Ground Boundary Overlap
                </button>
              </div>
              <p className={encroachmentDetected ? "risk-bad" : "risk-good"}>
                {overlapPercent === null
                  ? "Boundary audit pending."
                  : encroachmentDetected
                  ? `Boundary overlap ${overlapPercent}%. Valuation risk escalated.`
                  : "No overlap anomaly from GIS perimeter check."}
              </p>
            </article>
          </section>
        )}

        {role === "Bank Officer" && sidebarNav === "aml" && (
          <section className="bank-suite">
            <article className="bank-persona-strip">
              <div className="bank-persona-head">
                <h4>Bank Officer Role Mode</h4>
                <p>Choose your specialist role. The platform highlights and opens the best-fit sub-domain page.</p>
              </div>
              <div className="bank-persona-buttons">
                {(Object.keys(bankPersonaDetails) as BankOfficerPersona[]).map((persona) => (
                  <button
                    key={persona}
                    className={bankPersona === persona ? "bank-persona-btn active" : "bank-persona-btn"}
                    onClick={() => {
                      setBankPersona(persona);
                      setSidebarNav(bankPersonaDetails[persona].recommendedDomain);
                    }}
                    type="button"
                  >
                    {bankPersonaDetails[persona].title}
                  </button>
                ))}
              </div>
              <p className="bank-persona-reco">
                Recommended Domain: <strong>{bankPersonaDetails[bankPersona].recommendedDomain.toUpperCase()}</strong> - {bankPersonaDetails[bankPersona].subtitle}
              </p>
              <div className="bank-domain-chips">
                {(["collateral", "avm", "aml", "escrow"] as const).map((domain) => (
                  <span
                    key={domain}
                    className={
                      "bank-domain-chip" +
                      (sidebarNav === domain ? " active" : "") +
                      (bankPersonaDetails[bankPersona].recommendedDomain === domain ? " recommended" : "")
                    }
                  >
                    {domain.toUpperCase()}
                  </span>
                ))}
              </div>
            </article>
            <article className="bank-module feature-page">
              <h3>3. Financial Identity & AML</h3>
              <p>Triangulate KYC identity and source of funds to detect laundering patterns and fake-name property flips.</p>
              <div className="office-record-box">
                <h4>KYC-PAN-Aadhaar Triangulation Inputs</h4>
                <ul>
                  <li>Owner in office file: {officeDossier.ownerName}</li>
                  <li>Biometric token: {officeDossier.biometricToken}</li>
                  <li>Passkey code: {officeDossier.passkeyCode}</li>
                </ul>
              </div>
              <div className="bank-form-row">
                <input
                  type="text"
                  value={biometricTokenInput}
                  onChange={(event) => setBiometricTokenInput(event.target.value)}
                  placeholder="Biometric token"
                />
                <input
                  type="text"
                  value={passkeyInput}
                  onChange={(event) => setPasskeyInput(event.target.value)}
                  placeholder="Passkey code"
                />
                <button className="bank-btn" type="button" onClick={runIdentityAndSignatureAuth}>
                  Run KYC-PAN-Aadhaar Triangulation
                </button>
              </div>
              <p>{identityMessage}</p>
              <p><strong>Biometric Match:</strong> {biometricMatchScore ?? "--"}%</p>
              <p><strong>Agreement Hash:</strong> {agreementHash}</p>
              <button className="bank-btn" type="button" onClick={runAdvancedRiskEngine}>
                Run Source-of-Funds AML Signal Scan
              </button>
              <ul className="mini-list">
                {advancedAlerts.length === 0 && <li>AML signal engine idle.</li>}
                {advancedAlerts.map((alert) => (
                  <li key={alert}>{alert}</li>
                ))}
              </ul>
            </article>
          </section>
        )}

        {role === "Bank Officer" && sidebarNav === "escrow" && (
          <section className="bank-suite">
            <article className="bank-persona-strip">
              <div className="bank-persona-head">
                <h4>Bank Officer Role Mode</h4>
                <p>Choose your specialist role. The platform highlights and opens the best-fit sub-domain page.</p>
              </div>
              <div className="bank-persona-buttons">
                {(Object.keys(bankPersonaDetails) as BankOfficerPersona[]).map((persona) => (
                  <button
                    key={persona}
                    className={bankPersona === persona ? "bank-persona-btn active" : "bank-persona-btn"}
                    onClick={() => {
                      setBankPersona(persona);
                      setSidebarNav(bankPersonaDetails[persona].recommendedDomain);
                    }}
                    type="button"
                  >
                    {bankPersonaDetails[persona].title}
                  </button>
                ))}
              </div>
              <p className="bank-persona-reco">
                Recommended Domain: <strong>{bankPersonaDetails[bankPersona].recommendedDomain.toUpperCase()}</strong> - {bankPersonaDetails[bankPersona].subtitle}
              </p>
              <div className="bank-domain-chips">
                {(["collateral", "avm", "aml", "escrow"] as const).map((domain) => (
                  <span
                    key={domain}
                    className={
                      "bank-domain-chip" +
                      (sidebarNav === domain ? " active" : "") +
                      (bankPersonaDetails[bankPersona].recommendedDomain === domain ? " recommended" : "")
                    }
                  >
                    {domain.toUpperCase()}
                  </span>
                ))}
              </div>
            </article>
            <article className="bank-module feature-page">
              <h3>4. Smart Escrow & Disbursement Control</h3>
              <p>Release funds only after blockchain title transfer confirmation and enforce direct-to-seller payout.</p>
              <div className="office-record-box">
                <h4>Escrow Conditions</h4>
                <ul>
                  <li>Escrow cap: INR {officeDossier.escrowLimit}</li>
                  <li>Expected seller: {officeDossier.ownerName}</li>
                  <li>Conditional release: post title transfer + lien recording</li>
                </ul>
              </div>
              <div className="bank-form-row">
                <input
                  type="number"
                  min="100000"
                  step="10000"
                  value={loanAmount}
                  onChange={(event) => setLoanAmount(event.target.value)}
                  placeholder="Loan amount"
                />
                <input
                  type="text"
                  value={sellerNameInput}
                  onChange={(event) => setSellerNameInput(event.target.value)}
                  placeholder="Seller name (direct payment)"
                />
                <button className="bank-btn" type="button" onClick={advanceEscrow}>
                  Trigger Conditional Smart Escrow
                </button>
              </div>
              <p><strong>Current Stage:</strong> {escrowStage}</p>
              <ul className="mini-list">
                {escrowLedger.length === 0 && <li>No disbursement events yet.</li>}
                {escrowLedger.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <button className="bank-btn secondary" type="button" onClick={resetBankWorkflow}>
                Reset Escrow Flow
              </button>
            </article>
          </section>
        )}

        {role === "Common User" && sidebarNav === "locker" && (
          <section className="bank-suite">
            <article className="bank-module feature-page user-module">
              <h3>🗃️ Digital Land Locker with Voice AI</h3>
              <p>Secure encrypted vault for mother deeds, tax receipts, and encumbrance certificates with voice-based retrieval.</p>
              <div className="bank-form-row user-form-row">
                <input
                  type="text"
                  value={lockerDocName}
                  onChange={(event) => setLockerDocName(event.target.value)}
                  placeholder="Document name"
                />
                <select value={lockerDocCategory} onChange={(event) => setLockerDocCategory(event.target.value as LandLockerDoc["category"])}>
                  <option value="Mother Deed">Mother Deed</option>
                  <option value="Tax Receipt">Tax Receipt</option>
                  <option value="Encumbrance Certificate">Encumbrance Certificate</option>
                  <option value="Other">Other</option>
                </select>
                <button className="bank-btn" type="button" onClick={addLockerDocument}>Upload Encrypted Doc</button>
              </div>
              <div className="bank-form-row user-form-row">
                <input
                  type="text"
                  value={voiceQuery}
                  onChange={(event) => setVoiceQuery(event.target.value)}
                  placeholder="Ask Voice AI: show my EC"
                />
                <button className="bank-btn" type="button" onClick={runVoiceAssistant}>Run Voice AI</button>
              </div>
              <p className="user-ai-response">{voiceAnswer}</p>
              <ul className="mini-list">
                {lockerDocs.map((doc) => (
                  <li key={doc.id}>
                    {doc.name} | {doc.category} | {doc.uploadedAt} | {doc.encrypted ? "Encrypted" : "Unencrypted"}
                  </li>
                ))}
              </ul>
            </article>
          </section>
        )}

        {role === "Common User" && sidebarNav === "alerts" && (
          <section className="bank-suite">
            <article className="bank-module feature-page user-module">
              <h3>🚨 Anti-Theft Push Notifications (Bhu-Aadhaar Alerts)</h3>
              <p>If anyone queries your ULPIN or initiates transfer, you get instant alerts and can freeze the title immediately.</p>
              <button className="bank-btn" type="button" onClick={simulateBhuAadhaarQuery}>
                Simulate ULPIN Query Alert
              </button>
              <p className={titleFreezeActive ? "risk-bad" : "risk-good"}>
                Title Freeze: {titleFreezeActive ? "ACTIVE - transaction halted" : "INACTIVE"}
              </p>
              <ul className="mini-list user-alert-list">
                {bhuAlerts.length === 0 && <li>No alerts yet.</li>}
                {bhuAlerts.map((alert) => (
                  <li key={alert.id}>
                    <div>
                      <strong>{alert.ulpin}</strong> | {alert.action} | {alert.actor} | {alert.timestamp}
                    </div>
                    <button
                      className="bank-btn secondary"
                      disabled={alert.frozen}
                      type="button"
                      onClick={() => freezeTitleFromAlert(alert.id)}
                    >
                      {alert.frozen ? "Frozen" : "Freeze Transaction"}
                    </button>
                  </li>
                ))}
              </ul>
            </article>
          </section>
        )}

        {role === "Common User" && sidebarNav === "inheritance" && (
          <section className="bank-suite">
            <article className="bank-module feature-page user-module inheritance-module">
              <h3>🧬 Smart Inheritance & Dead Man's Switch</h3>
              <p>Automate death-related transfer disputes by locking succession rules on-chain and executing transfer only after digital death-certificate verification.</p>

              <div className="office-record-box inheritance-summary">
                <h4>Succession Contract Status</h4>
                <ul>
                  <li>Digital Will Hash: {digitalWillHash}</li>
                  <li>Will Lock: {digitalWillLocked ? "LOCKED" : "DRAFT"}</li>
                  <li>Dead Man's Switch: {deadManSwitchArmed ? "ARMED" : "DISARMED"}</li>
                  <li>Death Certificate: {deathCertificateVerified ? "VERIFIED" : "PENDING"}</li>
                  <li>Auto Transfer: {autoTransferExecuted ? "EXECUTED" : "NOT EXECUTED"}</li>
                </ul>
              </div>

              <div className="bank-form-row user-form-row inheritance-form-row">
                <input
                  type="text"
                  value={heirNameInput}
                  onChange={(event) => setHeirNameInput(event.target.value)}
                  placeholder="Heir full name"
                  disabled={digitalWillLocked}
                />
                <select
                  value={heirRelationInput}
                  onChange={(event) => setHeirRelationInput(event.target.value)}
                  disabled={digitalWillLocked}
                >
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={heirShareInput}
                  onChange={(event) => setHeirShareInput(event.target.value)}
                  placeholder="Share %"
                  disabled={digitalWillLocked}
                />
                <input
                  type="text"
                  value={heirWalletInput}
                  onChange={(event) => setHeirWalletInput(event.target.value)}
                  placeholder="Heir wallet / DID"
                  disabled={digitalWillLocked}
                />
              </div>
              <button className="bank-btn" type="button" onClick={addInheritanceHeir} disabled={digitalWillLocked}>Add Heir to Draft</button>
              <p className={totalHeirShare === 100 ? "risk-good" : "risk-note"}>Allocated Share: {totalHeirShare}% / 100%</p>

              <ul className="mini-list inheritance-heir-list">
                {inheritanceHeirs.map((heir) => (
                  <li key={heir.id}>
                    <div>
                      <strong>{heir.name}</strong> ({heir.relation}) | {heir.sharePercent}% | {heir.wallet}
                    </div>
                    <button
                      className="bank-btn secondary"
                      type="button"
                      disabled={heir.verified || digitalWillLocked}
                      onClick={() => verifyHeirIdentity(heir.id)}
                    >
                      {heir.verified ? "Verified" : "Verify Heir"}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="bank-form-row user-form-row inheritance-controls">
                <button className="bank-btn" type="button" onClick={lockDigitalWill} disabled={digitalWillLocked}>Lock Digital Will</button>
                <input
                  type="number"
                  min="7"
                  max="180"
                  value={inactivityWindowDays}
                  onChange={(event) => setInactivityWindowDays(event.target.value)}
                  placeholder="Inactivity days"
                />
                <button className="bank-btn" type="button" onClick={armDeadManSwitch} disabled={!digitalWillLocked || deadManSwitchArmed}>Arm Dead Man's Switch</button>
                <button className="bank-btn secondary" type="button" onClick={ownerHeartbeatCheckIn}>Owner Check-In</button>
              </div>
              <p className="risk-note">Last owner heartbeat: {lastOwnerCheckIn}</p>

              <div className="bank-form-row user-form-row inheritance-controls">
                <input
                  type="text"
                  value={deathCertificateInput}
                  onChange={(event) => setDeathCertificateInput(event.target.value)}
                  placeholder="Death Certificate ID (e.g. DC-KA-2026-44122)"
                />
                <button className="bank-btn" type="button" onClick={verifyDeathCertificate}>Verify Death Certificate</button>
                <button className="bank-btn" type="button" onClick={executeInheritanceTransfer} disabled={!deathCertificateVerified || autoTransferExecuted}>
                  Execute Auto Transfer
                </button>
              </div>

              <div className="office-record-box inheritance-log-box">
                <h4>Immutable Succession Audit Trail</h4>
                <ul>
                  {inheritanceLog.length === 0 && <li>No succession events yet.</li>}
                  {inheritanceLog.map((entry) => (
                    <li key={entry}>{entry}</li>
                  ))}
                </ul>
              </div>
            </article>
          </section>
        )}

        {role === "Common User" && sidebarNav === "vigilance" && (
          <section className="bank-suite">
            <article className="bank-module feature-page user-module">
              <h3>🧭 Community-Based Vigilance Map</h3>
              <p>Verified neighbors can vouch for boundaries and report unauthorized construction for satellite confirmation.</p>
              <div className="office-record-box">
                <h4>Neighborhood Trust Layer</h4>
                <ul>
                  <li>Neighbor vouch status: 4 verified neighbors</li>
                  <li>Boundary confidence: 91%</li>
                  <li>Satellite watch: Continuous every 72 hours</li>
                </ul>
              </div>
              <div className="bank-form-row user-form-row">
                <input
                  type="text"
                  value={vigilanceIssue}
                  onChange={(event) => setVigilanceIssue(event.target.value)}
                  placeholder="Report issue: unauthorized wall construction"
                />
                <button className="bank-btn" type="button" onClick={submitVigilanceReport}>Submit Community Report</button>
              </div>
              <ul className="mini-list">
                {vigilanceReports.length === 0 && <li>No vigilance reports submitted.</li>}
                {vigilanceReports.map((report) => (
                  <li key={report.id}>
                    {report.plotId} | {report.issue} | Satellite: {report.satelliteStatus.toUpperCase()}
                  </li>
                ))}
              </ul>
            </article>
          </section>
        )}

        {role === "Common User" && sidebarNav === "onetap" && (
          <section className="bank-suite">
            <article className="bank-module feature-page user-module">
              <h3>📲 One-Tap Verification for Buyers</h3>
              <p>Scan property QR and compare phone GPS with blockchain records to get instant Property Health Score.</p>
              <div className="bank-form-row user-form-row">
                <input
                  type="text"
                  value={buyerQrInput}
                  onChange={(event) => setBuyerQrInput(event.target.value)}
                  placeholder="Scan/enter brochure QR"
                />
                <input
                  type="text"
                  value={buyerGpsInput}
                  onChange={(event) => setBuyerGpsInput(event.target.value)}
                  placeholder="Enter current GPS (lat,lng)"
                />
                <button className="bank-btn" type="button" onClick={runOneTapBuyerVerification}>Verify Now</button>
              </div>
              {oneTapResult && (
                <div className="office-record-box">
                  <h4>Verification Result</h4>
                  <ul>
                    <li>Property ID: {oneTapResult.propertyId}</li>
                    <li>Blockchain Match: {oneTapResult.blockchainMatched ? "YES" : "NO"}</li>
                    <li>GPS Match: {oneTapResult.gpsMatched ? "YES" : "NO"}</li>
                    <li>Property Health Score: {oneTapResult.healthScore}/100</li>
                  </ul>
                </div>
              )}
            </article>
          </section>
        )}

        <section className="impact-panel">
          <h3>Expected Impact</h3>
          <ul>
            {config.outcomes.map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>
        </section>
        </section>

        {/* RIGHT STATUS PANEL */}
        <aside className="status-panel">
          <div className="panel-header">
            <h4>⚡ Live Operations</h4>
            <span className="panel-time">{new Date().toLocaleTimeString()}</span>
          </div>

          <div className="panel-section">
            <h5>Current Status</h5>
            <div className="current-status">
              <p><strong>{role}</strong></p>
              <p className="status-detail">{bankOperationPhase}</p>
            </div>
          </div>

          <div className="panel-section">
            <h5>📊 Queue Statistics</h5>
            <div className="mini-stats">
              <span>Queued: <strong>{operationStats.totalQueued}</strong></span>
              <span>Pending: <strong className="text-warning">{operationStats.pendingApprovals}</strong></span>
              <span>Flagged: <strong className="text-danger">{operationStats.flaggedCases}</strong></span>
              <span>Done: <strong className="text-success">{operationStats.completedToday}</strong></span>
            </div>
          </div>

          <div className="panel-section">
            <h5>🧠 Sync Integrity</h5>
            <div className="sync-metrics">
              <span>Health Score: <strong>{syncScore}%</strong></span>
              <span>Last Sync: <strong>{lastSyncAt}</strong></span>
              <span>Queue ↔ GIS: <strong className={syncChecks.queueGis ? "text-success" : "text-danger"}>{syncChecks.queueGis ? "OK" : "MISMATCH"}</strong></span>
              <span>Queue ↔ Tax: <strong className={syncChecks.queueTax ? "text-success" : "text-danger"}>{syncChecks.queueTax ? "OK" : "MISMATCH"}</strong></span>
              <span>Queue ↔ KYC: <strong className={syncChecks.queueKyc ? "text-success" : "text-danger"}>{syncChecks.queueKyc ? "OK" : "MISMATCH"}</strong></span>
            </div>
            <div className="sync-actions">
              <button
                className="bank-btn secondary"
                type="button"
                onClick={() => setSyncAutoMode((previous) => !previous)}
              >
                Auto Sync: {syncAutoMode ? "ON" : "OFF"}
              </button>
              <button className="bank-btn" type="button" onClick={runSyncReconciliation}>
                Reconcile Now
              </button>
            </div>
          </div>

          <div className="panel-section alerts-section">
            <h5>🔔 Recent Alerts</h5>
            <ul className="alerts-list">
              {recentAlerts.map((alert, index) => (
                <li key={index} className="alert-item">
                  <span className="alert-dot"></span>
                  <span className="alert-text">{alert}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel-footer">
            <p className="system-info">System: Activelocal_operations v2.1</p>
          </div>
        </aside>
      </section>
    );
  };

  const renderAuthScreen = (mode: "login" | "register") => {
    const isLogin = mode === "login";

    return (
      <section className="auth-wrap auth-stage">
        <article className="auth-card auth-split-panel">
          <div className="auth-form-panel">
            <div className="domain-selector auth-domain-card-grid">
              {roles.map((role) => (
                <button
                  key={role}
                  className={authDomain === role ? "auth-domain-card active" : "auth-domain-card"}
                  onClick={() => {
                    setAuthDomain(role);
                    if (isLogin) {
                      setPendingRole(role);
                      setActiveRole(null);
                      setScanProgress(0);
                      setScanConfidence(0);
                      setScanError("");
                      setView("biometric");
                      setStatusMessage("");
                    } else {
                      setView("login");
                      setStatusMessage("");
                    }
                  }}
                  type="button"
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </article>
      </section>
    );
  };

  return (
    <div className="app-root">
      <div className="earth-bg" aria-hidden="true">
        <div className="earth-globe" />
        <div className="earth-orbit orbit-a" />
        <div className="earth-orbit orbit-b" />
      </div>

      <div className="page-shell">
      <header className="hero">
        <p className="kicker">National Trust Initiative</p>
        <h1>Prevent Land Forgery</h1>
        <p className="subtitle">Digital Solutions Blueprint</p>
        <p className="hero-copy">
          A secure, interoperable platform concept for governments, land offices,
          banks, and citizens to validate ownership with confidence.
        </p>
        <section className="hero-domain-features" aria-label="Domain features at a glance">
          {roles.map((role) => (
            <article key={role} className="hero-domain-card">
              <h3>{role}</h3>
              <p>{dashboardByRole[role].description}</p>
              <ul>
                {dashboardByRole[role].quickActions.slice(0, 3).map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
              {role === "Government Official" && (
                <div className="hero-workflow-cards">
                  {governmentRoleProfiles.map((profile) => (
                    <button
                      key={profile.id}
                      className="hero-workflow-card"
                      type="button"
                      onClick={() => openGovernmentStageDirectly(profile.id)}
                    >
                      <span className="hero-workflow-stage">{profile.title}</span>
                    </button>
                  ))}
                </div>
              )}
              <div className="hero-domain-actions">
                <button
                  className="nav-btn"
                  onClick={() => startDomainAccess(role, "login")}
                  type="button"
                >
                  {role} Login
                </button>
                <button
                  className="nav-btn"
                  onClick={() => startDomainAccess(role, "register")}
                  type="button"
                >
                  {role} Register
                </button>
              </div>
            </article>
          ))}
        </section>
      </header>

      {statusMessage && view !== "login" && view !== "register" && (
        <p className="status-banner">{statusMessage}</p>
      )}

      {view === "biometric" && (
        <section className="auth-wrap biometric-stage">
          <article className="auth-card biometric-page biometric-split-panel">
            <div className="biometric-hero">
              <div className="biometric-ring ring-a" />
              <div className="biometric-ring ring-b" />
              <div className="biometric-ring ring-c" />
              <div className="biometric-core">
                <p className="auth-kicker">Biometric Gate</p>
                <h2>Live Identity Confirmation</h2>
                <p>
                  {pendingRole
                    ? `Live verification for ${pendingRole}. Complete the scan to unlock the dashboard.`
                    : "Live verification in progress."}
                </p>
              </div>
            </div>

            <div className="biometric-body">
              <div className="live-scan-panel">
                <div className="scan-video-wrap">
                  <video ref={videoRef} autoPlay muted playsInline className="scan-video" />
                  <div className="scan-overlay" />
                </div>

                <div className="scan-stats">
                  <div className="scan-stat-row">
                    <span>Status</span>
                    <strong>{isScanning ? "Scanning in real time" : "Scan paused/completed"}</strong>
                  </div>
                  <div className="scan-stat-row">
                    <span>Progress</span>
                    <strong>{scanProgress}%</strong>
                  </div>
                  <div className="scan-stat-row">
                    <span>Confidence</span>
                    <strong>{scanConfidence}%</strong>
                  </div>
                  <div className="scan-stat-row">
                    <span>Anti-Spoof</span>
                    <strong className={`liveness-state ${antiSpoofStatus}`}>
                      {antiSpoofStatus === "idle" && "Pending"}
                      {antiSpoofStatus === "checking" && "Checking..."}
                      {antiSpoofStatus === "live" && "REAL"}
                      {antiSpoofStatus === "suspected_spoof" && "SUSPECTED_FAKE"}
                      {antiSpoofStatus === "unknown" && "Unknown"}
                    </strong>
                  </div>
                  <div className="scan-stat-row">
                    <span>Motion Liveness Score</span>
                    <strong>{motionScore}%</strong>
                  </div>
                  <p className="liveness-challenge">Challenge: {livenessChallenge}</p>
                  <div className="progress-track biometric-track" aria-label="Biometric scan progress">
                    <div className="progress-fill" style={{ width: `${scanProgress}%` }} />
                  </div>
                  {scanError && <p className="scan-error">{scanError}</p>}
                </div>
              </div>

              <div className="biometric-actions">
                <button
                  className="submit-btn biometric-btn"
                  onClick={() => void startBiometricScan()}
                  type="button"
                  disabled={isScanning || scanProgress >= 100}
                >
                  Resume Scan
                </button>
                <button
                  className="submit-btn biometric-btn"
                  onClick={runAntiSpoofCheck}
                  type="button"
                  disabled={scanProgress < 100 || antiSpoofStatus === "checking"}
                >
                  Re-run Anti-Spoof Check
                </button>
                <button
                  className="submit-btn biometric-btn"
                  onClick={handleBiometricConfirm}
                  type="button"
                  disabled={scanProgress < 100 || antiSpoofStatus !== "live"}
                >
                  Continue to Dashboard
                </button>
              </div>
            </div>
          </article>
        </section>
      )}

      {view === "governmentStagePage" && activeRole === "Government Official" && (
        <section className="auth-wrap auth-stage">
          <article className="auth-card stage-standalone-card">
            <button
              className="bank-btn secondary"
              type="button"
              onClick={() => setView("governmentDashboard")}
            >
              Back to Government Dashboard
            </button>
            {renderGovernmentRoleWorkbench(activeGovernmentStage)}
          </article>
        </section>
      )}

      {view === "governmentDashboard" && activeRole === "Government Official" &&
        renderDashboard("Government Official")}
      {view === "bankDashboard" && activeRole === "Bank Officer" &&
        renderDashboard("Bank Officer")}
      {view === "userDashboard" && activeRole === "Common User" &&
        renderDashboard("Common User")}

      </div>
    </div>
  );
}

export default App;
