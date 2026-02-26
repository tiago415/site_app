// ======== CONFIG ========
// Mete aqui as tuas configs:
const SUPABASE_URL = "https://lclllvpdnfwrnqxrbnj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_8w_m-1RjRiHNHBzikYpglQ_g6agnrHW"; 

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// ======== FORM ========
const form = document.getElementById("waitlistForm");
const msg = document.getElementById("formMsg");
const btn = document.getElementById("submitBtn");

function setMsg(text, ok=false){
  msg.textContent = text;
  msg.style.color = ok ? "#a7f3d0" : "";
}

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  setMsg("");
  btn.disabled = true;
  btn.textContent = (window.__LANG__ === "en") ? "Sending..." : "A enviar...";

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const source = document.getElementById("source").value.trim();

  const { error } = await supabase
    .from("waitlist_signups")
    .insert([{
      name: name || null,
      email,
      language: window.__LANG__ || "pt",
      source: source || "site",
      status: "new"
    }]);

  if (error) {
    const m = (error.message || "").toLowerCase();
    if (m.includes("duplicate") || m.includes("unique")) {
      setMsg((window.__LANG__ === "en") ? "This email is already on the waitlist." : "Este email já está inscrito.");
    } else {
      setMsg((window.__LANG__ === "en") ? "Error. Please try again." : "Erro. Tenta novamente.");
      console.log(error);
    }
  } else {
    form.reset();
    setMsg((window.__LANG__ === "en")
      ? "Done ✅ We’ll email you at launch."
      : "Feito ✅ Vamos avisar-te no lançamento.", true);
  }

  btn.disabled = false;
  btn.textContent = (window.__LANG__ === "en") ? "Join" : "Inscrever";
});
