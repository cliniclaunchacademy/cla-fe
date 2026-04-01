import LayoutWrapper from "@components/AdminDashboard/Layout/LayoutWrapper/LayoutWrapper";

export const metadata = {
  title: "ISCB dashboard",
  description: "Great institution dashboard",
  icons: {
    // icon: "/appLogo.png"
  }
};

export default function AdminDashboardLayout({ children }) {
  return (
    <>
      <LayoutWrapper>{children}</LayoutWrapper>
    </>
  );
}
