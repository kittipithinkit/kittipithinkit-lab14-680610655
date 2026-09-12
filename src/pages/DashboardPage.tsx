import { useEffect, useState } from "react";
import UserRegisterCard from "../components/UserRegisterCard";
import type { Registrant } from "../libs/Registrant";

export default function DashboardPage() {
  const [registrants, setRegistrants] = useState<Registrant[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("registrants") || "[]");
    setRegistrants(data);
  }, []);

  return (
    <div className="container mt-4">
      <h2>Dashboard</h2>
      {registrants.length === 0 ? (
        <p>ยังไม่มีผู้ลงทะเบียน</p>
      ) : (
        <>
          <p>ผู้ลงทะเบียนแล้ว ({registrants.length} คน)</p>
          {registrants.map((r) => (
            <UserRegisterCard key={r.id} registrant={r} />
          ))}
        </>
      )}
    </div>
  );
}
