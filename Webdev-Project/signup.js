const form = document.getElementById("signup-form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = {
            fullname: form.fullname.value,
            email: form.email.value,
            password: form.password.value,
            confirmPassword: form.confirmPassword.value,
        };

        try {
            const response = await fetch("http://localhost:4000/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                window.location.href = "dashboard.html";
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred. Please try again.");
        }
    });
