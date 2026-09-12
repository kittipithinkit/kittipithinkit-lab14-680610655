import type { Registrant } from "../libs/Registrant";
import { plans, extraItems } from "../libs/constants";

interface Props {
  registrant: Registrant;
}

export default function UserRegisterCard({ registrant }: Props) {
  const planLabel = plans.find((p) => p.id === registrant.plan)?.label ?? "";
  const genderLabel = registrant.gender === "male" ? "👨 Male" : "👩 Female";

  return (
    <div className="card p-3 mb-3">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <div className="fw-bold">{registrant.fullName}</div>
          <div className="text-muted">
            {planLabel} · {genderLabel}
          </div>
          <div className="mt-2 d-flex gap-2">
            {registrant.extraItems.map((id) => {
              const item = extraItems.find((e) => e.id === id);
              return item ? (
                <span key={id} className="badge bg-light text-dark border">
                  {item.label}
                </span>
              ) : null;
            })}
          </div>
        </div>
        <div className="fw-bold">{registrant.total.toLocaleString()} THB</div>
      </div>
    </div>
  );
}
