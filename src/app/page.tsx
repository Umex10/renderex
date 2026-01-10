import Header from "@/components/Header";
import Main from "@/components/Main";

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
