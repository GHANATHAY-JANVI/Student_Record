import { useState } from "react";
import "./App.css";
import StudentList from "./Student.jsx";

export default function App() {
  // Student data
  const [students, setStudents] = useState([]);

  // Form fields
  const [roll,  setRoll]  = useState("");
  const [name,  setName]  = useState("");
  const [marks, setMarks] = useState("");

  // Per-field inline errors
  const [fieldErrors, setFieldErrors] = useState({ roll: "", name: "", marks: "" });

  // Global (duplicate roll) error
  const [globalError, setGlobalError] = useState("");

  // Search & sort
  const [search,  setSearch]  = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState(1);

  // ── Live input handlers ──────────────────────────────────────────────────

  const handleRollChange = (e) => {
    const raw     = e.target.value;
    const cleaned = raw.replace(/[^0-9]/g, "");
    setRoll(cleaned);
    setGlobalError("");
    if (raw !== cleaned) {
      setFieldErrors(f => ({ ...f, roll: "Only digits are allowed in Roll No." }));
    } else {
      setFieldErrors(f => ({ ...f, roll: "" }));
    }
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    if (/\d/.test(val)) {
      setFieldErrors(f => ({ ...f, name: "Name cannot contain numbers." }));
    } else {
      setFieldErrors(f => ({ ...f, name: "" }));
    }
  };

  const handleMarksChange = (e) => {
    const raw     = e.target.value;
    const cleaned = raw.replace(/[^0-9]/g, "");
    setMarks(cleaned);
    if (raw !== cleaned) {
      setFieldErrors(f => ({ ...f, marks: "Only digits are allowed in Marks." }));
    } else {
      setFieldErrors(f => ({ ...f, marks: "" }));
    }
  };

  // ── Submit validation ────────────────────────────────────────────────────

  const validate = () => {
    const errors = { roll: "", name: "", marks: "" };
    let valid = true;

    if (!roll.trim()) {
      errors.roll = "Roll number is required.";
      valid = false;
    } else if (/[^0-9]/.test(roll)) {
      errors.roll = "Roll number must contain only digits.";
      valid = false;
    }

    if (!name.trim()) {
      errors.name = "Name is required.";
      valid = false;
    } else if (/\d/.test(name)) {
      errors.name = "Name must not contain numbers.";
      valid = false;
    }

    if (marks === "") {
      errors.marks = "Marks are required.";
      valid = false;
    } else if (Number(marks) < 0 || Number(marks) > 100) {
      errors.marks = "Marks must be between 0 and 100.";
      valid = false;
    }

    setFieldErrors(errors);
    return valid;
  };

  // ── Add student ──────────────────────────────────────────────────────────

  const add = () => {
    setGlobalError("");
    if (!validate()) return;

    if (students.some(s => s.roll === roll.trim())) {
      setGlobalError("A student with this roll number already exists.");
      setFieldErrors(f => ({ ...f, roll: "Roll number already exists." }));
      return;
    }

    setStudents([...students, { roll: roll.trim(), name: name.trim(), marks: Number(marks) }]);
    setRoll("");
    setName("");
    setMarks("");
    setFieldErrors({ roll: "", name: "", marks: "" });
  };

  // ── Delete student ───────────────────────────────────────────────────────

  const deleteStudent = (r) => setStudents(students.filter(s => s.roll !== r));

  // ── Sort ─────────────────────────────────────────────────────────────────

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d * -1);
    else { setSortKey(key); setSortDir(1); }
  };

  // ── KPI calculations ─────────────────────────────────────────────────────

  const total = students.length;
  const avg   = total ? (students.reduce((a, s) => a + s.marks, 0) / total).toFixed(1) : null;
  const pass  = total ? Math.round(students.filter(s => s.marks >= 35).length / total * 100) + "%" : null;
  const top   = total ? Math.max(...students.map(s => s.marks)) : null;

  // ── Filtered + sorted list ───────────────────────────────────────────────

  let list = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.roll.toLowerCase().includes(search.toLowerCase())
  );
  if (sortKey) {
    list = [...list].sort((a, b) => {
      const av = sortKey === "marks" ? a.marks : a.name.toLowerCase();
      const bv = sortKey === "marks" ? b.marks : b.name.toLowerCase();
      return av < bv ? -sortDir : av > bv ? sortDir : 0;
    });
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="wrap">

      {/* HEADER */}
      <div className="hdr">
        <h1>Student <em>Records</em></h1>
      </div>

      {/* KPI CARDS */}
      <div className="kpis">
        <div className="kpi">
          <div className="kpi-n">{total}</div>
          <div className="kpi-l">Enrolled</div>
        </div>
        <div className="kpi">
          <div className="kpi-n">{avg ?? "—"}</div>
          <div className="kpi-l">Average</div>
        </div>
        <div className="kpi">
          <div className="kpi-n">{pass ?? "—"}</div>
          <div className="kpi-l">Pass Rate</div>
        </div>
        <div className="kpi">
          <div className="kpi-n">{top ?? "—"}</div>
          <div className="kpi-l">Top Score</div>
        </div>
      </div>

      {/* ADD STUDENT FORM */}
      <div className="form-wrap">
        <div className="form-title">Add a student</div>
        <div className="fields">

          {/* Roll No. */}
          <div className="fg">
            <label>Roll No.</label>
            <input
              value={roll}
              onChange={handleRollChange}
              placeholder="101"
              maxLength={10}
              className={fieldErrors.roll ? "invalid" : ""}
            />
            {fieldErrors.roll && <p className="field-err">⚠ {fieldErrors.roll}</p>}
          </div>

          {/* Full Name */}
          <div className="fg">
            <label>Full Name</label>
            <input
              value={name}
              onChange={handleNameChange}
              placeholder="Rahul Verma"
              className={fieldErrors.name ? "invalid" : ""}
            />
            {fieldErrors.name && <p className="field-err">⚠ {fieldErrors.name}</p>}
          </div>

          {/* Marks */}
          <div className="fg">
            <label>Marks (0–100)</label>
            <input
              value={marks}
              onChange={handleMarksChange}
              placeholder="88"
              maxLength={3}
              className={fieldErrors.marks ? "invalid" : ""}
            />
            {fieldErrors.marks && <p className="field-err">⚠ {fieldErrors.marks}</p>}
          </div>

          <button className="btn-add" onClick={add}>+ Add</button>
        </div>

        {globalError && <p className="err">⚠ {globalError}</p>}
      </div>

      {/* STUDENT TABLE */}
      <div className="tbl-wrap">
        <StudentList
          students={list}
          deleteStudent={deleteStudent}
          search={search}
          setSearch={setSearch}
          sortKey={sortKey}
          toggleSort={toggleSort}
          total={total}
        />
      </div>

    </div>
  );
}