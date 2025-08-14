document.addEventListener("DOMContentLoaded", function() {
    const API_URL = "https://opensheet.elk.sh/1XSvYd-t98BwhZg5hE8llZNw3t1xBRYXAGYsEPz2kWEA/Sheet1";

    const userField = document.getElementById("userID");
    const passField = document.getElementById("pass");
    const loginBtn = document.getElementById("loginBtn");
    const errorDiv = document.getElementById("loginError");

    async function login() {
        const userID = userField.value.trim();
        const pass = passField.value.trim();

        if (!userID || !pass) {
            errorDiv.textContent = "Harap isi semua field.";
            return;
        }

        try {
            const res = await fetch(API_URL);
            const data = await res.json();

            const user = data.find(u => u.userID === userID && u.pass === pass);

            if (user) {
                // Simpan semua field di localStorage
                localStorage.setItem("userID", user.userID || "");
                localStorage.setItem("name", user.name || "");
                localStorage.setItem("whatsapp", user.whatsapp || "");
                localStorage.setItem("email", user.email || "");
                localStorage.setItem("pass", user.pass || "");
                localStorage.setItem("image", user.image || "");
                localStorage.setItem("bank", user.bank || "");
                localStorage.setItem("namaRekening", user.namaRekening || "");
                localStorage.setItem("nomorRekening", user.nomorRekening || "");
                localStorage.setItem("saldoUtama", user.saldoUtama || "");
                localStorage.setItem("saldoTrading", user.saldoTrading || "");
                localStorage.setItem("withdraw", user.withdraw || "");
                localStorage.setItem("plan", user.plan || "");
                localStorage.setItem("durasi", user.durasi || "");

                // Arahkan ke dashboard
                window.location.href = "/dashboard"; // ganti dengan slug halaman dashboard di Webflow
            } else {
                errorDiv.textContent = "User ID atau Password salah.";
            }
        } catch (err) {
            console.error(err);
            errorDiv.textContent = "Gagal menghubungi server.";
        }
    }

    if (loginBtn) {
        loginBtn.addEventListener("click", function(e) {
            e.preventDefault();
            login();
        });
    }
});
