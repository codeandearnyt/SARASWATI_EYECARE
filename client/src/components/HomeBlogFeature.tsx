import { TrpcProvider } from "./TrpcProvider";
import HomeBlogSection from "./HomeBlogSection";
import "../blog-system.css";
import "../home-blog-dialog.css";

export default function HomeBlogFeature({ onBookAppointment }: { onBookAppointment: () => void }) {
  return <TrpcProvider><HomeBlogSection onBookAppointment={onBookAppointment} /></TrpcProvider>;
}
