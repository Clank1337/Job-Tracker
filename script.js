window.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("darkModeToggle");
    const isDark = localStorage.getItem("darkMode") === "true";

    if (isDark) {
        document.body.classList.add("dark-mode");
    }

    toggleBtn?.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        const isDark = document.body.classList.contains("dark-mode");
        localStorage.setItem("darkMode", isDark);
    });

    // ✅ Move this inside DOMContentLoaded
    document.getElementById("applicationForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const application = {
            company: document.getElementById("company").value.trim(),
            position: document.getElementById("position").value.trim(),
            date: document.getElementById("date").value,
            status: document.getElementById("status").value,
            notes: document.getElementById("notes").value.trim(),
        };

        saveApplication(application);
        this.reset();
    });

    loadApplications();
});

function loadApplications() {
    const data = localStorage.getItem("jobApplications");
    const jobTableBody = document.getElementById("jobTableBody");

    if (!data) return;

    const applications = JSON.parse(data);
    jobTableBody.innerHTML = "";

    applications.forEach((app, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${app.company}</td>
      <td>${app.position}</td>
      <td>${app.date}</td>
      <td><span class="badge ${getStatusBadge(app.status)}">${capitalize(app.status)}</span></td>
      <td>${app.notes}</td>
      <td class="text-end">
            <button class="btn btn-sm btn-outline-primary me-2" onclick="editApplication(${index})">Edit</button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteApplication(${index})">Delete</button>
       </td>
    `;
        jobTableBody.appendChild(row);
    });
}

function saveApplication(application) {
    const data = localStorage.getItem("jobApplications");
    const applications = data ? JSON.parse(data) : [];
    applications.push(application);
    localStorage.setItem("jobApplications", JSON.stringify(applications));
    loadApplications();
}

function deleteApplication(index) {
    const data = localStorage.getItem("jobApplications");
    const applications = data ? JSON.parse(data) : [];
    applications.splice(index, 1); // remove 1 item at index
    localStorage.setItem("jobApplications", JSON.stringify(applications));
    loadApplications();
}

function editApplication(index) {
    const data = localStorage.getItem("jobApplications");
    const applications = data ? JSON.parse(data) : [];
    const app = applications[index];

    document.getElementById("company").value = app.company;
    document.getElementById("position").value = app.position;
    document.getElementById("date").value = app.date;
    document.getElementById("status").value = app.status;
    document.getElementById("notes").value = app.notes;

    applications.splice(index, 1);
    localStorage.setItem("jobApplications", JSON.stringify(applications));
    loadApplications();
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

function getStatusBadge(status) {
    switch (status.toLowerCase()) {
        case "applied": return "bg-secondary";
        case "interview": return "bg-info text-dark";
        case "offer": return "bg-success";
        case "rejected": return "bg-danger";
        default: return "bg-light text-dark";
    }
}
