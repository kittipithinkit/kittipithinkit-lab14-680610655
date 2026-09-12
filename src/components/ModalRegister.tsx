import { useState } from "react";
import { plans, extraItems } from "../libs/constants";
import type { Registrant } from "../libs/Registrant";

interface Errors {
  firstName?: string;
  lastName?: string;
  plan?: string;
  gender?: string;
}

export default function ModalRegister() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [plan, setPlan] = useState("");
  const [gender, setGender] = useState("");
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const planPrice = plans.find((p) => p.id === plan)?.price ?? 0;
  const extrasPrice = extraItems
    .filter((item) => selectedExtras.includes(item.id))
    .reduce((sum, item) => sum + item.price, 0);
  const subtotal = planPrice + extrasPrice;
  const allExtrasSelected = selectedExtras.length === extraItems.length;
  const discount = allExtrasSelected ? subtotal * 0.2 : 0;
  const total = subtotal - discount;

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRegister = () => {
    const newErrors: Errors = {};
    if (firstName.trim() === "") newErrors.firstName = "Invalid first name";
    if (lastName.trim() === "") newErrors.lastName = "Invalid last name";
    if (plan === "") newErrors.plan = "Please select a Plan";
    if (gender === "") newErrors.gender = "Please select gender";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const registrants: Registrant[] = JSON.parse(
      localStorage.getItem("registrants") || "[]"
    );

    const newRegistrant: Registrant = {
      id: Date.now(),
      fullName: `${firstName} ${lastName}`,
      gender,
      plan,
      extraItems: selectedExtras,
      total,
    };

    localStorage.setItem(
      "registrants",
      JSON.stringify([...registrants, newRegistrant])
    );

    alert(
      `Registration complete. Please pay money for ${total.toLocaleString()} THB.`
    );

    setFirstName("");
    setLastName("");
    setPlan("");
    setGender("");
    setSelectedExtras([]);
    setAgree(false);
    setErrors({});
  };

  return (
    <div
      className="modal fade"
      id="modalregister"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex={-1}
      aria-labelledby="modalregisterLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Register CMU Marathon 🏃‍♂️</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            <div className="d-flex gap-2">
              <div>
                <label className="form-label">First name</label>
                <input
                  className={`form-control ${
                    errors.firstName ? "is-invalid" : ""
                  }`}
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setErrors((prev) => ({ ...prev, firstName: undefined }));
                  }}
                />
                {errors.firstName && (
                  <div className="text-danger small">{errors.firstName}</div>
                )}
              </div>
              <div>
                <label className="form-label">Last name</label>
                <input
                  className={`form-control ${
                    errors.lastName ? "is-invalid" : ""
                  }`}
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setErrors((prev) => ({ ...prev, lastName: undefined }));
                  }}
                />
                {errors.lastName && (
                  <div className="text-danger small">{errors.lastName}</div>
                )}
              </div>
            </div>

            <div className="mt-2">
              <label className="form-label">Plan</label>
              <select
                className={`form-select ${errors.plan ? "is-invalid" : ""}`}
                value={plan}
                onChange={(e) => {
                  setPlan(e.target.value);
                  setErrors((prev) => ({ ...prev, plan: undefined }));
                }}
              >
                <option value="">Please select..</option>
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label} ({p.price} THB)
                  </option>
                ))}
              </select>
              {errors.plan && (
                <div className="text-danger small">{errors.plan}</div>
              )}
            </div>

            <div className="mt-2">
              <label className="form-label">Gender</label>
              <div>
                <input
                  className="me-2 form-check-input"
                  type="radio"
                  name="gender"
                  checked={gender === "male"}
                  onChange={() => {
                    setGender("male");
                    setErrors((prev) => ({ ...prev, gender: undefined }));
                  }}
                />
                Male 👨
                <input
                  className="mx-2 form-check-input"
                  type="radio"
                  name="gender"
                  checked={gender === "female"}
                  onChange={() => {
                    setGender("female");
                    setErrors((prev) => ({ ...prev, gender: undefined }));
                  }}
                />
                Female 👩
              </div>
              {errors.gender && (
                <div className="text-danger small">{errors.gender}</div>
              )}
            </div>

            <div>
              <label className="form-label">Extra Item(s)</label>
              {extraItems.map((item) => (
                <div key={item.id}>
                  <input
                    className="me-2 form-check-input"
                    type="checkbox"
                    checked={selectedExtras.includes(item.id)}
                    onChange={() => toggleExtra(item.id)}
                  />
                  <label className="form-check-label">
                    {item.label} ({item.price} THB)
                  </label>
                </div>
              ))}
              {allExtrasSelected && (
                <span className="text-success d-block">(20% Discounted)</span>
              )}
            </div>

            <div className="alert alert-primary mt-3" role="alert">
              Promotion📢 Buy all items to get 20% Discount
            </div>

            <div>Total Payment : {total.toLocaleString()} THB</div>
          </div>

          <div className="modal-footer">
            <div>
              <input
                className="me-2 form-check-input"
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              I agree to the terms and conditions
            </div>
            <button
              className="btn btn-success my-2"
              disabled={!agree}
              onClick={handleRegister}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
