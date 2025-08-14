<script>
const API_BASE = "https://api.apico.dev/v1/8wOeqw/1XSvYd-t98BwhZg5hE8llZNw3t1xBRYXAGYsEPz2kWEA/values/Sheet1";
const API_URL_READ = "https://opensheet.elk.sh/1XSvYd-t98BwhZg5hE8llZNw3t1xBRYXAGYsEPz2kWEA/Sheet1";

// ====== REGISTER ======
async function getExistingUserIDs() {
    const res = await fetch(API_BASE);
    const data = await res.json();
    return data.values ? data.values.map(row => row[0]) : [];
}

function generateUserID(baseName, existingIDs) {
    let userID = baseName.toLowerCase().replace(/\s+/g, '');
    while (existingIDs.includes(userID)) {
        const random4 = Math.floor(1000 + Math.random() * 9000);
        userID = `${baseName.toLowerCase().replace(/\s+/g, '')}${random4}`;
    }
    return userID;
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("pass").value.trim();

    const existingIDs = await getExistingUserIDs();
    const userID = generateUserID(name, existingIDs);

    const options = {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            values: [[userID, name, email, pass]]
        })
    };

    const res = await fetch(`${API_BASE}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS&includeValuesInResponse=true`, options);
    const result = await res.json();

    if (result && result.updates) {
        localStorage.setItem("userID", userID);
        window.location.href = "/";
    } else {
        alert("Pendaftaran gagal. Coba lagi.");
    }
}

// ====== LOGIN ======
async function login() {
    const userField = document.getElementById("userID");
    const passField = document.getElementById("pass");
    const errorDiv = document.getElementById("loginError");

    const userID = userField.value.trim();
    const pass = passField.value.trim();

    if (!userID || !pass) {
        errorDiv.textContent = "Harap isi semua field.";
        return;
    }

    try {
        const res = await fetch(API_URL_READ);
        const data = await res.json();

        const user = data.find(u => u.userID === userID && u.pass === pass);

        if (user) {
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
            window.location.href = "/dashboard";
        } else {
            errorDiv.textContent = "User ID atau Password salah.";
        }
    } catch (err) {
        console.error(err);
        errorDiv.textContent = "Gagal menghubungi server.";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // Jika ada form register
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", handleRegister);
    }

    // Jika ada tombol login
    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) {
        loginBtn.addEventListener("click", function(e) {
            e.preventDefault();
            login();
        });
    }
});
</script>
