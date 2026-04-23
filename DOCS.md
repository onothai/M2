# เอกสารประกอบโปรเจกต์ (MiracleLC / M2)

เอกสารนี้ทำไว้สำหรับคนที่ “รับงานต่อ” หรือ “หยิบไปใช้ต่อ” เพื่ออ่านแล้วเข้าใจเร็วว่าโปรเจกต์นี้ทำอะไร, โครงสร้างเป็นอย่างไร, หลักการทำงานของแต่ละฟีเจอร์, และต้องแก้ตรงไหนเวลาอยากปรับพฤติกรรม

---

## ภาพรวม

เว็บหน้าเดียว (static) สำหรับ “หน้านำทางการเรียน” ของช่อง **เรียนดวงกับบรมครูโหร พัฒนา พัฒนศิริ** มีองค์ประกอบหลัก ๆ ดังนี้

- ส่วน Hero + ปุ่มนำทางไป section ต่าง ๆ
- Learning Path (เส้นทางเริ่มเรียน)
- วงล้อราศี (SVG overlay บนรูป) เลือกแล้วแสดงข้อมูลด้านข้าง + เปิด modal รายละเอียด
- วิดีโอแนะนำ (embed YouTube)
- FAQ
- “Mini Tour” แนะนำการใช้งานแบบทีละสเต็ป พร้อม Spotlight ไฮไลท์ส่วนสำคัญ

ไฟล์หลักมี 3 ไฟล์:

- `index.html` โครงหน้า/โครง section/ตัว marker ที่ทัวร์ใช้
- `styles.css` งาน UI ทั้งหมด รวมถึง style ของ tour overlay/spotlight
- `script.js` งาน interaction (nav, tabs, zodiac, reveal, tour, sparkles)

---

## วิธีรัน/พรีวิว

โปรเจกต์เป็น static site เปิดไฟล์ `index.html` ได้เลย หรือรัน local server:

- Python:
  - `python -m http.server 5173`
  - แล้วเปิด `http://127.0.0.1:5173`

หมายเหตุ: ใช้ local server จะเสถียรกว่าเวลาทดสอบ asset/iframe

---

## โครงสร้าง HTML ที่ควรรู้ (`index.html`)

มี marker สำคัญที่สคริปต์อาศัย:

- **Tour step marker**: แต่ละ section ที่อยากให้ทัวร์ “ชี้” ต้องมี `data-tour="<key>"` เช่น
  - `data-tour="path"`
  - `data-tour="zodiac"`
  - `data-tour="featured"`

- **Tour target (เดสก์ท็อป)**: element ที่อยากให้ spotlight ชี้บนเดสก์ท็อป ใส่ `data-tour-target`

- **Tour target (มือถือ)**: element ที่อยากให้ spotlight ชี้บนมือถือ ใส่ `data-tour-target-mobile`
  - ใช้เมื่อ element เดิมใหญ่/สูงเกิน viewport แล้ว spotlight ดูเหมือนเต็มจอ
  - ตัวอย่างที่ตั้งไว้:
    - หน้าราศี (mobile) ชี้ไปที่วงล้อ `.zodiac-wheel`
    - วิดีโอแนะนำ (mobile) ชี้ไปที่ `video-card` ใบแรก

---

## ฟีเจอร์หลักใน `script.js`

### 1) เมนูหัวเว็บ (Mobile Nav)

- ฟังก์ชัน: `setupNav()`
- ทำงาน: toggle class `is-open` ที่ `#navMenu` และ toggle `body.nav-open` เพื่อทำ overlay/dim background

### 2) แท็บ “มือใหม่/ทบทวน/ต่อยอด”

- ฟังก์ชัน: `setupPathTabs()`
- ทำงาน: สลับ `.pill.is-active` และซ่อน/โชว์ `.path-panel`

### 3) วงล้อราศี (Zodiac Wheel)

- ฟังก์ชัน: `setupZodiacWheel()`
- ทำงานหลัก:
  - สร้าง segment ของวงล้อด้วย SVG `<path>` (จำนวน 12)
  - hover/click แล้วตั้ง `.zodiac-seg.is-active` และ render ข้อมูลฝั่ง panel
  - ปุ่ม “ดูรายละเอียด” เปิด overlay modal (สร้าง DOM overlay แบบ fixed)

**จุดที่แก้ข้อมูลราศี**

- แก้ในตัวแปร `DATA` (อาร์เรย์ของ `{ key, th, title, desc, tags }`)

### 4) Scroll reveal

- ฟังก์ชัน: `setupScrollReveal()`
- ใช้ IntersectionObserver ใส่คลาส `.is-inview` ให้ `.reveal`

### 5) Mini Tour (ทัวร์ไฮไลท์)

- ฟังก์ชัน: `setupMiniTour()`
- หน้าที่:
  - สร้าง overlay ของทัวร์ (shade + spotlight + card)
  - เดินสเต็ปตาม array `steps`
  - มีปุ่ม “ย้อนกลับ/ถัดไป/ข้าม”

**การจำว่าเคยดูทัวร์แล้ว**

- ใช้ localStorage key: `mlc_tour_seen_v1`
- ครั้งแรกที่เข้า (ยังไม่เคยเห็น) จะ auto-run
- ถ้าอยากทดสอบใหม่: ลบ key นี้ใน DevTools → Application → Local Storage

**หลักการ spotlight**

- spotlight จะคำนวณตำแหน่งจาก `getBoundingClientRect()` ของ element เป้าหมาย
- “ล็อก” ตำแหน่งตาม element เป้าหมายตลอด (อัปเดตตอน scroll/resize และติดตามด้วย requestAnimationFrame)

**เลือกเป้าหมายไฮไลท์ (สำคัญที่สุดเวลาแก้ให้ตรง)**

- ฟังก์ชัน: `targetEl(stepKey)`
  - เดสก์ท็อป: เลือก `[data-tour-target]` (หรือ fallback)
  - มือถือ: เลือก `[data-tour-target-mobile]` ก่อน (หรือ fallback)

**เพิ่ม/ลบ/เรียงสเต็ปทัวร์**

- แก้ array `steps` ใน `setupMiniTour()`:
  - `key`: ต้องตรงกับ `data-tour="<key>"` ใน HTML
  - `title`, `desc`: ข้อความในการ์ดทัวร์

**อยากให้ทัวร์ชี้ element อื่น**

1) ไปที่ section เดิมใน `index.html` (ที่มี `data-tour="..."`)
2) ย้าย `data-tour-target` / `data-tour-target-mobile` ไปยัง element ที่อยากชี้จริง
3) รีเฟรชแล้วทดสอบ (ถ้าเคยดูทัวร์แล้ว ต้องลบ `mlc_tour_seen_v1` หรือเรียกเปิดทัวร์ด้วยปุ่ม/โค้ด)

### 6) Sparkles (เอฟเฟกต์ตามเมาส์/การเลื่อน)

มี 2 ชุด:

- `setupAmbientGlow()` (ตอนนี้เน้น sparkles/streaks แบบเบา ๆ)
- `setupPointerSparkles()` (เอฟเฟกต์ตาม pointer move)

ทั้งสองชุดจะไม่ทำงานถ้า user เปิด `prefers-reduced-motion: reduce`

---

## Style ที่เกี่ยวกับ Tour (`styles.css`)

คลาสสำคัญ:

- `.tour` container ของระบบทัวร์ (fixed full screen)
- `.tour-shade` แบ่ง 4 แผ่น เพื่อทำ “มืดรอบนอก”
- `.tour-spot` คือกรอบไฮไลท์ (outline + glow)
- `.tour-card` คือการ์ดข้อความ + ปุ่มควบคุม

บนมือถือ (`max-width: 720px`) การ์ดถูกบังคับให้เป็น bottom sheet เพื่ออ่านง่าย:

- `.tour-card { bottom: 16px; top: auto; left/right: 16px; }`

---

## จุดที่เจอปัญหาบ่อย + วิธีแก้

### 1) ปุ่ม “ดูทัวร์” หาย

สคริปต์ใช้ selector: `[data-tour-start]`

- ถ้าใน `index.html` ไม่มี element นี้ ปุ่มจะไม่ทำงาน/หาไม่เจอ
- ตอนนี้ปุ่มถูก “ซ่อนไว้” ด้วย CSS (`.header-tools { display:none }`)
  - หากอยากให้แสดง: เปลี่ยนเป็น `display:flex` หรือเอากฎนี้ออก

### 2) Spotlight ไม่ตรง element

สาเหตุหลัก ๆ:

- target เลือกผิด element (เช่นชี้ container ใหญ่เกินจริง)
- element สูง/กว้างเกิน viewport บนมือถือ

แนวทาง:

- ย้าย `data-tour-target` ไปยัง “กล่องเนื้อหา” จริง
- สำหรับมือถือ ใช้ `data-tour-target-mobile` ชี้ไปยังกล่องเล็กกว่า

### 3) Spotlight ดูเหมือน “เต็มจอ” บนมือถือ

สาเหตุ: target สูงกว่า viewport → clamp ทำให้กรอบใหญ่

วิธีแก้:

- ใส่ `data-tour-target-mobile` ชี้ไป element ที่เล็กกว่า (เช่น card เฉพาะส่วนที่ต้องกด)

---

## เช็คลิสต์ก่อนส่งงาน

- เปิดบนเดสก์ท็อป + มือถือ (responsive) แล้วทดสอบ:
  - เมนู
  - คลิกแท็บ pill
  - วงล้อราศี + เปิด modal
  - ทัวร์: spotlight ตรง/ไม่เต็มจอ, ปุ่มถัดไป/ย้อนกลับ/ข้ามทำงาน
- ถ้าทัวร์ไม่ขึ้นเพราะเคยดูแล้ว: ลบ localStorage key `mlc_tour_seen_v1`

