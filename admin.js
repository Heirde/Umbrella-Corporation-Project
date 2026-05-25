document.addEventListener("DOMContentLoaded", async function () {
    const API_BASE_URL = "https://your-backend-url";
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");
    const clearance = parseInt(localStorage.getItem("clearance"));

    if (!firstName || clearance < 6) {
        window.location.href = "index.html";
        return;
    }

    const roles = ["guest", "employee", "researcher", "senior researcher", "executive", "director"];

    async function loadUsers() {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/admin/users?firstName=${firstName}&lastName=${lastName}`
            );
            const users = await response.json();

            const tbody = document.getElementById("userTableBody");
            tbody.innerHTML = "";

            users.forEach(user => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${user.firstName} ${user.lastName}</td>
                    <td>
                        <select class="admin-select" data-first="${user.firstName}" data-last="${user.lastName}">
                            ${roles.map(r => `
                                <option value="${r}" ${r === user.role ? "selected" : ""}>${r}</option>
                            `).join("")}
                        </select>
                    </td>
                    <td>
                        <select class="admin-select admin-clearance" data-first="${user.firstName}" data-last="${user.lastName}">
                            ${[1,2,3,4,5,6].map(c => `
                                <option value="${c}" ${c === user.clearance ? "selected" : ""}>Level ${c}</option>
                            `).join("")}
                        </select>
                    </td>
                    <td>
                        <button class="admin-save-btn" data-first="${user.firstName}" data-last="${user.lastName}">
                            Save
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });


            document.querySelectorAll(".admin-save-btn").forEach(btn => {
                btn.addEventListener("click", async function () {
                    const targetFirst = this.dataset.first;
                    const targetLast = this.dataset.last;
                    const row = this.closest("tr");
                    const roleSelect = row.querySelectorAll(".admin-select")[0];
                    const clearanceSelect = row.querySelectorAll(".admin-select")[1];

                    try {
                        const response = await fetch(`${API_BASE_URL}/api/admin/update`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                adminFirstName: firstName,
                                adminLastName: lastName,
                                targetFirstName: targetFirst,
                                targetLastName: targetLast,
                                role: roleSelect.value,
                                clearance: clearanceSelect.value
                            })
                        });

                        const data = await response.json();
                        if (data.success) {
                            btn.textContent = "Saved ✓";
                            btn.style.color = "#00cc66";
                            setTimeout(() => {
                                btn.textContent = "Save";
                                btn.style.color = "";
                            }, 2000);
                        }
                    } catch (err) {
                        alert("Could not connect to server");
                    }
                });
            });

        } catch (err) {
            alert("Could not load users");
        }
    }

    loadUsers();
});