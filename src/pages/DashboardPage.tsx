import UserRegisterCard from "../components/UserRegisterCard";
import { loadTasks } from "../libs/Store";
import type { Registrant } from "../libs/Registrant";
import { useState } from "react";

export default function DashboardPage() {
  const [registrants] = useState<Registrant[]>(loadTasks());

  return (
    <div className="container mt-4">
      <h2>Dashboard</h2>
      <p>ผู้ลงทะเบียนแล้ว ({registrants.length} คน)</p>
      {registrants.map((registrant) => (
        <UserRegisterCard key={registrant.id} registrant={registrant} />
      ))}
    </div>
  );
}
