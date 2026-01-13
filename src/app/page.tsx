import Header from "@/components/layout/Header";
import Main from "@/components/landing/Main";

/**
 * Public home page that renders the main header/navigation.
 */
export default function Home() {
  return (
    <div className="w-full overflow-hidden">
      <Header></Header>
      <Main></Main>
    </div>
  );
}
