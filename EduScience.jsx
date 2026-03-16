import { useState, useEffect, useRef } from "react";

const _P = "7278265006";

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────────── */
const SUBJECTS_INIT = {
  mathematics: { label: "Mathematics", icon: "∑", color: "#FF6B35", grad: "linear-gradient(135deg,#FF6B35,#FF9A5C)", chapters: [] },
  physics:     { label: "Physics",     icon: "⚡", color: "#00C2E0", grad: "linear-gradient(135deg,#0052D4,#00C2E0)", chapters: [] },
  chemistry:   { label: "Chemistry",   icon: "⚗️", color: "#A855F7", grad: "linear-gradient(135deg,#7C3AED,#A855F7)",  chapters: [] },
};

/* ─────────────────────────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────────────────────────── */
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
:root{
  --bg:#07090E;
  --c1:#0D1018;
  --c2:#141820;
  --c3:#1B2030;
  --bd:rgba(255,255,255,0.07);
  --tx:#E2E8F4;
  --mt:#7A8899;
  --or:#FF6B35;
  --gn:#10B981;
  --rd:#FF4757;
  --pu:#A855F7;
}
body{font-family:'Sora',sans-serif;background:var(--bg);color:var(--tx);min-height:100vh;}
.root{max-width:430px;margin:0 auto;min-height:100vh;background:var(--bg);position:relative;}
::-webkit-scrollbar{width:3px;}
::-webkit-scrollbar-thumb{background:var(--c3);}
.anim{animation:show .25s ease;}
@keyframes show{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:none;}}

/* cards */
.card{background:var(--c1);border:1px solid var(--bd);border-radius:16px;}
.card2{background:var(--c2);border:1px solid var(--bd);border-radius:12px;}

/* inputs */
input,textarea,select{
  background:var(--c2);border:1.5px solid var(--bd);border-radius:10px;
  padding:12px 15px;color:var(--tx);font-family:'Sora',sans-serif;
  font-size:14px;outline:none;width:100%;transition:border-color .2s;
}
input:focus,textarea:focus,select:focus{border-color:var(--or);}
input::placeholder,textarea::placeholder{color:var(--mt);}
textarea{resize:none;min-height:88px;}
select{cursor:pointer;}

/* buttons */
.primary{
  background:var(--or);color:#fff;border:none;border-radius:12px;padding:13px;
  font-family:'Sora',sans-serif;font-weight:700;font-size:14px;cursor:pointer;
  width:100%;display:flex;align-items:center;justify-content:center;gap:8px;
  transition:filter .18s;
}
.primary:hover{filter:brightness(1.1);}
.primary:disabled{opacity:.4;cursor:not-allowed;filter:none;}
.outline{
  background:var(--c2);color:var(--tx);border:1px solid var(--bd);
  border-radius:9px;padding:8px 12px;font-family:'Sora',sans-serif;
  font-size:12px;font-weight:600;cursor:pointer;
  display:flex;align-items:center;gap:6px;transition:background .15s;white-space:nowrap;
}
.outline:hover{background:var(--c3);}
.redbtn{
  background:rgba(255,71,87,.1);color:var(--rd);border:1px solid rgba(255,71,87,.2);
  border-radius:9px;padding:7px 10px;font-family:'Sora',sans-serif;
  font-size:12px;font-weight:600;cursor:pointer;
  display:flex;align-items:center;gap:5px;transition:background .15s;
}
.redbtn:hover{background:rgba(255,71,87,.22);}

/* header / nav */
.hdr{
  position:sticky;top:0;z-index:50;
  display:flex;align-items:center;justify-content:space-between;padding:13px 18px;
  background:rgba(7,9,14,.94);backdrop-filter:blur(20px);
  border-bottom:1px solid var(--bd);
}
.bnav{
  position:fixed;bottom:0;left:50%;transform:translateX(-50%);
  width:100%;max-width:430px;
  background:rgba(7,9,14,.97);backdrop-filter:blur(24px);
  border-top:1px solid var(--bd);
  display:flex;padding:8px 0 20px;z-index:100;
}
.nitem{
  flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;
  padding:6px;border:none;background:none;color:var(--mt);
  font-family:'Sora',sans-serif;font-size:10px;font-weight:600;cursor:pointer;
  transition:color .15s;
}
.nitem.active{color:var(--or);}

/* progress */
.pbar{height:4px;background:var(--c3);border-radius:2px;overflow:hidden;}
.pfill{height:100%;border-radius:2px;transition:width .5s ease;}

/* tag */
.tag{
  display:inline-flex;align-items:center;
  background:rgba(255,107,53,.1);color:var(--or);
  border:1px solid rgba(255,107,53,.2);border-radius:20px;
  padding:3px 10px;font-size:11px;font-weight:600;
}

/* bottom sheet / modal */
.overlay{
  position:fixed;inset:0;background:rgba(0,0,0,.88);
  backdrop-filter:blur(8px);z-index:200;
  display:flex;align-items:flex-end;justify-content:center;
}
.sheet{
  background:var(--c1);border-radius:24px 24px 0 0;
  border:1px solid var(--bd);border-bottom:none;
  width:100%;max-width:430px;
  padding:20px 20px 32px;max-height:88vh;overflow-y:auto;
  animation:slideup .25s ease;
}
@keyframes slideup{from{transform:translateY(36px);opacity:0;}to{transform:none;opacity:1;}}
.pill{height:4px;width:38px;background:var(--c3);border-radius:2px;margin:0 auto 18px;}

/* confirm overlay */
.cfm-bg{
  position:fixed;inset:0;background:rgba(0,0,0,.92);
  backdrop-filter:blur(10px);z-index:300;
  display:flex;align-items:center;justify-content:center;padding:24px;
}
.cfm-box{
  background:var(--c1);border:1px solid rgba(255,71,87,.25);
  border-radius:20px;padding:28px 22px;width:100%;max-width:360px;text-align:center;
}

/* video row */
.vrow{
  display:flex;align-items:center;gap:11px;
  padding:9px 10px;border-radius:11px;cursor:pointer;
  transition:background .13s;
}
.vrow:hover{background:var(--c2);}
.vthumb{
  width:78px;height:50px;border-radius:8px;
  background:var(--c3);overflow:hidden;flex-shrink:0;
  position:relative;display:flex;align-items:center;justify-content:center;
}
.vthumb img{width:100%;height:100%;object-fit:cover;}
.playov{
  position:absolute;inset:0;
  display:flex;align-items:center;justify-content:center;
  background:rgba(0,0,0,.42);border-radius:8px;
}

/* chat bubbles */
.bubble{max-width:76%;padding:10px 14px;border-radius:18px;font-size:13px;line-height:1.5;}
.bubble.me{background:var(--or);color:#fff;border-bottom-right-radius:4px;align-self:flex-end;}
.bubble.them{background:var(--c2);color:var(--tx);border-bottom-left-radius:4px;}

/* quiz options */
.qopt{
  background:var(--c2);border:2px solid var(--bd);border-radius:10px;
  padding:12px 14px;color:var(--tx);font-family:'Sora',sans-serif;
  font-size:13px;cursor:pointer;width:100%;text-align:left;transition:all .18s;
}
.qopt:hover{border-color:var(--or);}
.qopt.right{border-color:var(--gn);background:rgba(16,185,129,.1);}
.qopt.wrong{border-color:var(--rd);background:rgba(255,71,87,.1);}

/* subject card */
.subj{
  border-radius:20px;padding:20px;cursor:pointer;
  position:relative;overflow:hidden;transition:transform .18s;
  border:1px solid rgba(255,255,255,.07);
}
.subj:hover{transform:scale(1.015);}
.subj::before{content:'';position:absolute;inset:0;background:rgba(0,0,0,.2);}
.subj>*{position:relative;z-index:1;}

/* empty state */
.empty{text-align:center;padding:52px 16px;color:var(--mt);}
.emicon{font-size:46px;margin-bottom:12px;}
`;

/* ─────────────────────────────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────────────────────────────── */
function Ic({ n, s = 20, c = "currentColor" }) {
  const map = {
    google:  <svg width={s} height={s} viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>,
    home:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    chat:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
    user:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    heart:   <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
    heartF:  <svg width={s} height={s} viewBox="0 0 24 24" fill="#FF4757" stroke="#FF4757" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
    dl:      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    spark:   <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    play:    <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><polygon points="5 3 19 12 5 21 5 3"/></svg>,
    back:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>,
    send:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    shield:  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    upload:  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>,
    check:   <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
    note:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    quiz:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" strokeLinecap="round"/></svg>,
    plus:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    trash:   <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
    logout:  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    chev:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
    warn:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" strokeLinecap="round"/></svg>,
  };
  return map[n] || null;
}

/* ─────────────────────────────────────────────────────────────────────────────
   CONFIRM DIALOG
───────────────────────────────────────────────────────────────────────────── */
function Confirm({ title, body, onYes, onNo }) {
  return (
    <div className="cfm-bg">
      <div className="cfm-box">
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,71,87,.12)", border: "1px solid rgba(255,71,87,.28)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          <Ic n="warn" s={26} c="var(--rd)" />
        </div>
        <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
        <p style={{ color: "var(--mt)", fontSize: 13, marginBottom: 22, lineHeight: 1.6 }}>{body}</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onNo} className="outline" style={{ flex: 1, justifyContent: "center", padding: 12 }}>Cancel</button>
          <button onClick={onYes} style={{ flex: 1, background: "var(--rd)", color: "#fff", border: "none", borderRadius: 10, padding: 12, fontFamily: "Sora", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SCREEN: LOGIN
───────────────────────────────────────────────────────────────────────────── */
function LoginScreen({ onStudent, onAdmin }) {
  const [showGate, setShowGate] = useState(false);
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  function tryAdmin() {
    setBusy(true);
    setErr("");
    setTimeout(() => {
      if (pass === _P) {
        setShowGate(false);
        setPass("");
        onAdmin();
      } else {
        setErr("Wrong password. ଆଉ ଥରେ ଚେଷ୍ଟା କରନ୍ତୁ।");
      }
      setBusy(false);
    }, 600);
  }

  return (
    <div className="anim" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -100, left: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,107,53,.12) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -80, right: -60, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,194,224,.08) 0%,transparent 70%)", pointerEvents: "none" }} />

      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ width: 80, height: 80, borderRadius: 26, background: "linear-gradient(135deg,#FF6B35,#FF9A5C)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, margin: "0 auto 16px", boxShadow: "0 20px 48px rgba(255,107,53,.3)" }}>🔬</div>
        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-1.5px" }}>Edu<span style={{ color: "var(--or)" }}>Science</span></h1>
        <p style={{ color: "var(--mt)", fontSize: 12, marginTop: 6 }}>CHSE Odisha · Class 11 Science</p>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
          {["∑ Math", "⚡ Physics", "⚗️ Chemistry"].map(x => (
            <span key={x} className="tag" style={{ fontSize: 10 }}>{x}</span>
          ))}
        </div>
      </div>

      <div className="card" style={{ width: "100%", padding: 22 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 5 }}>Student Login</h2>
        <p style={{ color: "var(--mt)", fontSize: 13, marginBottom: 18 }}>Google account ଦ୍ୱାରା login କରନ୍ତୁ</p>
        <button className="primary" onClick={onStudent} style={{ background: "#fff", color: "#111", fontWeight: 700, marginBottom: 12 }}>
          <Ic n="google" s={18} /> Continue with Google
        </button>
        <div style={{ textAlign: "center", color: "var(--mt)", fontSize: 11, margin: "10px 0" }}>─── or ───</div>
        <button className="outline" onClick={() => { setShowGate(true); setErr(""); setPass(""); }} style={{ width: "100%", justifyContent: "center", padding: 12 }}>
          <Ic n="shield" s={15} c="var(--pu)" /> Admin Panel
        </button>
      </div>

      {/* Password gate overlay */}
      {showGate && (
        <div className="overlay" onClick={() => setShowGate(false)}>
          <div className="sheet" onClick={e => e.stopPropagation()}>
            <div className="pill" />
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 42, height: 42, borderRadius: 13, background: "linear-gradient(135deg,#7C3AED,#A855F7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ic n="shield" s={20} c="#fff" />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>Admin Access</h3>
                <p style={{ fontSize: 12, color: "var(--mt)" }}>Password enter କରନ୍ତୁ</p>
              </div>
            </div>

            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--mt)", display: "block", marginBottom: 7 }}>Password</label>
            <div style={{ position: "relative", marginBottom: 12 }}>
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••••"
                value={pass}
                onChange={e => { setPass(e.target.value); setErr(""); }}
                onKeyDown={e => { if (e.key === "Enter") tryAdmin(); }}
                autoFocus
                style={{ paddingRight: 44 }}
              />
              <button
                onClick={() => setShowPass(v => !v)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--mt)", fontSize: 16 }}
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>

            {err && (
              <div style={{ background: "rgba(255,71,87,.08)", border: "1px solid rgba(255,71,87,.2)", borderRadius: 8, padding: "10px 12px", marginBottom: 12 }}>
                <p style={{ color: "var(--rd)", fontSize: 12 }}>{err}</p>
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button className="outline" onClick={() => setShowGate(false)} style={{ flex: 1, justifyContent: "center", padding: 12 }}>Cancel</button>
              <button className="primary" onClick={tryAdmin} disabled={busy || !pass} style={{ flex: 1, background: "linear-gradient(135deg,#7C3AED,#A855F7)" }}>
                {busy ? "Checking..." : "Enter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SCREEN: PROFILE SETUP
───────────────────────────────────────────────────────────────────────────── */
function SetupScreen({ onDone }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const valid = name.trim().length > 1 && email.includes("@") && phone.replace(/\D/g, "").length >= 10;

  return (
    <div className="anim" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", padding: "64px 24px 32px" }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>👤</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Profile Setup</h1>
        <p style={{ color: "var(--mt)", fontSize: 13, marginBottom: 28 }}>ଏକ ଥର ଭର୍ତ୍ତି କରନ୍ତୁ</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--mt)", display: "block", marginBottom: 7 }}>Full Name</label>
            <input type="text" placeholder="ଆପଣଙ୍କ ପୂରା ନାଁ" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--mt)", display: "block", marginBottom: 7 }}>Email</label>
            <input type="email" placeholder="yourname@gmail.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--mt)", display: "block", marginBottom: 7 }}>Phone</label>
            <input type="tel" placeholder="+91 xxxxxxxxxx" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
        </div>
      </div>
      <button className="primary" onClick={() => onDone({ name: name.trim(), email: email.trim(), phone: phone.trim() })} disabled={!valid} style={{ opacity: valid ? 1 : 0.4 }}>
        <Ic n="check" s={16} c="#fff" /> Continue
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SCREEN: WELCOME
───────────────────────────────────────────────────────────────────────────── */
function WelcomeScreen({ name, onGo }) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVis(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="anim" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 40%,rgba(255,107,53,.1) 0%,transparent 60%)", pointerEvents: "none" }} />
      <div style={{ transition: "all .8s cubic-bezier(.175,.885,.32,1.275)", transform: vis ? "none" : "translateY(32px) scale(.95)", opacity: vis ? 1 : 0 }}>
        <div style={{ fontSize: 80, marginBottom: 14 }}>🎉</div>
        <p style={{ color: "var(--or)", fontWeight: 700, fontSize: 12, letterSpacing: 3, marginBottom: 8, textTransform: "uppercase" }}>Welcome to EduScience</p>
        <h1 style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.15, marginBottom: 12 }}>
          ନମସ୍କାର,<br />
          <span style={{ color: "var(--or)" }}>{name.split(" ")[0]}!</span>
        </h1>
        <p style={{ color: "var(--mt)", fontSize: 13, lineHeight: 1.8, maxWidth: 270, margin: "0 auto 28px" }}>
          CHSE Class 11 Science ର ତୁମ journey ଆଜିଠୁ। ଶିଖ ଓ ସଫଳ ହୁଅ! 🚀
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 28 }}>
          {[["🎯", "Lectures"], ["🤖", "AI Summary"], ["💬", "Group Chat"], ["📝", "Quiz"]].map(([e, l]) => (
            <div key={l} className="card2" style={{ padding: "11px 8px", textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: 18 }}>{e}</div>
              <div style={{ fontSize: 9, color: "var(--mt)", marginTop: 4, fontWeight: 600 }}>{l}</div>
            </div>
          ))}
        </div>
        <button className="primary" onClick={onGo} style={{ maxWidth: 240 }}>Start Learning →</button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SCREEN: HOME (Student Dashboard)
───────────────────────────────────────────────────────────────────────────── */
function HomeScreen({ student, subjects, watched, liked, onSubject }) {
  const total = Object.values(subjects).reduce((a, s) => a + s.chapters.reduce((b, c) => b + c.videos.length, 0), 0);
  const wc = Object.keys(watched).length;
  const prog = total > 0 ? Math.round((wc / total) * 100) : 0;

  return (
    <div className="anim" style={{ paddingBottom: 90 }}>
      <div style={{ padding: "22px 20px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <p style={{ color: "var(--mt)", fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>CHSE Odisha · Class 11</p>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginTop: 2 }}>ନମସ୍କାର, {student.name.split(" ")[0]}! 👋</h2>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#FF6B35,#FF9A5C)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, fontWeight: 800, color: "#fff" }}>
            {student.name[0].toUpperCase()}
          </div>
        </div>

        {total > 0 && (
          <div className="card" style={{ padding: 14, marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--mt)" }}>Overall Progress</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--or)" }}>{prog}%</span>
            </div>
            <div className="pbar">
              <div className="pfill" style={{ width: prog + "%", background: "linear-gradient(90deg,#FF6B35,#FF9A5C)" }} />
            </div>
            <p style={{ fontSize: 11, color: "var(--mt)", marginTop: 6 }}>{wc} / {total} lectures watched</p>
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[[wc, "Watched", "#00C2E0"], [Object.keys(liked).length, "Liked", "#FF4757"], [3, "Subjects", "#A855F7"]].map(([v, l, col]) => (
            <div key={l} className="card2" style={{ flex: 1, padding: "11px 6px", textAlign: "center" }}>
              <div style={{ fontSize: 19, fontWeight: 800, color: col }}>{v}</div>
              <div style={{ fontSize: 10, color: "var(--mt)" }}>{l}</div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 11, fontWeight: 700, color: "var(--mt)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Subjects</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          {Object.entries(subjects).map(([key, s]) => {
            const tv = s.chapters.reduce((a, c) => a + c.videos.length, 0);
            const wv = s.chapters.reduce((a, c) => a + c.videos.filter(v => watched[v.id]).length, 0);
            const pct = tv > 0 ? Math.round((wv / tv) * 100) : 0;
            return (
              <div key={key} className="subj" onClick={() => onSubject(key)} style={{ background: s.grad }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 30, marginBottom: 6 }}>{s.icon}</div>
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{s.label}</h3>
                    <p style={{ color: "rgba(255,255,255,.7)", fontSize: 12, marginTop: 2 }}>
                      {s.chapters.length > 0 ? s.chapters.length + " Chapters · " + tv + " Videos" : "Content coming soon"}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>{pct}%</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)" }}>Done</div>
                  </div>
                </div>
                {tv > 0 && (
                  <div style={{ marginTop: 12, height: 3, background: "rgba(255,255,255,.2)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: pct + "%", background: "#fff", transition: "width .5s" }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SCREEN: SUBJECT (chapter list)
───────────────────────────────────────────────────────────────────────────── */
function SubjectScreen({ sk, subj, watched, onChapter, onBack }) {
  return (
    <div className="anim" style={{ paddingBottom: 80 }}>
      <div className="hdr">
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <Ic n="back" s={22} c="var(--mt)" />
        </button>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>{subj.label}</h2>
          <p style={{ fontSize: 10, color: "var(--mt)" }}>{subj.chapters.length} Chapters</p>
        </div>
        <div style={{ width: 28 }} />
      </div>

      <div style={{ padding: 14 }}>
        <div style={{ borderRadius: 18, padding: 20, background: subj.grad, marginBottom: 16, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -8, right: -8, fontSize: 86, opacity: .16 }}>{subj.icon}</div>
          <h3 style={{ fontSize: 26, fontWeight: 800, color: "#fff" }}>{subj.label}</h3>
          <p style={{ color: "rgba(255,255,255,.72)", fontSize: 12 }}>Class 11 · CHSE Odisha</p>
        </div>

        {subj.chapters.length === 0 ? (
          <div className="empty">
            <div className="emicon">📭</div>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>No chapters yet</h3>
            <p style={{ fontSize: 13 }}>Admin ଏଖନ content upload କରି ନାହାଁନ୍ତି।</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--mt)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>All Chapters</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {subj.chapters.map((ch, i) => {
                const wv = ch.videos.filter(v => watched[v.id]).length;
                const pct = ch.videos.length > 0 ? Math.round((wv / ch.videos.length) * 100) : 0;
                return (
                  <div key={ch.id} className="card" onClick={() => onChapter(ch)} style={{ padding: 14, cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--c2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: subj.color, flexShrink: 0 }}>
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{ch.name}</h4>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 11, color: "var(--mt)" }}>{ch.videos.length} Lectures</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: pct === 100 ? "var(--gn)" : "var(--mt)" }}>{pct}%</span>
                        </div>
                        <div className="pbar" style={{ marginTop: 5 }}>
                          <div className="pfill" style={{ width: pct + "%", background: subj.grad }} />
                        </div>
                      </div>
                      <Ic n="chev" s={15} c="var(--mt)" />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SCREEN: CHAPTER (video list)
───────────────────────────────────────────────────────────────────────────── */
function ChapterScreen({ ch, sk, subj, watched, liked, onVideo, onBack, onQuiz }) {
  return (
    <div className="anim" style={{ paddingBottom: 80 }}>
      <div className="hdr">
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <Ic n="back" s={22} c="var(--mt)" />
        </button>
        <div style={{ textAlign: "center", flex: 1, padding: "0 8px" }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ch.name}</h2>
          <p style={{ fontSize: 10, color: "var(--mt)" }}>{sk} · {ch.videos.length} Videos</p>
        </div>
        <button onClick={onQuiz} className="outline" style={{ padding: "7px 11px" }}>
          <Ic n="quiz" s={13} c="var(--or)" /> Quiz
        </button>
      </div>

      {ch.videos.length === 0 ? (
        <div className="empty">
          <div className="emicon">📹</div>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>No videos yet</h3>
          <p style={{ fontSize: 13 }}>Admin ଏଖନ videos upload କରି ନାହାଁନ୍ତି।</p>
        </div>
      ) : (
        <div style={{ padding: "12px" }}>
          {ch.videos.map((v, idx) => (
            <div key={v.id} className="vrow" onClick={() => onVideo(v)}>
              <div className="vthumb">
                <img src={v.thumb} alt="" onError={e => { e.target.style.display = "none"; }} />
                <div className="playov">
                  {watched[v.id]
                    ? <div style={{ background: "var(--gn)", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Ic n="check" s={11} c="#fff" />
                      </div>
                    : <Ic n="play" s={14} c="#fff" />
                  }
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.35, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {idx + 1}. {v.title}
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ fontSize: 11, color: "var(--mt)" }}>⏱ {v.duration}</span>
                  {liked[v.id] && <span style={{ fontSize: 10, color: "var(--rd)" }}>❤️</span>}
                </div>
              </div>
              <Ic n="chev" s={14} c="var(--mt)" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SCREEN: VIDEO PLAYER
───────────────────────────────────────────────────────────────────────────── */
function VideoScreen({ v, ch, sk, isLiked, isDl, noteVal, summ, summing, onBack, onLike, onDl, onSummarize, onNote }) {
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState(noteVal || "");
  const [lang, setLang] = useState("odia");
  const [saved, setSaved] = useState(false);

  return (
    <div className="anim" style={{ paddingBottom: 24 }}>
      <div className="hdr">
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <Ic n="back" s={22} c="var(--mt)" />
        </button>
        <div style={{ flex: 1, padding: "0 10px" }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.title}</h2>
          <p style={{ fontSize: 10, color: "var(--mt)" }}>{sk} · {ch.name}</p>
        </div>
      </div>

      <div style={{ aspectRatio: "16/9", background: "#000" }}>
        <iframe
          width="100%" height="100%"
          src={v.url + "?autoplay=1&modestbranding=1&rel=0"}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title={v.title}
          style={{ display: "block" }}
        />
      </div>

      <div style={{ padding: "14px 16px 0" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 13, lineHeight: 1.4 }}>{v.title}</h3>

        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          <button className="outline" onClick={onLike} style={{ color: isLiked ? "var(--rd)" : "var(--mt)", borderColor: isLiked ? "rgba(255,71,87,.3)" : "var(--bd)" }}>
            <Ic n={isLiked ? "heartF" : "heart"} s={14} /> {isLiked ? "Liked" : "Like"}
          </button>
          <button className="outline" onClick={onDl} style={{ color: isDl ? "var(--gn)" : "var(--mt)", borderColor: isDl ? "rgba(16,185,129,.3)" : "var(--bd)" }}>
            <Ic n="dl" s={14} /> {isDl ? "Saved" : "Download"}
          </button>
          <button className="outline" onClick={() => setShowNote(x => !x)} style={{ color: showNote ? "var(--or)" : "var(--mt)", borderColor: showNote ? "rgba(255,107,53,.3)" : "var(--bd)" }}>
            <Ic n="note" s={14} /> Notes
          </button>
        </div>

        <div className="card2" style={{ padding: 15, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#FF6B35,#FF9A5C)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ic n="spark" s={14} c="#fff" />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700 }}>AI Summarizer</span>
            </div>
            <select value={lang} onChange={e => setLang(e.target.value)} style={{ width: "auto", fontSize: 11, padding: "5px 8px" }}>
              <option value="odia">ଓଡ଼ିଆ</option>
              <option value="hindi">हिंदी</option>
              <option value="english">English</option>
            </select>
          </div>
          {summ
            ? <p style={{ fontSize: 13, lineHeight: 1.75, color: "var(--mt)", background: "var(--c3)", borderRadius: 9, padding: "11px 13px" }}>{summ}</p>
            : (
              <button className="primary" onClick={() => onSummarize(lang)} disabled={summing} style={{ fontSize: 13, padding: 11 }}>
                {summing ? "⏳ Summary ତିଆରି ହେଉଛି..." : "✨ ଏହି Video Summary ଦିଅ"}
              </button>
            )
          }
        </div>

        {showNote && (
          <div className="card2" style={{ padding: 15 }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 9, display: "flex", alignItems: "center", gap: 6 }}>
              <Ic n="note" s={13} /> Personal Notes
            </h4>
            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="ଏଠାରେ notes ଲେଖ..." />
            <button
              className="primary"
              onClick={() => { onNote(note); setSaved(true); setTimeout(() => setSaved(false), 1400); }}
              style={{ marginTop: 10, padding: 11, fontSize: 13, background: saved ? "var(--gn)" : "var(--or)" }}
            >
              {saved ? <><Ic n="check" s={15} c="#fff" /> Saved!</> : "Save Notes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SCREEN: GROUP CHAT
───────────────────────────────────────────────────────────────────────────── */
function ChatScreen({ student, msgs, onSend }) {
  const [grp, setGrp] = useState("mathematics");
  const [txt, setTxt] = useState("");
  const endRef = useRef();

  useEffect(() => {
    endRef.current && endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [msgs, grp]);

  const GC = { mathematics: "#FF6B35", physics: "#00C2E0", chemistry: "#A855F7" };
  const GI = { mathematics: "∑", physics: "⚡", chemistry: "⚗️" };
  const filtered = msgs.filter(m => m.subject === grp);

  function send() {
    if (!txt.trim()) return;
    onSend({ text: txt.trim(), subject: grp });
    setTxt("");
  }

  return (
    <div className="anim" style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="hdr">
        <h2 style={{ fontSize: 17, fontWeight: 700 }}>Group Chat</h2>
        <div style={{ width: 30 }} />
      </div>

      <div style={{ display: "flex", gap: 7, padding: "10px 14px", borderBottom: "1px solid var(--bd)", overflowX: "auto" }}>
        {["mathematics", "physics", "chemistry"].map(g => (
          <button key={g} onClick={() => setGrp(g)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontFamily: "Sora", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", background: grp === g ? GC[g] : "var(--c2)", color: grp === g ? "#fff" : "var(--mt)", transition: "all .18s" }}>
            {GI[g]} {g.charAt(0).toUpperCase() + g.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", color: "var(--mt)", fontSize: 13, marginTop: 50 }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>💬</div>
            ଏହି group ରେ conversation ଆରମ୍ଭ କର!
          </div>
        )}
        {filtered.map(m => {
          const mine = m.user === student.name;
          return (
            <div key={m.id} style={{ display: "flex", flexDirection: "column", alignItems: mine ? "flex-end" : "flex-start" }}>
              {!mine && <p style={{ fontSize: 10, color: "var(--mt)", marginBottom: 3, marginLeft: 4 }}>{m.user}</p>}
              <div className={"bubble " + (mine ? "me" : "them")}>{m.text}</div>
              <p style={{ fontSize: 10, color: "var(--mt)", marginTop: 2, marginLeft: 4, marginRight: 4 }}>{m.time}</p>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <div style={{ padding: "10px 14px 96px", borderTop: "1px solid var(--bd)", display: "flex", gap: 8, background: "var(--bg)" }}>
        <input
          placeholder={"Message " + grp + " group..."}
          value={txt}
          onChange={e => setTxt(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") send(); }}
          style={{ flex: 1 }}
        />
        <button onClick={send} style={{ width: 44, height: 44, borderRadius: 12, border: "none", background: GC[grp], cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Ic n="send" s={16} c="#fff" />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SCREEN: PROFILE
───────────────────────────────────────────────────────────────────────────── */
function ProfileScreen({ student, liked, dl, watched, subjects, onLogout }) {
  const [tab, setTab] = useState("liked");
  const all = Object.values(subjects).flatMap(s => s.chapters.flatMap(c => c.videos));
  const likedVids = all.filter(v => liked[v.id]);
  const dlVids = all.filter(v => dl[v.id]);

  function VList({ vids, empty }) {
    if (vids.length === 0) {
      return (
        <div className="empty" style={{ padding: "24px 0" }}>
          <div style={{ fontSize: 34, marginBottom: 8 }}>📭</div>
          <p>{empty}</p>
        </div>
      );
    }
    return (
      <div>
        {vids.map(v => (
          <div key={v.id} className="vrow" style={{ cursor: "default" }}>
            <div className="vthumb">
              <img src={v.thumb} alt="" onError={e => { e.target.style.display = "none"; }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.title}</p>
              <p style={{ fontSize: 11, color: "var(--mt)" }}>⏱ {v.duration}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="anim" style={{ paddingBottom: 90 }}>
      <div className="hdr">
        <h2 style={{ fontSize: 17, fontWeight: 700 }}>My Profile</h2>
        <button onClick={onLogout} className="redbtn" style={{ padding: "6px 12px" }}>
          <Ic n="logout" s={13} c="var(--rd)" /> Logout
        </button>
      </div>
      <div style={{ padding: 14 }}>
        <div className="card" style={{ padding: 18, display: "flex", alignItems: "center", gap: 13, marginBottom: 13 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#FF6B35,#FF9A5C)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
            {student.name[0].toUpperCase()}
          </div>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 800 }}>{student.name}</h3>
            <p style={{ fontSize: 12, color: "var(--mt)" }}>{student.email}</p>
            <p style={{ fontSize: 12, color: "var(--mt)" }}>{student.phone}</p>
            <span className="tag" style={{ marginTop: 6, display: "inline-block", fontSize: 10 }}>Class 11 · Science</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {[[Object.keys(watched).length, "Watched", "#00C2E0"], [likedVids.length, "Liked", "#FF4757"], [dlVids.length, "Downloads", "#10B981"]].map(([v, l, col]) => (
            <div key={l} className="card2" style={{ flex: 1, padding: "10px 5px", textAlign: "center" }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: col }}>{v}</div>
              <div style={{ fontSize: 10, color: "var(--mt)" }}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", background: "var(--c2)", borderRadius: 11, padding: 3, marginBottom: 13, gap: 3 }}>
          {[["liked", "❤️ Liked"], ["downloads", "⬇️ Downloads"]].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} style={{ flex: 1, padding: 9, borderRadius: 8, border: "none", background: tab === k ? "var(--c1)" : "transparent", color: tab === k ? "var(--tx)" : "var(--mt)", fontFamily: "Sora", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all .18s" }}>
              {l}
            </button>
          ))}
        </div>

        {tab === "liked" && <VList vids={likedVids} empty="ଏଖନ like ହୋଇଥିବା video ନାହିଁ" />}
        {tab === "downloads" && <VList vids={dlVids} empty="ଏଖନ download ହୋଇଥିବା video ନାହିଁ" />}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   QUIZ MODAL
───────────────────────────────────────────────────────────────────────────── */
const QUIZ_DB = {
  default: [
    { q: "CHSE ର full form:", opts: ["Council of Higher Secondary Education", "Central High School Exam", "Class Higher Science Exam", "Council of High School Exam"], ans: 0 },
    { q: "Class 11 Science ରେ compulsory subjects:", opts: ["Math only", "Physics & Chemistry only", "Physics, Chemistry + Math/Bio", "History & Geography"], ans: 2 },
  ],
};

function QuizModal({ ch, onClose }) {
  const qs = QUIZ_DB[ch.id] || QUIZ_DB.default;
  const [cur, setCur] = useState(0);
  const [sel, setSel] = useState(null);
  const [res, setRes] = useState([]);
  const [done, setDone] = useState(false);

  const q = qs[cur];
  const score = res.filter(Boolean).length;

  return (
    <div className="overlay">
      <div className="sheet">
        <div className="pill" />
        {!done ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>📝 {ch.name} Quiz</h3>
              <span style={{ fontSize: 12, color: "var(--mt)" }}>{cur + 1}/{qs.length}</span>
            </div>
            <div className="pbar" style={{ marginBottom: 16 }}>
              <div className="pfill" style={{ width: ((cur + 1) / qs.length * 100) + "%", background: "linear-gradient(90deg,#FF6B35,#FF9A5C)" }} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, lineHeight: 1.55 }}>{q.q}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {q.opts.map((o, i) => (
                <button
                  key={i}
                  className={"qopt" + (sel !== null ? (i === q.ans ? " right" : sel === i ? " wrong" : "") : "")}
                  onClick={() => { if (sel === null) setSel(i); }}
                  disabled={sel !== null}
                >
                  <span style={{ marginRight: 8, opacity: .55 }}>{String.fromCharCode(65 + i)}.</span>{o}
                </button>
              ))}
            </div>
            {sel !== null && (
              <button className="primary" onClick={() => {
                const correct = sel === q.ans;
                setRes(r => [...r, correct]);
                if (cur + 1 < qs.length) { setCur(c => c + 1); setSel(null); }
                else setDone(true);
              }}>
                {cur + 1 < qs.length ? "Next →" : "See Results"}
              </button>
            )}
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 60, marginBottom: 12 }}>
              {score === qs.length ? "🏆" : score >= qs.length / 2 ? "🎯" : "📚"}
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>{score}/{qs.length}</h2>
            <p style={{ color: "var(--mt)", marginBottom: 20, fontSize: 13 }}>
              {score === qs.length ? "Perfect! ଚମତ୍କାର!" : score >= qs.length / 2 ? "ଭଲ! ଆଉ ଅଭ୍ୟାସ କର" : "ଆଉ ଥରେ videos ଦେଖ"}
            </p>
            <button className="primary" onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ADMIN PANEL
───────────────────────────────────────────────────────────────────────────── */
function AdminPanel({ subjects, onAdd, onDelCh, onDelVid, onLogout }) {
  const [page, setPage] = useState("home");       // "home" | "subject" | "upload"
  const [selSub, setSelSub] = useState(null);
  const [chName, setChName] = useState("");
  const [links, setLinks] = useState([{ title: "", url: "" }]);
  const [ytUrl, setYtUrl] = useState("");
  const [mode, setMode] = useState("manual");     // "manual" | "youtube"
  const [published, setPublished] = useState(false);
  const [confirm, setConfirm] = useState(null);   // { type, id, chId, title, body }

  const totalV = Object.values(subjects).reduce((a, s) => a + s.chapters.reduce((b, c) => b + c.videos.length, 0), 0);
  const totalC = Object.values(subjects).reduce((a, s) => a + s.chapters.length, 0);

  function getYtId(url) {
    const m = url.match(/(?:v=|embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
  }

  function doPublish() {
    if (!chName.trim()) return;
    if (mode === "manual") {
      const vids = links.filter(v => v.title.trim() && v.url.trim());
      if (vids.length === 0) return;
      const ch = {
        id: "ch_" + Date.now(),
        name: chName.trim(),
        videos: vids.map((v, i) => {
          const id = getYtId(v.url);
          return {
            id: "v_" + Date.now() + "_" + i,
            title: v.title.trim(),
            url: id ? "https://www.youtube.com/embed/" + id : v.url.trim(),
            duration: "—:——",
            thumb: id ? "https://img.youtube.com/vi/" + id + "/mqdefault.jpg" : "",
          };
        }),
      };
      onAdd(selSub, ch);
    } else {
      const listId = (ytUrl.match(/list=([a-zA-Z0-9_-]+)/) || [])[1];
      const ch = {
        id: "ch_" + Date.now(),
        name: chName.trim(),
        videos: [{
          id: "v_yt_" + Date.now(),
          title: chName.trim(),
          url: listId ? "https://www.youtube.com/embed/videoseries?list=" + listId : ytUrl.trim(),
          duration: "—:——",
          thumb: "",
        }],
      };
      onAdd(selSub, ch);
    }
    setPublished(true);
    setTimeout(() => {
      setPublished(false);
      setPage("subject");
      setChName("");
      setLinks([{ title: "", url: "" }]);
      setYtUrl("");
    }, 1500);
  }

  function goBack() {
    if (page === "upload") setPage("subject");
    else setPage("home");
  }

  const curChapters = selSub ? subjects[selSub].chapters : [];

  return (
    <div className="anim" style={{ paddingBottom: 20 }}>
      {confirm && (
        <Confirm
          title={confirm.title}
          body={confirm.body}
          onNo={() => setConfirm(null)}
          onYes={() => {
            if (confirm.type === "ch") {
              onDelCh(selSub, confirm.id);
              if (page !== "home") setPage("subject");
            }
            if (confirm.type === "vid") {
              onDelVid(selSub, confirm.chId, confirm.id);
            }
            setConfirm(null);
          }}
        />
      )}

      <div className="hdr">
        {page !== "home"
          ? <button onClick={goBack} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <Ic n="back" s={22} c="var(--mt)" />
            </button>
          : <div style={{ width: 28 }} />
        }
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: 15, fontWeight: 700 }}>🛡️ Admin Panel</h2>
          <p style={{ fontSize: 10, color: "var(--pu)" }}>EduScience</p>
        </div>
        <button onClick={onLogout} className="redbtn" style={{ padding: "5px 10px", fontSize: 11 }}>
          <Ic n="logout" s={12} c="var(--rd)" /> Logout
        </button>
      </div>

      <div style={{ padding: "14px 16px" }}>

        {/* ── PAGE: HOME ── */}
        {page === "home" && (
          <>
            <div className="card2" style={{ padding: 16, marginBottom: 16, background: "linear-gradient(135deg,rgba(124,58,237,.15),rgba(168,85,247,.06))", borderColor: "rgba(168,85,247,.18)" }}>
              <p style={{ fontSize: 11, color: "var(--mt)", marginBottom: 2 }}>Logged in as</p>
              <h3 style={{ fontSize: 18, fontWeight: 800 }}>Administrator</h3>
              <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
                {[[totalV, "Videos", "📹"], [totalC, "Chapters", "📚"], [3, "Subjects", "🎓"]].map(([v, l, ic]) => (
                  <div key={l} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 17 }}>{ic}</div>
                    <div style={{ fontSize: 18, fontWeight: 800 }}>{v}</div>
                    <div style={{ fontSize: 10, color: "var(--mt)" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--mt)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Manage Subjects</p>
            {Object.entries(subjects).map(([key, s]) => (
              <div key={key} className="card" onClick={() => { setSelSub(key); setPage("subject"); }} style={{ padding: 14, cursor: "pointer", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 13, background: s.grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19 }}>{s.icon}</div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700 }}>{s.label}</h4>
                  <p style={{ fontSize: 11, color: "var(--mt)" }}>{s.chapters.length} chapters · {s.chapters.reduce((a, c) => a + c.videos.length, 0)} videos</p>
                </div>
                <Ic n="chev" s={15} c="var(--mt)" />
              </div>
            ))}
          </>
        )}

        {/* ── PAGE: SUBJECT ── */}
        {page === "subject" && selSub && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>{subjects[selSub].label}</h3>
              <button className="primary" onClick={() => setPage("upload")} style={{ width: "auto", padding: "9px 16px", fontSize: 13 }}>
                <Ic n="plus" s={15} c="#fff" /> Add Chapter
              </button>
            </div>

            {curChapters.length === 0 ? (
              <div className="empty">
                <div className="emicon">📭</div>
                <p>ଏଖନ chapter ନାହିଁ। Add Chapter ଦବାନ୍ତୁ।</p>
              </div>
            ) : (
              curChapters.map(ch => (
                <div key={ch.id} className="card" style={{ padding: 14, marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: ch.videos.length > 0 ? 10 : 0 }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: 14, fontWeight: 600 }}>{ch.name}</h4>
                      <p style={{ fontSize: 11, color: "var(--mt)" }}>{ch.videos.length} videos</p>
                    </div>
                    <button
                      className="redbtn"
                      style={{ padding: "6px 10px", fontSize: 11 }}
                      onClick={() => setConfirm({ type: "ch", id: ch.id, title: "Delete Chapter?", body: '"' + ch.name + '" ଓ ଏହାର ସମ୍ଭ videos delete ହୋଇଯିବ।' })}
                    >
                      <Ic n="trash" s={12} /> Delete
                    </button>
                  </div>

                  {ch.videos.map(v => (
                    <div key={v.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: "1px solid var(--bd)" }}>
                      <div style={{ width: 52, height: 34, borderRadius: 6, background: "var(--c3)", overflow: "hidden", flexShrink: 0 }}>
                        <img src={v.thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} />
                      </div>
                      <p style={{ flex: 1, fontSize: 12, color: "var(--mt)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.title}</p>
                      <button
                        className="redbtn"
                        style={{ padding: "5px 8px", flexShrink: 0 }}
                        onClick={() => setConfirm({ type: "vid", id: v.id, chId: ch.id, title: "Delete Video?", body: '"' + v.title + '" permanently delete ହୋଇଯିବ।' })}
                      >
                        <Ic n="trash" s={12} />
                      </button>
                    </div>
                  ))}
                </div>
              ))
            )}
          </>
        )}

        {/* ── PAGE: UPLOAD ── */}
        {page === "upload" && selSub && (
          <>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>{subjects[selSub].label} — Add Chapter</h3>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: "var(--mt)", display: "block", marginBottom: 7, fontWeight: 600 }}>Chapter Name *</label>
              <input placeholder="Eg: Chapter 1 - Sets" value={chName} onChange={e => setChName(e.target.value)} />
            </div>

            <div style={{ display: "flex", background: "var(--c2)", borderRadius: 11, padding: 3, marginBottom: 16, gap: 3 }}>
              {[["manual", "📝 Manual"], ["youtube", "▶️ YouTube Playlist"]].map(([k, l]) => (
                <button key={k} onClick={() => setMode(k)} style={{ flex: 1, padding: 10, borderRadius: 8, border: "none", background: mode === k ? "var(--c1)" : "transparent", color: mode === k ? "var(--tx)" : "var(--mt)", fontFamily: "Sora", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all .18s" }}>
                  {l}
                </button>
              ))}
            </div>

            {mode === "manual" && (
              <>
                {links.map((v, i) => (
                  <div key={i} className="card2" style={{ padding: 12, marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 11, color: "var(--or)", fontWeight: 600 }}>Video #{i + 1}</span>
                      {i > 0 && (
                        <button onClick={() => setLinks(p => p.filter((_, j) => j !== i))} className="redbtn" style={{ padding: "3px 7px" }}>
                          <Ic n="trash" s={12} />
                        </button>
                      )}
                    </div>
                    <input
                      placeholder="Video Title *"
                      value={v.title}
                      onChange={e => setLinks(p => p.map((x, j) => j === i ? { ...x, title: e.target.value } : x))}
                      style={{ marginBottom: 8 }}
                    />
                    <input
                      placeholder="YouTube URL (youtube.com/watch?v=...)"
                      value={v.url}
                      onChange={e => setLinks(p => p.map((x, j) => j === i ? { ...x, url: e.target.value } : x))}
                    />
                  </div>
                ))}
                <button className="outline" onClick={() => setLinks(p => [...p, { title: "", url: "" }])} style={{ width: "100%", justifyContent: "center", marginBottom: 14 }}>
                  <Ic n="plus" s={14} /> Add Another Video
                </button>
              </>
            )}

            {mode === "youtube" && (
              <>
                <label style={{ fontSize: 12, color: "var(--mt)", display: "block", marginBottom: 7, fontWeight: 600 }}>YouTube Playlist URL *</label>
                <input placeholder="https://www.youtube.com/playlist?list=..." value={ytUrl} onChange={e => setYtUrl(e.target.value)} style={{ marginBottom: 10 }} />
                <div className="card2" style={{ padding: 12 }}>
                  <p style={{ fontSize: 12, color: "var(--mt)", lineHeight: 1.7 }}>📌 YouTube playlist URL paste କଲେ automatically import ହେବ।</p>
                </div>
              </>
            )}

            <button
              className="primary"
              onClick={doPublish}
              disabled={!chName.trim()}
              style={{ marginTop: 16, background: published ? "var(--gn)" : "var(--or)", opacity: chName.trim() ? 1 : 0.4 }}
            >
              {published
                ? <><Ic n="check" s={15} c="#fff" /> Published!</>
                : <><Ic n="upload" s={15} c="#fff" /> Publish Chapter</>
              }
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────────────────────────────────────── */
export default function App() {
  const [screen, setScreen] = useState("login");   // login | setup | welcome | student | admin
  const [student, setStudent] = useState(null);
  const [subjects, setSubjects] = useState(SUBJECTS_INIT);
  const [nav, setNav] = useState("home");

  // student drill-down
  const [selSub, setSelSub] = useState(null);
  const [selCh, setSelCh] = useState(null);
  const [selVid, setSelVid] = useState(null);
  const [quizCh, setQuizCh] = useState(null);

  // student data
  const [liked, setLiked] = useState({});
  const [dl, setDl] = useState({});
  const [watched, setWatched] = useState({});
  const [notes, setNotes] = useState({});
  const [summs, setSumms] = useState({});
  const [summing, setSumming] = useState(false);
  const [msgs, setMsgs] = useState([]);

  function logout() {
    setScreen("login");
    setStudent(null);
    setSelSub(null); setSelCh(null); setSelVid(null);
    setNav("home");
  }

  async function doSummarize(lang) {
    if (!selVid) return;
    setSumming(true);
    const lmap = { odia: "Odia (ଓଡ଼ିଆ)", hindi: "Hindi (हिंदी)", english: "English" };
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: "You are a helpful assistant for CHSE Class 11 Science students in Odisha. Summarize in " + lmap[lang] + " the key concepts from this lecture topic: \"" + selVid.title + "\" from chapter \"" + selCh.name + "\". Write 4-5 clear sentences. Respond only in " + lmap[lang] + ".",
          }],
        }),
      });
      const data = await res.json();
      const text = (data.content || []).find(x => x.type === "text")?.text || "Summary unavailable.";
      setSumms(p => ({ ...p, [selVid.id]: text }));
    } catch (_) {
      setSumms(p => ({ ...p, [selVid.id]: "Internet ଚେକ କରନ୍ତୁ ଓ ଆଉ ଥରେ ଚେଷ୍ଟା କରନ୍ତୁ।" }));
    }
    setSumming(false);
  }

  function addChapter(sk, ch) {
    setSubjects(p => ({ ...p, [sk]: { ...p[sk], chapters: [...p[sk].chapters, ch] } }));
  }

  function delChapter(sk, chId) {
    setSubjects(p => ({ ...p, [sk]: { ...p[sk], chapters: p[sk].chapters.filter(c => c.id !== chId) } }));
    if (selCh && selCh.id === chId) setSelCh(null);
  }

  function delVideo(sk, chId, vId) {
    setSubjects(p => ({
      ...p,
      [sk]: {
        ...p[sk],
        chapters: p[sk].chapters.map(c =>
          c.id === chId ? { ...c, videos: c.videos.filter(v => v.id !== vId) } : c
        ),
      },
    }));
    if (selCh && selCh.id === chId) {
      setSelCh(prev => prev ? { ...prev, videos: prev.videos.filter(v => v.id !== vId) } : null);
    }
  }

  function toggleLike(id) {
    setLiked(p => { const n = { ...p }; if (n[id]) delete n[id]; else n[id] = true; return n; });
  }

  function addMsg({ text, subject }) {
    const now = new Date();
    const time = now.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" });
    setMsgs(p => [...p, { id: Date.now(), user: student.name, text, time, subject }]);
  }

  // ── render helpers ──
  const showVideo  = screen === "student" && selVid && selCh;
  const showChap   = screen === "student" && !selVid && selCh && selSub;
  const showSubj   = screen === "student" && !selVid && !selCh && selSub && nav === "home";
  const showMain   = screen === "student" && !selVid && !selCh && (!selSub || nav !== "home");

  return (
    <>
      <style>{STYLE}</style>
      <div className="root">

        {/* LOGIN */}
        {screen === "login" && (
          <LoginScreen
            onStudent={() => setScreen("setup")}
            onAdmin={() => setScreen("admin")}
          />
        )}

        {/* PROFILE SETUP */}
        {screen === "setup" && (
          <SetupScreen onDone={f => { setStudent(f); setScreen("welcome"); }} />
        )}

        {/* WELCOME */}
        {screen === "welcome" && student && (
          <WelcomeScreen name={student.name} onGo={() => setScreen("student")} />
        )}

        {/* ADMIN */}
        {screen === "admin" && (
          <AdminPanel
            subjects={subjects}
            onAdd={addChapter}
            onDelCh={delChapter}
            onDelVid={delVideo}
            onLogout={logout}
          />
        )}

        {/* STUDENT — VIDEO */}
        {showVideo && (
          <VideoScreen
            v={selVid} ch={selCh} sk={selSub}
            isLiked={!!liked[selVid.id]}
            isDl={!!dl[selVid.id]}
            noteVal={notes[selVid.id]}
            summ={summs[selVid.id]}
            summing={summing}
            onBack={() => setSelVid(null)}
            onLike={() => toggleLike(selVid.id)}
            onDl={() => setDl(p => ({ ...p, [selVid.id]: true }))}
            onSummarize={doSummarize}
            onNote={txt => setNotes(p => ({ ...p, [selVid.id]: txt }))}
          />
        )}

        {/* STUDENT — CHAPTER */}
        {showChap && (
          <ChapterScreen
            ch={selCh} sk={selSub} subj={subjects[selSub]}
            watched={watched} liked={liked}
            onVideo={v => { setSelVid(v); setWatched(p => ({ ...p, [v.id]: true })); }}
            onBack={() => setSelCh(null)}
            onQuiz={() => setQuizCh(selCh)}
          />
        )}

        {/* STUDENT — SUBJECT */}
        {showSubj && (
          <SubjectScreen
            sk={selSub} subj={subjects[selSub]} watched={watched}
            onChapter={ch => setSelCh(ch)}
            onBack={() => setSelSub(null)}
          />
        )}

        {/* STUDENT — MAIN TABS */}
        {showMain && (
          <>
            {nav === "home" && (
              <HomeScreen
                student={student} subjects={subjects}
                watched={watched} liked={liked}
                onSubject={k => setSelSub(k)}
              />
            )}
            {nav === "chat" && (
              <ChatScreen student={student} msgs={msgs} onSend={addMsg} />
            )}
            {nav === "profile" && (
              <ProfileScreen
                student={student} liked={liked} dl={dl}
                watched={watched} subjects={subjects}
                onLogout={logout}
              />
            )}

            <nav className="bnav">
              {[["home", "Home", "home"], ["chat", "Chat", "chat"], ["profile", "Profile", "user"]].map(([k, l, ic]) => (
                <button key={k} className={"nitem" + (nav === k ? " active" : "")} onClick={() => setNav(k)}>
                  <Ic n={ic} s={20} c={nav === k ? "var(--or)" : "var(--mt)"} />
                  {l}
                </button>
              ))}
            </nav>
          </>
        )}

        {/* QUIZ MODAL */}
        {quizCh && <QuizModal ch={quizCh} onClose={() => setQuizCh(null)} />}

      </div>
    </>
  );
}
