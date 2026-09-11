import { useState } from "react";
import { loadTasks, saveTasks } from "../libs/Store";
import type { Registrant } from "../libs/Registrant";

//---- แผนการวิ่ง ----
const plans = [
  { id: "funrun", label: "Fun run 5.5 Km", price: 500 },
  { id: "mini", label: "Mini Marathon 10 Km", price: 800 },
  { id: "half", label: "Half Marathon 21 Km", price: 1200 },
  { id: "full", label: "Full Marathon 42.195 Km", price: 1500 },
];
// ---- สินค้าเสริม ----
const extraItems = [
  { id: "bottle", label: "Bottle 🍼", price: 200 },
  { id: "shoes", label: "Shoes 👟", price: 600 },
  { id: "cap", label: "Cap 🧢", price: 400 },
];

type RegisterForm = {
  fname: string;
  lname: string;
  plan: string;
  gender: string;
};

export default function ModalRegister({
  onClose,
  onRegistered,
}: {
  onClose: () => void;
  onRegistered: () => void;
}) {
  const [form, setForm] = useState<RegisterForm>({
    //เก็บค่าformปัจจุบันเป็นobjectและให้ข้อมูลที่รับเป็นtype RegisterForm
    fname: "",
    lname: "",
    plan: "",
    gender: "",
  });
  // STEP 5 : Form Submission + โดยมีระบบ Checkbox ยอมรับเงื่อนไข + Form Validation
  // STEP 5 - 5.1. : การประกาศ State สำหรับคุม Checkbox และ Error (useState)
  //5.1. การประกาศ State สำหรับคุม Checkbox และ Error (useState)
  const [agree, setAgree] = useState(false);

  const [errors, setErrors] = useState({
    fname: false,
    lname: false,
    plan: false,
    gender: false,
  });

  const [selectedExtra, setSelectedExtra] = useState<string[]>([]);

  const toggleExtra = (id: string) => {
    setSelectedExtra(
      (prev) =>
        prev.includes(id)
          ? prev.filter((item) => item !== id) // ถ้ามีอยู่แล้ว → เอาออก (ติ๊กออก)
          : [...prev, id], // ถ้ายังไม่มี → เพิ่มเข้าไป (ติ๊ก)
    );
  };
  // STEP 1 - 1.2. : ฟังก์ชันอัปเดตข้อมูลแบบไดนามิก (updateForm)
  //1.2. ฟังก์ชันอัปเดตข้อมูลแบบไดนามิก (updateForm)
  const updateForm = (key: keyof RegisterForm, value: string) => {
    //รับแค่string
    setForm((prev) => ({ ...prev, [key]: value })); //copyอันเก่าแล้วupdateค่าใหม่อีกที
    setErrors((prev) => ({ ...prev, [key]: false })); //การอัปเดตฟอร์มพร้อมล้างสถานะ Error(5.2)
  };
  // STEP 5 : Form Submission + โดยมีระบบ Checkbox ยอมรับเงื่อนไข + Form Validation
  //5.3. ฟังก์ชันตรวจสอบข้อมูลเมื่อกดปุ่ม (registerBtnOnClick)
  const registerBtnOnClick = () => {
    const newErrors = {
      fname: form.fname === "",
      lname: form.lname === "",
      plan: form.plan === "",
      gender: form.gender === "",
    }; //check error
    setErrors(newErrors); //ส่งerror

    const hasError = Object.values(newErrors).some((isError) => isError);
    if (hasError) return;

    const total = computeTotalPayment();

    const newRegistrant: Registrant = {
      id: Date.now(),
      fullName: `${form.fname} ${form.lname}`,
      gender: form.gender,
      plan: form.plan,
      items: selectedExtra,
      total: total,
    };

    const currentTasks = loadTasks();
    const updatedTasks = [...currentTasks, newRegistrant];

    saveTasks(updatedTasks);

    onRegistered();
    alert(
      `Registration complete. Please pay money for ${total.toLocaleString()} THB.`,
    );
    onClose();
  };
  // STEP 4 : Total Payment (realtime)
  // STEP 4 - 4.1. : ฟังก์ชันคำนวณราคา (computeTotalPayment)
  //4.1. ฟังก์ชันคำนวณราคา (computeTotalPayment)
  const computeTotalPayment = () => {
    let total = 0;
    const selectedPlan = plans.find((p) => p.id === form.plan); //เลือกเฉพาะที่มีค่าidเหมือนกัน
    if (selectedPlan) total += selectedPlan.price;

    const exItemTotal = extraItems
      .filter((items) => selectedExtra.includes(items.id))
      .reduce((sum, item) => sum + item.price, 0);

    total += exItemTotal;

    if (selectedExtra.length === extraItems.length) {
      total = total * 0.8;
    }
    return total;
  };

  return (
    <>
      <div className="modal fade show d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Register CMU Marathon 🏃‍♂️</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            <div className="modal-body">
              <div className="d-flex gap-2">
                <div>
                  <label className="form-label">First name</label>
                  <input
                    className={`form-control ${errors.fname ? "is-invalid" : ""}`}
                    onChange={(e) => updateForm("fname", e.target.value)}
                    value={form.fname}
                  />
                  <div className="invalid-feedback">Invalid first name</div>
                </div>
                <div>
                  <label className="form-label">Last name</label>
                  <input
                    className={`form-control ${errors.lname ? "is-invalid" : ""}`}
                    onChange={(e) => updateForm("lname", e.target.value)}
                    value={form.lname}
                  />
                  <div className="invalid-feedback">Invalid last name</div>
                </div>
              </div>
              <div className="mt-2">
                <label className="form-label">Plan</label>
                {/* STEP 2 - 2.1 : 2.1 การควบคุม Select element (Controlled Component) & การเรนเดอร์ ตัวเลือก (Option List) */}
                <select
                  className={"form-select" + (errors.plan ? " is-invalid" : "")}
                  value={form.plan}
                  onChange={(e) => updateForm("plan", e.target.value)}
                >
                  <option value="">Please select..</option>
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label} ({p.price.toLocaleString()} THB)
                    </option> //toLocalSring()เป็นตัวเติม","ในตัวเลขให้
                  ))}
                </select>
                <div className="invalid-feedback">Please select a Plan</div>
              </div>
              <div className="mt-2">
                <label className="form-label">Gender</label>
                <div>
                  {/*  STEP 3 - 3.1 : การเช็กสถานะการเลือก (checked) & การอัปเดตค่าเมื่อมีการคลิก (onChange) */}
                  <div>
                    <input
                      className="me-2 form-check-input"
                      type="radio" //สร้างradio button
                      checked={form.gender === "male"}
                      onChange={() => updateForm("gender", "male")}
                    />
                    Male 👨
                    <input
                      className="mx-2 form-check-input"
                      type="radio"
                      checked={form.gender === "female"}
                      onChange={() => updateForm("gender", "female")}
                    />
                    Female 👩
                  </div>
                  {/* STEP 5 - 5.7. : สำหรับ Conditional Rendering แยกต่างหาก (เช่น Radio button)*/}
                  {errors.gender && (
                    <div className="text-danger">Please select gender</div>
                  )}
                </div>
              </div>
              {/* Extra Items */}
              <div>
                <label className="form-label pt-2">Extra Item(s)</label>
                {extraItems.map((item) => (
                  <div key={item.id}>
                    <input
                      className="me-2 form-check-input"
                      type="checkbox"
                      checked={selectedExtra.includes(item.id)}
                      onChange={() => toggleExtra(item.id)}
                    />
                    <label className="form-check-label">
                      {item.label} ({item.price.toLocaleString()} THB)
                    </label>
                  </div>
                ))}

                {selectedExtra.length === extraItems.length && (
                  <span className="text-success d-block">(20% Discounted)</span>
                )}
              </div>

              <div className="alert alert-primary mt-3" role="alert">
                Promotion📢 Buy all items to get 20% Discount
              </div>

              <div className="mt-3">
                Total Payment : {computeTotalPayment().toLocaleString()} THB
              </div>
            </div>

            <div className="modal-footer">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />{" "}
              I agree to the terms and conditions
              {/* Register Button */}
              <button
                className="btn btn-success my-2"
                onClick={registerBtnOnClick}
                disabled={!agree} //logic
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}
