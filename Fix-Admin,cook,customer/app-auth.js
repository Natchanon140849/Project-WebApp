const CUSTOMER_KEY = "customerSession";
const STAFF_KEY = "staffSession";
const ADMIN_SIDEBAR_KEY = "adminSidebarOpen";

function saveCustomerSession(data) {
  localStorage.setItem(CUSTOMER_KEY, JSON.stringify(data));
}

function getCustomerSession() {
  try {
    return JSON.parse(localStorage.getItem(CUSTOMER_KEY));
  } catch {
    return null;
  }
}

function clearCustomerSession() {
  localStorage.removeItem(CUSTOMER_KEY);
}

function saveStaffSession(data) {
  localStorage.setItem(STAFF_KEY, JSON.stringify(data));
}

function getStaffSession() {
  try {
    return JSON.parse(localStorage.getItem(STAFF_KEY));
  } catch {
    return null;
  }
}

function clearStaffSession() {
  localStorage.removeItem(STAFF_KEY);
}

function requireCustomer() {
  const session = getCustomerSession();
  if (!session) {
    window.location.href = "customer-login.html";
  }
  return session;
}

function requireStaff(role) {
  const session = getStaffSession();
  if (!session) {
    window.location.href = "staff-login.html";
    return null;
  }

  if (role && session.role !== role) {
    window.location.href = "staff-login.html";
    return null;
  }

  return session;
}

function customerLogin() {
  const tableId = document.getElementById("tableId")?.value.trim();
  const username = document.getElementById("customerName")?.value.trim();

  if (!tableId || !username) {
    alert("Please enter table ID and username");
    return;
  }

  saveCustomerSession({
    tableId,
    username,
    loginAt: new Date().toISOString()
  });

  window.location.href = "customer-dashboard.html";
}

function staffLogin(role) {
  const id = document.getElementById("staffId")?.value.trim();
  const password = document.getElementById("staffPassword")?.value.trim();

  if (!id || !password) {
    alert("Please enter staff ID and password");
    return;
  }

  if (role === "admin") {
    if (id === "admin01" && password === "1234") {
      saveStaffSession({
        role: "admin",
        id,
        loginAt: new Date().toISOString()
      });
      window.location.href = "dashboard_Admin.html";
      return;
    }
    alert("Invalid admin ID or password");
    return;
  }

  if (role === "cook") {
    if (id === "cook01" && password === "1234") {
      saveStaffSession({
        role: "cook",
        id,
        loginAt: new Date().toISOString()
      });
      window.location.href = "cook-dashboard.html";
      return;
    }
    alert("Invalid cook ID or password");
    return;
  }
}

function logoutCustomer() {
  clearCustomerSession();
  window.location.href = "customer-login.html";
}

function logoutStaff() {
  clearStaffSession();
  window.location.href = "staff-login.html";
}

/* ===== Admin sidebar helper (ต่อจากไฟล์ที่คุณอัปโหลด) ===== */
function setupAdminSidebar() {
  const drawer = document.getElementById("admin-drawer");
  if (!(drawer instanceof HTMLInputElement)) return;

  const mediaQuery = window.matchMedia("(min-width: 1024px)");

  let stored = null;
  try {
    stored = localStorage.getItem(ADMIN_SIDEBAR_KEY);
  } catch {
    stored = null;
  }

  if (stored === "1" || stored === "0") {
    drawer.checked = stored === "1";
  } else {
    drawer.checked = mediaQuery.matches;
  }

  const persist = () => {
    try {
      localStorage.setItem(ADMIN_SIDEBAR_KEY, drawer.checked ? "1" : "0");
    } catch {}
  };

  drawer.addEventListener("change", persist);

  const handleBreakpointChange = () => {
    let now = null;
    try {
      now = localStorage.getItem(ADMIN_SIDEBAR_KEY);
    } catch {
      now = null;
    }

    if (now !== "1" && now !== "0") {
      drawer.checked = mediaQuery.matches;
    }
  };

  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", handleBreakpointChange);
  } else if (typeof mediaQuery.addListener === "function") {
    mediaQuery.addListener(handleBreakpointChange);
  }
}