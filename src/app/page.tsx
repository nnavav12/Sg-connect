import Header from "@/components/sections/header";
import LoginCard from "@/components/sections/login-card";

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
      <Header />
      <LoginCard />
    </div>
  );
}
