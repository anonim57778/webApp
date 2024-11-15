import Loader from "~/components/ui/loader";

export default function LoadingPage() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Loader size="xl" />
    </div>
  );
}
