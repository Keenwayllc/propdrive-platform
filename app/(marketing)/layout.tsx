/**
 * Layout for all public marketing pages: shared header + footer chrome.
 */
import Nav from "@/components/nav";
import Footer from "@/components/footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
