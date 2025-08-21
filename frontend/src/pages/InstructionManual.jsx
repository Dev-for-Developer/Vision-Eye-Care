// frontend/src/pages/InstructionManual.jsx
import { Link, useLocation } from "react-router-dom";

function Nav() {
  const { pathname } = useLocation();
  const is = (p) => pathname === p;

  const base =
    "px-3 py-2 rounded-lg text-sm font-medium transition-colors";
  const active = "bg-neutral-800 text-white";
  const idle =
    "text-neutral-300 hover:text-white hover:bg-neutral-800/60";

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-900/80 backdrop-blur">
      <div className="container-page flex h-14 items-center justify-between">
        <Link to="/" className="font-semibold tracking-wide">
          Virtual Eye Test
        </Link>

        <nav className="flex items-center gap-2">
          <Link to="/test" className={`${base} ${is("/test") ? active : idle}`}>
            Test
          </Link>
          <Link
            to="/instructions"
            className={`${base} ${is("/instructions") ? active : idle}`}
          >
            Instructions
          </Link>
          <Link
            to="/vision-check"
            className={`${base} ${is("/vision-check") ? active : idle}`}
          >
            Vision Check
          </Link>
          <Link
            to="/report"
            className={`${base} ${is("/report") ? active : idle}`}
          >
            Report
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Card({ title, children }) {
  return (
    <section className="card">
      <div className="card-body">
        <h2 className="section-h mb-3">{title}</h2>
        {children}
      </div>
    </section>
  );
}

function Term({ name, children }) {
  return (
    <div>
      <dt className="font-medium">{name}</dt>
      <dd className="text-neutral-300">{children}</dd>
    </div>
  );
}

export default function InstructionManual() {
  return (
    <>
      <Nav />

      <main className="container-page py-10 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">
          How to Use the Virtual Eye Test
        </h1>

        <Card title="1) Prepare Your Screen & Seating">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Use a laptop/desktop if possible. Keep browser zoom at{" "}
              <b>100%</b>.
            </li>
            <li>
              Sit about <b>2–3 feet</b> away from the screen in a well-lit room.
            </li>
            <li>Wear your current glasses if you use them daily.</li>
          </ul>
        </Card>

        <Card title="2) What the Controls Mean">
          <dl className="space-y-3">
            <Term name="Defocus (Diopters)">
              Simulates near- or far-sightedness. Negative values represent{" "}
              <b>myopia</b> (distance blur). Positive values represent{" "}
              <b>hypermetropia</b> (near blur).
            </Term>
            <Term name="Pupil size (mm)">
              A larger pupil (e.g., in dim light) increases blur. A smaller pupil
              gives a sharper depth of field.
            </Term>
            <Term name="Pixels per mm (screen)">
              Screen scale so the chart sizing stays realistic. Leave at default if
              unsure.
            </Term>
            <Term name="Chromatic mode">
              <b>Achromatic</b> keeps RGB aligned. <b>Chromatic</b> simulates a tiny
              red/blue split some eyes/lenses show.
            </Term>
            <Term name="Contrast & Gamma">
              Perceptual tweaks. If your screen is dim, a touch more contrast or
              slightly lower gamma can improve visibility.
            </Term>
          </dl>
        </Card>

        <Card title="3) Run the Simulation">
          <p>
            The <b>left</b> chart is the original. Click <b>Run Simulation</b>{" "}
            to render the <b>right</b> chart with your selected settings. Adjust
            until the letters look like they do for you at this distance.
          </p>
        </Card>

        <Card title="4) Important Reminder">
          <p className="text-neutral-300">
            This tool helps you understand your vision. It is <b>not</b> a medical
            diagnosis. For prescriptions or eye-health concerns, please visit a
            certified eye-care professional.
          </p>
        </Card>
      </main>
    </>
  );
}
