import type { Registrant } from "../libs/Registrant";

export default function UserRegisterCard({
  registrant,
}: {
  registrant: Registrant;
}) {
  const itemMap: Record<string, string> = {
    bottle: "Bottle 🍼",
    shoes: "Shoes 👟",
    cap: "Cap 🧢",
  };

  const genderLabel = registrant.gender === "male" ? "👨 Male" : "👩 Female";

  const formatItem = (item: string) => {
    if (itemMap[item]) return itemMap[item];
    return "";
  };

  return (
    <div className="card p-3 mb-2 shadow-sm">
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="fw-bold mb-0 text-dark">{registrant.fullName}</h5>
        <span className="fs-8 text-dark">
          {registrant.total?.toLocaleString()} THB
        </span>
      </div>

      <div className="text-secondary small mt-1">
        {registrant.plan} &middot; {genderLabel}
      </div>

      {registrant.items && registrant.items.length > 0 && (
        <div className="d-flex flex-wrap gap-1 mt-2">
          {registrant.items.map((item) => (
            <span
              key={item}
              className="badge bg-light text-dark fw-bold border fw-normal px-2 py-1"
            >
              {formatItem(item)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
