const API_URL = "https://api.apico.dev/v1/8wOeqw/1XSvYd-t98BwhZg5hE8llZNw3t1xBRYXAGYsEPz2kWEA/values/Sheet1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS&includeValuesInResponse=true";
const CLOUD_NAME = "daj5cu840";
const UPLOAD_PRESET = "unsigned_upload";

document.getElementById("registerForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    let name = document.getElementById("name").value.trim();
    let userID = name.toLowerCase().replace(/\s+/g, "_");
    let email = document.getElementById("email").value;
    let whatsapp = document.getElementById("whatsapp").value;
    let pass = document.getElementById("pass").value;
    let bank = document.getElementById("bank").value;
    let namaRekening = document.getElementById("namaRekening").value;
    let nomorRekening = document.getElementById("nomorRekening").value;
    let imageFile = document.getElementById("image").files[0];

    // Upload gambar ke Cloudinary
    let formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", UPLOAD_PRESET);

    let cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData
    }).then(res => res.json());

    let imageUrl = cloudinaryRes.secure_url;

    // Simpan data ke Google Sheet
    let options = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            values: [[userID, name, email, whatsapp, pass, bank, namaRekening, nomorRekening, imageUrl]]
        })
    };

    let res = await fetch(API_URL, options);
    let result = await res.json();

    if (result && !result.error) {
        // Simpan userID & pass ke localStorage
        localStorage.setItem("loginUserID", userID);
        localStorage.setItem("loginPass", pass);

        // Redirect ke login
        window.location.href = "/login.html";
    } else {
        alert("Registrasi gagal!");
    }
});
</script>
</body>
</html>
login.html
html
Copy
Edit
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Login</title>
</head>
<body>
<h2>Form Login</h2>
<form id="loginForm">
    <input type="text" id="loginUserID" placeholder="User ID" required><br>
    <input type="password" id="loginPass" placeholder="Password" required><br>
    <button type="submit">Login</button>
</form>

<script>
// Isi otomatis dari localStorage jika ada
document.getElementById("loginUserID").value = localStorage.getItem("loginUserID") || "";
document.getElementById("loginPass").value = localStorage.getItem("loginPass") || "";

// Hapus data agar tidak tersimpan terus-menerus
localStorage.removeItem("loginUserID");
localStorage.removeItem("loginPass");
