# Virtual Eye Test — Physics-Informed Vision Simulator

A **browser-based eye test** that renders a Snellen chart and simulates how it looks on the retina under different **optical conditions**. The backend uses **Python/Django + Pillow/Numpy** to model defocus, pupil size, and simple chromatic aberration; the frontend uses **React + Vite + Tailwind** to provide a clean, responsive UI and side-by-side chart comparison with an **Instruction Manual** built in.

> ⚕️ **Disclaimer:** This software is a learning and pre-screening aid, **not** a medical device or prescription tool. For diagnosis, consult a licensed eye-care professional.

---

## ✨ Features

- **Always-available Snellen chart** (no upload needed).
- **Physics-informed simulation controls**  
  - Defocus (**diopters**) → myopia / hypermetropia  
  - **Pupil size** (mm) → depth-of-field effect  
  - **Pixels per mm** (screen calibration)  
  - **Chromatic mode** (achromatic vs. simple R/B split)  
  - **Contrast & Gamma** (perceptual tuning)
- **Side-by-side**: Original vs. Processed chart.
- **Instruction Manual** page (plain, user-friendly language).
- **Django REST API** endpoint returning a **base64 PNG**.
- **CORS** enabled for local dev (lock down in prod).
- Clean, responsive UI (Tailwind design tokens + reusable layout).

---

## 🧭 Project structure

virtual-eye-test/
├── backend/
│ ├── api/
│ │ ├── assets/snellenchart.png
│ │ ├── optical_simulation.py
│ │ ├── urls.py
│ │ └── views.py
│ ├── core/ # Django project
│ ├── manage.py
│ └── venv/ # local virtualenv (not committed)
└── frontend/
├── public/ # vite assets
└── src/
├── components/
├── pages/
│ ├── InstructionManual.jsx
│ └── VisionTest.jsx
├── App.jsx
├── index.css
└── main.jsx

yaml
Copy
Edit

---

## 🚀 Quick start

### Prerequisites
- **Node** ≥ 18 & **npm**
- **Python** 3.12 / 3.13 & **pip**
- **Git**

### 1) Backend (Django API)

```bash
cd backend
# (Windows PowerShell)
python -m venv venv
venv\Scripts\activate

# (macOS/Linux)
# python3 -m venv venv
# source venv/bin/activate

pip install django djangorestframework pillow numpy django-cors-headers
python manage.py migrate
python manage.py runserver
Ensure the Snellen chart exists: backend/api/assets/snellenchart.png

The API will be at: http://127.0.0.1:8000/api/

2) Frontend (React + Vite)
bash
Copy
Edit
cd frontend
npm install
npm run dev
Visit: http://localhost:5173/test
(Instructions page: http://localhost:5173/instructions)

🔌 API
POST /api/simulate/
Body (JSON)

json
Copy
Edit
{
  "defocus_D": -2.5,
  "pupil_mm": 3.0,
  "px_per_mm": 4.0,
  "chromatic_mode": "achromatic", // or "chromatic_rgb"
  "contrast": 1.0,
  "gamma": 1.0
}
Response (JSON)

json
Copy
Edit
{
  "status": "ok",
  "image_base64": "<PNG as base64>"
}
cURL

bash
Copy
Edit
curl -X POST http://127.0.0.1:8000/api/simulate/ \
  -H "Content-Type: application/json" \
  -d '{"defocus_D":-2,"pupil_mm":3,"px_per_mm":4,"chromatic_mode":"achromatic","contrast":1,"gamma":1}'
🧪 How to use
Open /instructions for setup and tips.

Go to /test, adjust Defocus, Pupil, Pixels/mm, Chromatic, Contrast, Gamma.

Click Run Simulation → compare Original vs Processed chart side-by-side.

Use the Instruction page to understand each control in simple language.

🧠 Science inside (current)
Defocus blur (Gaussian PSF proxy) derived from diopters × pupil size × pixels/mm.

Simple chromatic aberration (R/B channel shift) toggled by chromatic mode.

Perceptual tuning (contrast & gamma) to adapt to displays/lighting.

Screen geometry awareness via pixels/mm to keep letter sizing reasonable.

🗺️ Roadmap (next up)
Astigmatism (elliptical/directional PSF).

Glare/veiling luminance (scatter; cataract-like haze).

Distance calibration (credit-card/screen-width method for accurate geometry).

Vision scoring (Snellen/logMAR estimate from user responses).

PDF reports (user info + selected parameters + result images).

Mobile tuning & large-type accessibility mode.

🛠️ Troubleshooting
Blank page / double router: ensure BrowserRouter is only in main.jsx, not again in App.jsx.

Tailwind “Unknown @tailwind/@apply” warnings: confirm postcss.config.js and tailwind.config.js are present and index.css is imported in main.jsx.

CORS errors: in backend/core/settings.py, allow your frontend origin during dev (don’t use CORS_ALLOW_ALL_ORIGINS=True in prod).

“No such file snellenchart.png”: check backend/api/assets/snellenchart.png exists and matches the expected filename.

🤝 Contributing
Fork & create a feature branch.

Keep PRs focused and small.

Add screenshots or before/after comparisons for UI/UX changes.

📜 License
MIT (see LICENSE).

🙏 Acknowledgements
Open-source Django / DRF / Pillow / Numpy / React / Vite / Tailwind.

Classic Snellen visual acuity standard (for educational use only here).

yaml
Copy
Edit

---

## 🔗 Resume / LinkedIn bullets (3 lines)

- **Use**: *Tackled* accessible vision pre-screening by developing a **browser-based Virtual Eye Test** that simulates human retinal perception under real-world optical conditions (defocus, pupil, chromatic, contrast/gamma) with side-by-side Snellen comparison and an instruction-first UX.  
- **Tech**: *Developed & integrated* a **React (Vite + Tailwind)** frontend with a **Django REST** backend leveraging **Pillow/Numpy** for physics-informed image processing, CORS-secured APIs, and clean componentized UI architecture.  
- **Impact**: *Enabled* low-cost, screen-calibrated eyesight pre-checks for remote users, **reducing access barriers** and paving the way for clinically aligned features (astigmatism, glare, distance calibration, PDF reporting).

---
