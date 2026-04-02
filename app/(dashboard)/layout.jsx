import LayoutWrapper from "@components/Dashboard/Layout/LayoutWrapper/LayoutWrapper";

export const metadata = {
  title: "CLA",
  description: "Great institution dashboard",
  icons: {
    // icon: "/appLogo.png"
  }
};

export default function DashboardLayout({ children }) {
  return (
    <>
      <LayoutWrapper>{children}</LayoutWrapper>
    </>
  );
}
