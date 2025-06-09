<script>
document.addEventListener("DOMContentLoaded", () => {
  const verifyButton = document.getElementById("verify-id");
  const contactPinField = document.getElementById("Contact-Pin");
  const form = document.getElementById("wf-form-Membership-verification");

  verifyButton.addEventListener("click", async (event) => {
    event.preventDefault();

    // Retrieve and parse the _ms-mem object from localStorage
    const msMem = localStorage.getItem("_ms-mem");
    let email;

    try {
      const msMemParsed = JSON.parse(msMem);
      email = msMemParsed?.auth?.email; // Safely access nested email property
    } catch (e) {
      console.error("Error parsing _ms-mem from localStorage:", e);
    }

    if (!email) {
      alert("No verified email found in local storage. Please log in again.");
      return;
    }

    const companyId = contactPinField ? contactPinField.value.trim() : "";
    if (!companyId) {
      alert("Please enter your Company ID.");
      return;
    }

    try {
      verifyButton.disabled = true;
      verifyButton.textContent = "Verifying...";

      const response = await fetch("https://membershipverification.onrender.com/update-company-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, companyId }),
      });

      const responseText = await response.text();
      try {
        const result = JSON.parse(responseText); // Attempt to parse JSON
        if (response.ok) {
          window.location.href = "https://biaw-stage-api-e2c83eb8ec4f7fa18e3c274d.webflow.io/member-confirmation";
        } else {
          alert(result.error || "Verification failed. Please try again.");
        }
      } catch (e) {
        console.error("Server returned a non-JSON response:", responseText);
        alert("An unexpected error occurred. Please contact support.");
      }
    } catch (error) {
      console.error("Error verifying Company ID:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      verifyButton.disabled = false;
      verifyButton.textContent = "Verify";
    }
  });
});
</script>
