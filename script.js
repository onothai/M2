function qs(sel, root = document) {
  return root.querySelector(sel);
}

function qsa(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

function setupNav() {
  const btn = qs(".nav-toggle");
  const menu = qs("#navMenu");
  if (!btn || !menu) return;

  function setOpen(open) {
    btn.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
  }

  btn.addEventListener("click", () => {
    const isOpen = btn.getAttribute("aria-expanded") === "true";
    setOpen(!isOpen);
  });

  // close when clicking a link (mobile)
  qsa("a", menu).forEach((a) => {
    a.addEventListener("click", () => setOpen(false));
  });

  // close on outside click
  document.addEventListener("click", (e) => {
    if (!menu.classList.contains("is-open")) return;
    const target = e.target;
    if (!(target instanceof Node)) return;
    if (menu.contains(target) || btn.contains(target)) return;
    setOpen(false);
  });

  // close on escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
}

function setupPathTabs() {
  const pills = qsa(".pill");
  const panels = qsa(".path-panel");
  if (!pills.length || !panels.length) return;

  const byName = new Map(panels.map((p) => [p.dataset.panel, p]));

  function activate(name) {
    pills.forEach((p) => p.classList.toggle("is-active", p.dataset.path === name));
    panels.forEach((p) => p.classList.add("is-hidden"));
    const panel = byName.get(name);
    if (panel) panel.classList.remove("is-hidden");
  }

  pills.forEach((p) => {
    p.addEventListener("click", () => activate(p.dataset.path));
  });
}

function setupZodiacWheel() {
  const root = qs("[data-zodiac]");
  if (!root) return;

  const svg = qs("[data-zodiac-svg]", root);
  const panel = qs("[data-zodiac-panel]", root);
  if (!svg || !panel) return;

  const openBtn = qs("[data-zodiac-open]", root);

  const DATA = [
    {
      key: "aries",
      th: "เมษ",
      title: "ราศีเมษ",
      range: "ประมาณ 21 มี.ค. – 19 เม.ย.",
      element: "ไฟ",
      modality: "จัตุร",
      ruler: "อังคาร",
      desc: "โทนของ “เมษ” คือเริ่มก่อน คิดไว ทำไว เหมาะกับการตั้งต้นและตัดสินใจ",
      tags: ["เริ่มต้น", "ไฟ", "กล้าตัดสินใจ"],
      strengths: ["กล้าเริ่ม", "พลังเยอะ", "ตัดสินใจไว"],
      cautions: ["ใจร้อน", "เผลอหุนหัน", "เริ่มเก่งแต่ต้องฝึก “ทำต่อให้จบ”"],
      tips: ["ตั้งเป้าสั้นๆ ชัดๆ", "พักก่อนตอบเวลาหงุดหงิด", "ทำทีละสเต็ปจะไปได้ไกล"],
    },
    {
      key: "taurus",
      th: "พฤษภ",
      title: "ราศีพฤษภ",
      range: "ประมาณ 20 เม.ย. – 20 พ.ค.",
      element: "ดิน",
      modality: "คงที่",
      ruler: "ศุกร์",
      desc: "“พฤษภ” เด่นเรื่องความมั่นคง ความอดทน และการสะสมทีละนิด",
      tags: ["มั่นคง", "อดทน", "ค่อยเป็นค่อยไป"],
      strengths: ["อดทน", "นิ่งและเสถียร", "สร้างฐานได้ดี"],
      cautions: ["ดื้อเงียบ", "ช้าเพราะกลัวพลาด", "ติดความสบายเกินไป"],
      tips: ["วางแผนระยะยาวแบบจับต้องได้", "แบ่งงานเป็นก้อนเล็ก", "ยืดหยุ่นกับการเปลี่ยนแปลงบ้าง"],
    },
    {
      key: "gemini",
      th: "เมถุน",
      title: "ราศีเมถุน",
      range: "ประมาณ 21 พ.ค. – 20 มิ.ย.",
      element: "ลม",
      modality: "ทวิภาวะ",
      ruler: "พุธ",
      desc: "“เมถุน” คือการสื่อสาร การเรียนรู้ และการเชื่อมโยงหลายเรื่องเข้าด้วยกัน",
      tags: ["สื่อสาร", "เรียนรู้", "คล่องตัว"],
      strengths: ["เรียนไว", "สื่อสารเก่ง", "ปรับตัวดี"],
      cautions: ["ทำหลายอย่างจนกระจาย", "เปลี่ยนใจเร็ว", "ข้อมูลเยอะแต่ไม่ตกผลึก"],
      tips: ["ทำโน้ต/สรุปให้ชัด", "ตั้งลำดับความสำคัญ", "เลือก 1–2 เรื่องหลักต่อช่วงเวลา"],
    },
    {
      key: "cancer",
      th: "กรกฎ",
      title: "ราศีกรกฎ",
      range: "ประมาณ 21 มิ.ย. – 22 ก.ค.",
      element: "น้ำ",
      modality: "จัตุร",
      ruler: "จันทร์",
      desc: "“กรกฎ” มีโทนของบ้าน ความผูกพัน และความรู้สึก",
      tags: ["บ้าน", "ผูกพัน", "อ่อนไหว"],
      strengths: ["ดูแลคนเก่ง", "รับรู้อารมณ์ละเอียด", "ผูกพันมั่นคง"],
      cautions: ["อ่อนไหว", "คิดมาก", "เก็บความรู้สึกจนล้น"],
      tips: ["สื่อสารความต้องการให้ตรง", "ตั้งขอบเขตที่ดี", "ดูแลใจตัวเองก่อนดูแลคนอื่น"],
    },
    {
      key: "leo",
      th: "สิงห์",
      title: "ราศีสิงห์",
      range: "ประมาณ 23 ก.ค. – 22 ส.ค.",
      element: "ไฟ",
      modality: "คงที่",
      ruler: "อาทิตย์",
      desc: "“สิงห์” คือความโดดเด่น ภาวะผู้นำ และศักดิ์ศรี",
      tags: ["ผู้นำ", "โดดเด่น", "ศักดิ์ศรี"],
      strengths: ["มั่นใจ", "นำทีมได้", "สร้างแรงบันดาลใจ"],
      cautions: ["คาดหวังการยอมรับ", "อีโก้สูง", "ดื้อในความคิดตัวเอง"],
      tips: ["ฟัง feedback ให้ครบก่อนตัดสิน", "แบ่งเครดิตให้ทีม", "ใช้พลังสร้างสรรค์แทนการแข่งขัน"],
    },
    {
      key: "virgo",
      th: "กันย์",
      title: "ราศีกันย์",
      range: "ประมาณ 23 ส.ค. – 22 ก.ย.",
      element: "ดิน",
      modality: "ทวิภาวะ",
      ruler: "พุธ",
      desc: "“กันย์” เน้นรายละเอียด งานบริการ และการจัดระเบียบ",
      tags: ["ละเอียด", "จัดระเบียบ", "แก้ปัญหา"],
      strengths: ["วิเคราะห์เก่ง", "เป็นระบบ", "ใส่ใจคุณภาพ"],
      cautions: ["เพอร์เฟ็กชันนิสต์", "วิจารณ์ตัวเองหนัก", "คิดเยอะจนช้า"],
      tips: ["กำหนดมาตรฐาน “พอดี”", "ทำก่อนค่อยปรับ", "พักสมองด้วยกิจวัตรง่ายๆ"],
    },
    {
      key: "libra",
      th: "ตุลย์",
      title: "ราศีตุลย์",
      range: "ประมาณ 23 ก.ย. – 22 ต.ค.",
      element: "ลม",
      modality: "จัตุร",
      ruler: "ศุกร์",
      desc: "“ตุลย์” คือความสมดุล ความสัมพันธ์ และการชั่งน้ำหนัก",
      tags: ["สมดุล", "ความสัมพันธ์", "ชั่งน้ำหนัก"],
      strengths: ["ประนีประนอมเก่ง", "มีรสนิยม", "มองได้หลายมุม"],
      cautions: ["ลังเล", "กลัวขัดแย้ง", "ตัดสินใจช้าเพราะอยากแฟร์"],
      tips: ["ตั้งเงื่อนไขตัดสินใจล่วงหน้า", "ซื่อสัตย์กับความต้องการตัวเอง", "ยอมรับว่าความแฟร์ไม่เท่ากันทุกกรณี"],
    },
    {
      key: "scorpio",
      th: "พิจิก",
      title: "ราศีพิจิก",
      range: "ประมาณ 23 ต.ค. – 21 พ.ย.",
      element: "น้ำ",
      modality: "คงที่",
      ruler: "อังคาร/พลูโต",
      desc: "“พิจิก” โทนลึก เข้ม และเปลี่ยนผ่าน",
      tags: ["ลึก", "เปลี่ยนผ่าน", "จริงจัง"],
      strengths: ["โฟกัสสูง", "อ่านเกมเก่ง", "ลึกซึ้งและจริงใจ"],
      cautions: ["ระแวง", "ยึดติด", "อารมณ์เข้มข้นจนเหนื่อย"],
      tips: ["ปล่อยวางสิ่งควบคุมไม่ได้", "คุยตรงๆ แบบไม่ทำร้าย", "เปลี่ยนพลังเข้มไปสร้างงานยาวๆ"],
    },
    {
      key: "sagittarius",
      th: "ธนู",
      title: "ราศีธนู",
      range: "ประมาณ 22 พ.ย. – 21 ธ.ค.",
      element: "ไฟ",
      modality: "ทวิภาวะ",
      ruler: "พฤหัส",
      desc: "“ธนู” คือการขยายขอบฟ้า ความเชื่อ และการเดินทาง",
      tags: ["ภาพใหญ่", "เดินทาง", "เติบโต"],
      strengths: ["มองภาพรวมเก่ง", "รักอิสระ", "เรียนรู้จากประสบการณ์"],
      cautions: ["พูดตรงเกิน", "เบื่อง่าย", "ชอบกระโดดข้ามรายละเอียด"],
      tips: ["ตรวจรายละเอียดก่อนปิดงาน", "เลือกเส้นทางที่สอดคล้องคุณค่า", "ตั้งวินัยให้ความฝันเดินได้จริง"],
    },
    {
      key: "capricorn",
      th: "มกร",
      title: "ราศีมกร",
      range: "ประมาณ 22 ธ.ค. – 19 ม.ค.",
      element: "ดิน",
      modality: "จัตุร",
      ruler: "เสาร์",
      desc: "“มกร” เด่นเรื่องวินัย โครงสร้าง และความรับผิดชอบ",
      tags: ["วินัย", "โครงสร้าง", "เป้าหมาย"],
      strengths: ["รับผิดชอบสูง", "อดทนระยะยาว", "วางระบบเก่ง"],
      cautions: ["กดดันตัวเอง", "ทำงานหนักเกิน", "เคร่งจนลืมพัก"],
      tips: ["แบ่งเป้าหมายเป็น milestone", "ฉลองชัยเล็กๆ", "พักให้พอแล้วจะไปได้ยาว"],
    },
    {
      key: "aquarius",
      th: "กุมภ์",
      title: "ราศีกุมภ์",
      range: "ประมาณ 20 ม.ค. – 18 ก.พ.",
      element: "ลม",
      modality: "คงที่",
      ruler: "เสาร์/ยูเรนัส",
      desc: "“กุมภ์” คือความคิดใหม่ เครือข่าย และมุมมองที่ต่าง",
      tags: ["ไอเดียใหม่", "เครือข่าย", "อิสระ"],
      strengths: ["คิดนอกกรอบ", "มองอนาคต", "รวมคน/ชุมชนได้"],
      cautions: ["ดูห่างเหิน", "ดื้อในอุดมการณ์", "คิดมากจนไม่ลงมือ"],
      tips: ["ทำ prototype เล็กๆ ก่อน", "สื่อสารความรู้สึกให้คนเข้าใจ", "ลงมือทีละขั้นจะเห็นผลจริง"],
    },
    {
      key: "pisces",
      th: "มีน",
      title: "ราศีมีน",
      range: "ประมาณ 19 ก.พ. – 20 มี.ค.",
      element: "น้ำ",
      modality: "ทวิภาวะ",
      ruler: "พฤหัส/เนปจูน",
      desc: "“มีน” โทนอ่อนโยน ละเมียด และใช้สัญชาตญาณ",
      tags: ["สัญชาตญาณ", "ละเมียด", "เยียวยา"],
      strengths: ["เข้าใจคน", "มีจินตนาการ", "เมตตาและเยียวยา"],
      cautions: ["หลงอารมณ์", "ขอบเขตไม่ชัด", "หนีปัญหาเมื่อเครียด"],
      tips: ["ตั้งขอบเขตให้ตัวเอง", "ทำงานแบบมีกรอบเวลา", "ใช้ศิลปะ/สมาธิช่วยรีชาร์จ"],
    },
  ];

  const byKey = new Map(DATA.map((d) => [d.key, d]));

  function polar(cx, cy, r, deg) {
    const rad = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function wedgePath(cx, cy, r, a0, a1) {
    const p0 = polar(cx, cy, r, a0);
    const p1 = polar(cx, cy, r, a1);
    const largeArc = a1 - a0 > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${p0.x} ${p0.y} A ${r} ${r} 0 ${largeArc} 1 ${p1.x} ${p1.y} Z`;
  }

  function clearSvg() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
  }

  let activeKey = null;
  let overlay = null;

  function ensureOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.zIndex = "80";
    overlay.style.display = "none";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.padding = "18px";
    overlay.style.background = "rgba(0,0,0,.55)";
    overlay.style.backdropFilter = "blur(6px)";
    overlay.innerHTML = `
      <div role="dialog" aria-modal="true" aria-label="รายละเอียดราศี" style="
        width:min(820px, 100%);
        border:1px solid rgba(255,255,255,.14);
        border-radius: 18px;
        background: rgba(10,16,32,.92);
        box-shadow: 0 18px 45px rgba(0,0,0,.45);
        padding: 16px;
        max-height: min(78vh, 720px);
        overflow: auto;
      ">
        <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px;">
          <div>
            <p style="margin:0 0 6px; color: rgba(159,176,218,.92); font-size:12px;">ราศีที่เลือก</p>
            <h3 data-ov-title style="margin:0; font-size:22px;">—</h3>
            <p data-ov-meta style="margin:6px 0 0; color: rgba(193,205,235,.9); font-size:13px;">—</p>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-ov-close style="align-self:flex-start;">ปิด</button>
        </div>
        <p data-ov-desc style="margin:10px 0 0; color: rgba(193,205,235,.95);">—</p>
        <div style="margin-top: 12px; border-top: 1px solid rgba(255,255,255,.10); padding-top: 12px;">
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div style="border:1px solid rgba(255,255,255,.10); border-radius: 16px; padding: 12px; background: rgba(255,255,255,.03);">
              <p style="margin:0 0 8px; font-weight:700;">สรุปสั้นๆ</p>
              <div data-ov-tags style="display:flex; gap:8px; flex-wrap:wrap;"></div>
            </div>
            <div style="border:1px solid rgba(255,255,255,.10); border-radius: 16px; padding: 12px; background: rgba(255,255,255,.03);">
              <p style="margin:0 0 8px; font-weight:700;">ข้อมูลพื้นฐาน</p>
              <dl style="margin:0; display:grid; grid-template-columns: 120px 1fr; gap: 6px 10px; color: rgba(193,205,235,.95);">
                <dt style="color: rgba(159,176,218,.92); font-size:12px;">ช่วงวัน</dt><dd data-ov-range style="margin:0;">—</dd>
                <dt style="color: rgba(159,176,218,.92); font-size:12px;">ธาตุ</dt><dd data-ov-element style="margin:0;">—</dd>
                <dt style="color: rgba(159,176,218,.92); font-size:12px;">คุณภาพ</dt><dd data-ov-modality style="margin:0;">—</dd>
                <dt style="color: rgba(159,176,218,.92); font-size:12px;">ดาวเจ้าเรือน</dt><dd data-ov-ruler style="margin:0;">—</dd>
              </dl>
            </div>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px;">
            <div style="border:1px solid rgba(255,255,255,.10); border-radius: 16px; padding: 12px; background: rgba(255,255,255,.03);">
              <p style="margin:0 0 8px; font-weight:700;">จุดเด่น</p>
              <ul data-ov-strengths style="margin:0; padding-left: 18px; color: rgba(193,205,235,.95);"></ul>
            </div>
            <div style="border:1px solid rgba(255,255,255,.10); border-radius: 16px; padding: 12px; background: rgba(255,255,255,.03);">
              <p style="margin:0 0 8px; font-weight:700;">ข้อควรระวัง</p>
              <ul data-ov-cautions style="margin:0; padding-left: 18px; color: rgba(193,205,235,.95);"></ul>
            </div>
          </div>

          <div style="border:1px solid rgba(255,255,255,.10); border-radius: 16px; padding: 12px; background: rgba(255,255,255,.03); margin-top: 12px;">
            <p style="margin:0 0 8px; font-weight:700;">คำแนะนำการใช้พลังราศีนี้</p>
            <ul data-ov-tips style="margin:0; padding-left: 18px; color: rgba(193,205,235,.95);"></ul>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const close = qs("[data-ov-close]", overlay);
    close?.addEventListener("click", () => (overlay.style.display = "none"));
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.style.display = "none";
    });
    document.addEventListener("keydown", (e) => {
      if (overlay.style.display !== "none" && e.key === "Escape") overlay.style.display = "none";
    });

    return overlay;
  }

  function renderInfo(key) {
    activeKey = key ?? null;

    if (!activeKey) {
      panel.innerHTML = `
        <p class="zodiac-kicker">ดูราศี</p>
        <h3 class="zodiac-title">เลือกที่วงล้อด้านซ้าย</h3>
        <p class="zodiac-desc">เอาเมาส์ไปชี้เพื่อไฮไลต์ แล้วคลิกเพื่อดูข้อมูลของราศีนั้น</p>
        <div class="zodiac-tags" role="list" aria-label="คีย์เวิร์ด"></div>
        <div class="zodiac-actions">
          <button class="btn btn-ghost btn-sm" type="button" data-zodiac-open disabled aria-disabled="true">ดูรายละเอียด</button>
          <a class="btn btn-ghost btn-sm" href="#topics">ดูบทเรียนที่เกี่ยวข้อง</a>
        </div>
      `;
      return;
    }

    const d = byKey.get(activeKey) || byKey.get("aries");
    const tagsHtml = d.tags.map((t) => `<span class="tag" role="listitem">${t}</span>`).join("");
    panel.innerHTML = `
      <p class="zodiac-kicker">ราศีที่เลือก</p>
      <h3 class="zodiac-title">${d.title}</h3>
      <p class="zodiac-desc">${d.desc}</p>
      <div class="zodiac-tags" role="list" aria-label="คีย์เวิร์ด">${tagsHtml}</div>
      <div class="zodiac-actions">
        <button class="btn btn-ghost btn-sm" type="button" data-zodiac-open>ดูรายละเอียด</button>
        <a class="btn btn-ghost btn-sm" href="#topics">ดูบทเรียนที่เกี่ยวข้อง</a>
      </div>
    `;

    qs("[data-zodiac-open]", panel)?.addEventListener("click", () => openOverlay(activeKey));
  }

  function openOverlay(key) {
    if (!key) return;
    const d = byKey.get(key) || byKey.get("aries");
    const ov = ensureOverlay();
    const t = qs("[data-ov-title]", ov);
    const meta = qs("[data-ov-meta]", ov);
    const desc = qs("[data-ov-desc]", ov);
    const tags = qs("[data-ov-tags]", ov);
    const range = qs("[data-ov-range]", ov);
    const el = qs("[data-ov-element]", ov);
    const mod = qs("[data-ov-modality]", ov);
    const ruler = qs("[data-ov-ruler]", ov);
    const strengths = qs("[data-ov-strengths]", ov);
    const cautions = qs("[data-ov-cautions]", ov);
    const tips = qs("[data-ov-tips]", ov);
    if (t) t.textContent = d.title;
    if (meta) meta.textContent = [d.element, d.modality].filter(Boolean).join(" • ") || "—";
    if (desc) desc.textContent = d.desc;
    if (tags) tags.innerHTML = d.tags.map((x) => `<span class="tag">${x}</span>`).join("");
    if (range) range.textContent = d.range || "—";
    if (el) el.textContent = d.element || "—";
    if (mod) mod.textContent = d.modality || "—";
    if (ruler) ruler.textContent = d.ruler || "—";
    if (strengths) strengths.innerHTML = (d.strengths || []).map((x) => `<li>${x}</li>`).join("");
    if (cautions) cautions.innerHTML = (d.cautions || []).map((x) => `<li>${x}</li>`).join("");
    if (tips) tips.innerHTML = (d.tips || []).map((x) => `<li>${x}</li>`).join("");
    ov.style.display = "flex";
  }

  function setActive(seg, key) {
    qsa(".zodiac-seg", svg).forEach((p) => p.classList.toggle("is-active", p === seg));
    renderInfo(key);
  }

  function buildSegments() {
    clearSvg();
    const ns = "http://www.w3.org/2000/svg";
    const cx = 50;
    const cy = 50;
    const r = 49.5;
    const step = 360 / DATA.length;
    const start = -90; // top

    DATA.forEach((d, i) => {
      const a0 = start + i * step;
      const a1 = a0 + step;
      const path = document.createElementNS(ns, "path");
      path.setAttribute("d", wedgePath(cx, cy, r, a0, a1));
      path.classList.add("zodiac-seg");
      path.dataset.key = d.key;
      // Don't allow SVG paths to receive focus (prevents browser focus rectangle on click).
      path.setAttribute("role", "button");
      path.setAttribute("aria-label", `เลือก ${d.title}`);

      path.addEventListener("pointerdown", (e) => {
        // prevent focus ring / selection highlight in some browsers
        e.preventDefault();
      });
      path.addEventListener("click", () => setActive(path, d.key));
      svg.appendChild(path);
    });
  }

  buildSegments();
  // initial: no selection
  renderInfo(null);
  openBtn?.addEventListener("click", () => openOverlay(activeKey));
}

function setupScrollReveal() {
  const els = qsa(".reveal");
  if (!els.length) return;
  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  if (prefersReduced) {
    els.forEach((el) => el.classList.add("is-inview"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-inview");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "40px 0px -10% 0px" }
  );

  els.forEach((el) => io.observe(el));
}

function setupAmbientGlow() {
  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  if (prefersReduced) return;
  const finePointer = window.matchMedia?.("(pointer: fine)")?.matches ?? false;
  if (!finePointer) return;

  const canvas = qs("[data-sparkles]");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const DPR = Math.min(2, window.devicePixelRatio || 1);
  let w = 0;
  let h = 0;

  function resize() {
    w = Math.max(1, Math.floor(window.innerWidth));
    h = Math.max(1, Math.floor(window.innerHeight));
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  const particles = [];
  const maxParticles = 55;
  const baseStars = [];
  const baseCount = 38;
  for (let i = 0; i < baseCount; i++) {
    baseStars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.7 + Math.random() * 1.1,
      a: 0.06 + Math.random() * 0.09,
      tw: Math.random() * Math.PI * 2,
      sp: 0.35 + Math.random() * 0.85,
    });
  }

  let mx = w * 0.5;
  let my = h * 0.25;
  let lastEmit = 0;

  function emit(x, y, strength = 1) {
    const count = Math.max(1, Math.floor(1 * strength));
    for (let i = 0; i < count; i++) {
      if (particles.length >= maxParticles) particles.shift();
      particles.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.8) * 0.26,
        life: 0,
        ttl: 780 + Math.random() * 520,
        r: 0.6 + Math.random() * 1.2,
        hue: Math.random() < 0.55 ? 45 : 215, // gold/blue
      });
    }
  }

  function drawSpark(x, y, size) {
    // 4-point sparkle (no circles)
    ctx.beginPath();
    ctx.moveTo(x - size, y);
    ctx.lineTo(x + size, y);
    ctx.moveTo(x, y - size);
    ctx.lineTo(x, y + size);
    ctx.stroke();
  }

  window.addEventListener(
    "mousemove",
    (e) => {
      mx = e.clientX;
      my = e.clientY;
      const now = performance.now();
      const dt = now - lastEmit;
      if (dt > 42) {
        emit(mx, my, Math.min(1.4, dt / 70));
        lastEmit = now;
      }
    },
    { passive: true }
  );

  let raf = 0;
  let last = performance.now();
  function draw(now) {
    raf = requestAnimationFrame(draw);
    const dt = Math.min(40, now - last);
    last = now;

    ctx.clearRect(0, 0, w, h);

    // Intentionally no "flashlight" glow. Keep only sparkles/streaks.

    // base twinkling stars (kept subtle)
    ctx.lineWidth = 1;
    for (const s of baseStars) {
      s.tw += (dt / 1000) * s.sp;
      const a = s.a + Math.sin(s.tw) * 0.05;
      ctx.globalAlpha = Math.max(0, a);
      ctx.strokeStyle = "rgba(234,240,255,1)";
      drawSpark(s.x, s.y, s.r);
    }

    // moving sparkle particles
    ctx.globalCompositeOperation = "lighter";
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life += dt;
      const t = p.life / p.ttl;
      if (t >= 1) {
        particles.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      const alpha = (1 - t) * 0.35;
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = p.hue === 45 ? "rgba(255,215,155,1)" : "rgba(143,180,255,1)";
      // short streak (comet-like), plus tiny sparkle
      const dx = p.vx * 34;
      const dy = p.vy * 34;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - dx, p.y - dy);
      ctx.stroke();
      drawSpark(p.x, p.y, p.r);
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
  }
  raf = requestAnimationFrame(draw);
}

setupNav();
setupPathTabs();
setupZodiacWheel();
setupScrollReveal();
// pointer sparkles (movement only)

function setupMiniTour() {
  const seenKey = "mlc_tour_seen_v1";
  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  if (prefersReduced) return;

  const startBtn = qs("[data-tour-start]");

  const steps = [
    {
      key: "path",
      title: "เริ่มเรียนตรงไหน",
      desc: "ถ้าเป็นมือใหม่ แนะนำไล่ตาม Learning Path ก่อน 1 รอบ จะจับแกนได้ไว",
    },
    {
      key: "zodiac",
      title: "ดูราศีแบบวงล้อ",
      desc: "เอาเมาส์ไปชี้แล้วคลิกเพื่อดูข้อมูลราศี (อยากดูเต็มๆ กด “ดูรายละเอียด”)",
    },
    {
      key: "featured",
      title: "วิดีโอแนะนำ",
      desc: "ถ้าไม่รู้จะเริ่มคลิปไหน ลองเริ่ม 3 คลิปนี้ก่อน แล้วค่อยไล่ต่อเป็นหมวด",
    },
  ];

  let idx = 0;
  let open = false;

  const tour = document.createElement("div");
  tour.className = "tour";
  tour.innerHTML = `
    <div class="tour-shade" data-tour-shade>
      <div data-tour-shade-top></div>
      <div data-tour-shade-left></div>
      <div data-tour-shade-right></div>
      <div data-tour-shade-bottom></div>
    </div>
    <div class="tour-spot" data-tour-spot></div>
    <div class="tour-card" data-tour-card role="dialog" aria-modal="true" aria-label="แนะนำการใช้งาน">
      <p class="tour-kicker" data-tour-kicker>ทัวร์สั้นๆ</p>
      <h3 class="tour-title" data-tour-title>—</h3>
      <p class="tour-desc" data-tour-desc>—</p>
      <div class="tour-actions">
        <button class="tour-link" type="button" data-tour-skip>ข้าม</button>
        <div class="tour-right">
          <button class="tour-btn" type="button" data-tour-prev>ย้อนกลับ</button>
          <button class="tour-btn primary" type="button" data-tour-next>ถัดไป</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(tour);

  const shade = qs("[data-tour-shade]", tour);
  const shadeTop = qs("[data-tour-shade-top]", tour);
  const shadeLeft = qs("[data-tour-shade-left]", tour);
  const shadeRight = qs("[data-tour-shade-right]", tour);
  const shadeBottom = qs("[data-tour-shade-bottom]", tour);
  const spot = qs("[data-tour-spot]", tour);
  const card = qs("[data-tour-card]", tour);
  const titleEl = qs("[data-tour-title]", tour);
  const descEl = qs("[data-tour-desc]", tour);
  const prevBtn = qs("[data-tour-prev]", tour);
  const nextBtn = qs("[data-tour-next]", tour);
  const skipBtn = qs("[data-tour-skip]", tour);

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function targetEl(stepKey) {
    const section = document.querySelector(`[data-tour="${stepKey}"]`);
    if (!section) return null;
    const isMobile = window.matchMedia?.("(max-width: 720px)")?.matches ?? false;
    // On small screens, prefer a smaller target so the spotlight doesn't become "full screen".
    if (isMobile) {
      return (
        section.querySelector("[data-tour-target-mobile]") ||
        section.querySelector("[data-tour-target]") ||
        section.querySelector(".container") ||
        section
      );
    }
    // Desktop: use main target.
    return section.querySelector("[data-tour-target]") || section.querySelector(".container") || section;
  }

  let posRaf = 0;
  let tracking = false;
  let currentTarget = null;

  function applyPosition(el) {
    if (!open) return;
    if (!el) return;

    const r = el.getBoundingClientRect();
    // Highlight should match the real content box as closely as possible.
    const pad = 0;
    const maxW = Math.max(1, window.innerWidth - 24);
    const maxH = Math.max(1, window.innerHeight - 24);
    const w = clamp(r.width + pad * 2, 80, maxW);
    const h = clamp(r.height + pad * 2, 60, maxH);
    const x = clamp(r.left - pad, 12, Math.max(12, window.innerWidth - 12 - w));
    const y = clamp(r.top - pad, 12, Math.max(12, window.innerHeight - 12 - h));

    spot.style.left = `${x}px`;
    spot.style.top = `${y}px`;
    spot.style.width = `${w}px`;
    spot.style.height = `${h}px`;

    // Shade outside the spotlight (keeps highlighted area "bright")
    if (shadeTop && shadeLeft && shadeRight && shadeBottom) {
      shadeTop.style.left = "0px";
      shadeTop.style.top = "0px";
      shadeTop.style.width = "100%";
      shadeTop.style.height = `${Math.max(0, y)}px`;

      shadeBottom.style.left = "0px";
      shadeBottom.style.top = `${y + h}px`;
      shadeBottom.style.width = "100%";
      shadeBottom.style.height = `${Math.max(0, window.innerHeight - (y + h))}px`;

      shadeLeft.style.left = "0px";
      shadeLeft.style.top = `${y}px`;
      shadeLeft.style.width = `${Math.max(0, x)}px`;
      shadeLeft.style.height = `${h}px`;

      shadeRight.style.left = `${x + w}px`;
      shadeRight.style.top = `${y}px`;
      shadeRight.style.width = `${Math.max(0, window.innerWidth - (x + w))}px`;
      shadeRight.style.height = `${h}px`;
    }

    // Card placement: desktop -> near target; mobile -> bottom sheet via CSS.
    const isMobile = window.matchMedia?.("(max-width: 720px)")?.matches ?? false;
    if (!isMobile) {
      const gap = 14;
      const cardW = Math.min(420, window.innerWidth - 32);
      const leftPrefer = r.right + gap;
      const left = leftPrefer + cardW < window.innerWidth - 12 ? leftPrefer : Math.max(12, r.left - gap - cardW);
      const top = clamp(r.top, 12, window.innerHeight - 12 - card.offsetHeight);
      card.style.left = `${left}px`;
      card.style.top = `${top}px`;
      card.style.right = "auto";
      card.style.bottom = "auto";
    }
  }

  function startTracking(el) {
    currentTarget = el;
    if (tracking) return;
    tracking = true;

    const loop = () => {
      if (!open) {
        tracking = false;
        posRaf = 0;
        return;
      }
      if (currentTarget) applyPosition(currentTarget);
      posRaf = requestAnimationFrame(loop);
    };

    loop();
  }

  function stopTracking() {
    tracking = false;
    currentTarget = null;
    if (posRaf) cancelAnimationFrame(posRaf);
    posRaf = 0;
  }

  function position() {
    if (!open) return;
    const step = steps[idx];
    const el = targetEl(step.key);
    if (!el) return;

    // Scroll once to bring it into view, then keep spotlight locked to the same element.
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    applyPosition(el);
    startTracking(el);
  }

  function render() {
    const step = steps[idx];
    if (titleEl) titleEl.textContent = step.title;
    if (descEl) descEl.textContent = step.desc;
    if (prevBtn) prevBtn.disabled = idx === 0;
    if (nextBtn) nextBtn.textContent = idx === steps.length - 1 ? "เริ่มใช้งาน" : "ถัดไป";
    position();
  }

  function openTour(markSeen = false) {
    if (markSeen) localStorage.setItem(seenKey, "1");
    open = true;
    idx = 0;
    tour.classList.add("is-open");
    render();
  }

  function closeTour(markSeen = true) {
    if (markSeen) localStorage.setItem(seenKey, "1");
    open = false;
    tour.classList.remove("is-open");
    stopTracking();
  }

  function next() {
    if (idx >= steps.length - 1) {
      closeTour(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    idx += 1;
    render();
  }

  function prev() {
    idx = Math.max(0, idx - 1);
    render();
  }

  nextBtn?.addEventListener("click", next);
  prevBtn?.addEventListener("click", prev);
  skipBtn?.addEventListener("click", () => closeTour(true));
  shade?.addEventListener("click", () => closeTour(true));
  startBtn?.addEventListener("click", () => openTour(false));

  window.addEventListener("resize", () => position(), { passive: true });
  window.addEventListener("orientationchange", () => position(), { passive: true });
  window.addEventListener(
    "scroll",
    () => {
      if (!open) return;
      if (currentTarget) applyPosition(currentTarget);
    },
    { passive: true }
  );
  document.addEventListener("keydown", (e) => {
    if (!open) return;
    if (e.key === "Escape") closeTour(true);
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

  // Auto-run first visit only
  const hasSeen = localStorage.getItem(seenKey) === "1";
  if (!hasSeen) {
    // small delay so layout is stable
    setTimeout(() => openTour(true), 550);
  }
}

setupMiniTour();

function setupPointerSparkles() {
  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  if (prefersReduced) return;

  const canvas = qs("[data-pointer-sparkles]");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const DPR = Math.min(2, window.devicePixelRatio || 1);
  let w = 0;
  let h = 0;

  function resize() {
    w = Math.max(1, Math.floor(window.innerWidth));
    h = Math.max(1, Math.floor(window.innerHeight));
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  const particles = [];
  const maxParticles = 90;

  function drawSpark(x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x - size, y);
    ctx.lineTo(x + size, y);
    ctx.moveTo(x, y - size);
    ctx.lineTo(x, y + size);
    ctx.stroke();
  }

  function emit(x, y, strength) {
    const count = Math.max(1, Math.floor(strength));
    for (let i = 0; i < count; i++) {
      if (particles.length >= maxParticles) particles.shift();
      particles.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.8) * 0.28,
        life: 0,
        ttl: 520 + Math.random() * 520,
        r: 0.7 + Math.random() * 1.3,
        hue: Math.random() < 0.65 ? 215 : 45, // mostly blue, some gold
      });
    }
  }

  let lastX = w * 0.5;
  let lastY = h * 0.25;
  let lastEmit = 0;
  let pointerDown = false;

  function onPointerMove(e) {
    const x = e.clientX;
    const y = e.clientY;
    const now = performance.now();
    const dt = now - lastEmit;
    const dx = x - lastX;
    const dy = y - lastY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Only emit when there's meaningful movement (prevents "busy" look)
    if (dist > 8 && dt > 26) {
      const strength = pointerDown ? Math.min(3.4, dist / 14) : Math.min(2.4, dist / 18);
      emit(x, y, strength);
      lastEmit = now;
      lastX = x;
      lastY = y;
    } else {
      lastX = x;
      lastY = y;
    }
  }

  window.addEventListener("pointerdown", () => (pointerDown = true), { passive: true });
  window.addEventListener("pointerup", () => (pointerDown = false), { passive: true });
  window.addEventListener("pointercancel", () => (pointerDown = false), { passive: true });
  window.addEventListener("pointermove", onPointerMove, { passive: true });

  let raf = 0;
  let last = performance.now();
  function loop(now) {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(40, now - last);
    last = now;

    ctx.clearRect(0, 0, w, h);
    if (!particles.length) return;

    ctx.globalCompositeOperation = "lighter";
    ctx.lineWidth = 1;
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life += dt;
      const t = p.life / p.ttl;
      if (t >= 1) {
        particles.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      const alpha = (1 - t) * 0.34;
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = p.hue === 45 ? "rgba(255,215,155,1)" : "rgba(143,180,255,1)";

      // short streak + sparkle (no circles)
      const dx = p.vx * 40;
      const dy = p.vy * 40;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - dx, p.y - dy);
      ctx.stroke();
      drawSpark(p.x, p.y, p.r);
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
  }
  raf = requestAnimationFrame(loop);
}

setupPointerSparkles();
