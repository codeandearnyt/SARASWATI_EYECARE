import AppointmentWizard from "@/components/AppointmentWizard";
import { TrpcProvider } from "@/components/TrpcProvider";

export default function AppointmentFlow({ onClose }: { onClose: () => void }) {
  return <TrpcProvider><AppointmentWizard onClose={onClose} /></TrpcProvider>;
}
