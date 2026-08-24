import AppointmentWizard from "@/components/AppointmentWizard";
import { TrpcProvider } from "@/components/TrpcProvider";
import "../appointment-eye-refinement.css";
import "../appointment-human-verification.css";
import "../appointment-modal-readability.css";

export default function AppointmentFlow({ onClose }: { onClose: () => void }) {
  return <TrpcProvider><AppointmentWizard onClose={onClose} /></TrpcProvider>;
}
