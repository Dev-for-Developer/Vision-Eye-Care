// frontend/src/pages/InstructionManual.jsx
export default function InstructionManual() {
  return (
    <section className="py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">How to Use the Virtual Eye Test</h1>

        <Card title="1) Prepare Your Screen & Seating">
          <ul className="list-disc pl-5 space-y-1">
            <li>Use a laptop/desktop if possible. Set browser zoom to <b>100%</b>.</li>
            <li>Sit about <b>2–3 feet</b> away from the screen in a well-lit room.</li>
            <li>Wear your current glasses if you use them daily.</li>
          </ul>
        </Card>

        <Card title="2) What the Controls Mean">
          <dl className="space-y-3">
            <Term name="Defocus (Diopters)">
              Simulates near- or far-sightedness. Negative values represent myopia (distance blur).
              Positive values represent hypermetropia (near blur).
            </Term>
            <Term name="Pupil size (mm)">
              A larger pupil (e.g., in dim light) increases blur. A smaller pupil gives sharper depth of field.
            </Term>
            <Term name="Pixels per mm (screen)">
              A simple screen scale factor so the chart sizing stays realistic. Leave at default if unsure.
            </Term>
            <Term name="Chromatic mode">
              <b>Achromatic</b> keeps RGB aligned. <b>Chromatic</b> simulates a tiny red/blue split that some eyes/lenses show.
            </Term>
            <Term name="Contrast & Gamma">
              Small perceptual tweaks. If your screen is dim, a touch more contrast or lower gamma can help visibility.
            </Term>
          </dl>
        </Card>

        <Card title="3) Run the Simulation">
          <p>
            The <b>left</b> chart is the original. Click <b>Run Simulation</b> to render the
            <b> right</b> chart with your selected settings. Adjust until the letters appear as
            they typically do for you at this distance.
          </p>
        </Card>

        <Card title="4) Important Reminder">
          <p className="text-neutral-300">
            This tool helps you understand your vision. It is <b>not</b> a medical diagnosis.
            For prescriptions or eye-health concerns, please visit a certified eye-care professional.
          </p>
        </Card>
      </div>
    </section>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 mb-5">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      {children}
    </div>
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
