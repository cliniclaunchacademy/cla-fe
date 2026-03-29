import LayoutWrapper from "@components/Main/Layout/LayoutWrapper/LayoutWrapper";
import "../globals.css";
import Navbar from "@components/Common/Navbar/Navbar";

export const metadata = {
  title: "ISCB",
  description: "Great institution",
  icons: {
    // icon: "/appLogo.png"
  }
};

export default function MainLayout({ children }) {
  return (
    <div className="relative pt-24 px-4">
      <Navbar />
      <LayoutWrapper protectedRoutes={["/courses", "/profile"]}>
        {children}
      </LayoutWrapper>
    </div>
  );
}
