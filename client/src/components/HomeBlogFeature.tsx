import { TrpcProvider } from "./TrpcProvider";
import HomeBlogSection from "./HomeBlogSection";

export default function HomeBlogFeature({ onBookAppointment }: { onBookAppointment: () => void }) {
  return <TrpcProvider><HomeBlogSection onBookAppointment={onBookAppointment} /></TrpcProvider>;
}
