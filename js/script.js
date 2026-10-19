// ===== PROJECTS PAGE =====
const grid = document.getElementById("projectGrid");
const filterBar = document.getElementById("filters");
let allProjects = [];

// Build one card per project
function renderProjects(list) {
    grid.innerHTML = "";

    if (list.length === 0) {
        grid.innerHTML = `<p class="text-center text-muted">No projects in this category yet.</p>`;
        return;
    }

    list.forEach(project => {
        const index = allProjects.indexOf(project);
        const tags = project.technologies.map(tech => `<span>${tech}</span>`).join("");

        grid.innerHTML += `
      <div class="col-md-6 col-lg-4 reveal visible">
        <div class="card project-card h-100 cat-${project.category.toLowerCase()}">
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <i class="bi ${project.icon} project-icon"></i>
              <span class="category-badge">${project.category}</span>
            </div>
            <h5 class="card-title">${project.title}</h5>
            <p class="project-date">${project.date}</p>
            <p class="card-text">${project.description}</p>
            <div class="tech-tags mt-auto">${tags}</div>
            <button class="btn btn-accent btn-sm mt-3 details-btn" data-index="${index}">View Details</button>
          </div>
        </div>
      </div>`;
    });
}

// Build filter buttons from the categories in the JSON
function buildFilters() {
    const categories = ["All", ...new Set(allProjects.map(p => p.category))];

    filterBar.innerHTML = categories.map(cat => {
        const count = cat === "All"
            ? allProjects.length
            : allProjects.filter(p => p.category === cat).length;
        const activeClass = cat === "All" ? "active" : "";
        return `<button class="filter-btn ${activeClass}" data-cat="${cat}">${cat} <span>${count}</span></button>`;
    }).join("");
}

if (grid) {
    // 1. Fetch the JSON and turn it into JavaScript objects
    fetch("data/projects.json")
        .then(response => response.json())
        .then(data => {
            allProjects = data;
            buildFilters();
            renderProjects(allProjects);
        })
        .catch(error => {
            grid.innerHTML = `<p class="text-danger">Could not load projects. Make sure you're using a local server. (${error})</p>`;
        });

    // 2. Filter when a category button is clicked
    filterBar.addEventListener("click", event => {
        const button = event.target.closest(".filter-btn");
        if (!button) return;

        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        button.classList.add("active");

        const category = button.dataset.cat;
        const filtered = category === "All"
            ? allProjects
            : allProjects.filter(p => p.category === category);

        renderProjects(filtered);
    });

    // 3. Open the modal when "View Details" is clicked
    grid.addEventListener("click", event => {
        const button = event.target.closest(".details-btn");
        if (!button) return;

        const project = allProjects[button.dataset.index];

        document.getElementById("modalTitle").textContent = project.title;
        document.getElementById("modalMeta").textContent = `${project.category} | ${project.date}`;
        document.getElementById("modalDescription").textContent = project.description;
        document.getElementById("modalHighlights").innerHTML =
            project.highlights.map(h => `<li>${h}</li>`).join("");
        document.getElementById("modalTech").innerHTML =
            project.technologies.map(t => `<span>${t}</span>`).join("");

        bootstrap.Modal.getOrCreateInstance(document.getElementById("projectModal")).show();
    });
}

// count-up animation for impact stats
const counters = document.querySelectorAll(".stat-number");

counters.forEach(counter => {
    const target = Number(counter.dataset.target);
    const suffix = counter.dataset.suffix || "";
    let current = 0;
    const step = Math.ceil(target / 40);

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        counter.textContent = current + suffix;
    }, 30);
});

// scroll reveal for timeline cards
const revealItems = document.querySelectorAll(".reveal");

if (revealItems.length > 0) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealItems.forEach(item => observer.observe(item));
}

// ===== CONTACT PAGE =====
const copyBtn = document.getElementById("copyEmailBtn");

if (copyBtn) {
    copyBtn.addEventListener("click", () => {
        const email = copyBtn.dataset.email;

        navigator.clipboard.writeText(email).then(() => {
            // Show the toast
            const toast = bootstrap.Toast.getOrCreateInstance(document.getElementById("copyToast"));
            toast.show();

            // Briefly change the button text
            copyBtn.innerHTML = `<i class="bi bi-check2"></i> Copied!`;
            setTimeout(() => {
                copyBtn.innerHTML = `<i class="bi bi-clipboard"></i> Copy Email`;
            }, 2000);
        });
    });
}