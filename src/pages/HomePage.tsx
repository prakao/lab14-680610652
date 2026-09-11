import ModalRegister from "../components/ModalRegister";
import { useState } from "react";
import { loadTasks, saveTasks } from "../libs/Store";
import type { Registrant } from "../libs/Registrant";

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [registrants, setRegistrants] = useState<Registrant[]>(loadTasks());
  return (
    <div className="col-12 mt-4 p-0">
      <div className="container text-center">
        <h2> Wellcome To CMU Marathon</h2>
        <div>
          <img src="/marathonrun.png" alt="Logo CMU Marathon" />
        </div>
        <button
          type="button"
          className="m-4 btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          Register
        </button>
      </div>
      {showModal && (
        <ModalRegister
          onClose={() => setShowModal(false)}
          onRegistered={() => setRegistrants(loadTasks())}
        />
      )}
    </div>
  );
}
