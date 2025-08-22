export default function InstructionManual() {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">
          How to Use the Virtual Eye Test
        </h1>

        <Card title="1) Prepare Your Screen & Seating">
          <ul className="list-disc pl-5 space-y-1">
            <li>Use a laptop/desktop if possible. Set browser zoom to <b>100%</b>.</li>
            <li>Sit about <b>2–3 feet</b> from the screen in a well-lit room.</li>
            <li>Wear your current glasses if you use them daily.</li>
          </ul>
        </Card>

        <Card title="2) What the Controls Mean">
          <dl className="space-y-3">
            <Term name="Defocus (Diopters)">
              Simulates near- or far-sightedness. Negative = myopia (distance blur).
              Positive = hypermetropia (near blur).
            </Term>
            <Term name="Pupil size (mm)">
              Larger pupil (dim light) increases blur; smaller pupil increases depth of field.
            </Term>
            <Term name="Pixels per mm (screen)">
              Screen scale so chart size remains realistic. Leave default if unsure.
            </Term>
            <Term name="Chromatic mode">
              <b>Achromatic</b> keeps RGB aligned. <b>Chromatic</b> adds small red/blue split.
            </Term>
            <Term name="Contrast & Gamma">
              Perceptual tweaks. If your screen is dim, slightly higher contrast or lower gamma helps.
            </Term>
          </dl>
        </Card>

        <Card title="3) Run the Simulation">
          <p>
            The <b>left</b> chart is the original. Click <b>Run Simulation</b> to render the
            <b> right</b> chart with your selected settings. Adjust until letters look typical
            for you at this distance.
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
