import { useState } from "react";

function grade(m) {
  if (m >= 90) return { l: "A+", c: "ga" };
  if (m >= 80) return { l: "A",  c: "ga" };
  if (m >= 70) return { l: "B",  c: "gb" };
  if (m >= 60) return { l: "C",  c: "gc" };
  if (m >= 35) return { l: "D",  c: "gc" };
  return { l: "F", c: "gf" };
}

function barColor(m) {
  return m >= 70 ? "#34d399" : m >= 50 ? "#fbbf24" : "#f87171";
}

export default function StudentList({ students, deleteStudent, search, setSearch, sortKey, toggleSort }) {
  return (
    <>
      <div className="toolbar">
        <div className="sw">
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search name or roll number…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className={`sb ${sortKey === "marks" ? "on" : ""}`} onClick={() => toggleSort("marks")}>Marks ↕</button>
        <button className={`sb ${sortKey === "name"  ? "on" : ""}`} onClick={() => toggleSort("name")}>Name ↕</button>
      </div>

      {students.length === 0 ? (
        <div className="empty">No students yet — add one above</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th style={{ width: 72 }}>Roll</th>
              <th>Name</th>
              <th style={{ width: 160 }}>Marks</th>
              <th style={{ width: 56 }}>Grade</th>
              <th style={{ width: 32 }}></th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => {
              const g = grade(s.marks);
              return (
                <tr key={s.roll}>
                  <td className="rn">{s.roll}</td>
                  <td className="nm">{s.name}</td>
                  <td>
                    <div className="bar-cell">
                      <span className="mnum">{s.marks}</span>
                      <div className="trk">
                        <div className="tf" style={{ width: `${s.marks}%`, background: barColor(s.marks) }} />
                      </div>
                    </div>
                  </td>
                  <td><span className={`gp ${g.c}`}>{g.l}</span></td>
                  <td><button className="xb" onClick={() => deleteStudent(s.roll)}>×</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
}