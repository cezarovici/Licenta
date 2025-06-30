type CompleteBusinessPayload = {
  businessName: string;
  email: string;
  password: string;
  photoUrl: string;
  businessDescription: string;
  locationName: string;
  locationAddress: string;
};

export async function registerBusinessAccount(
  payload: CompleteBusinessPayload
) {
  const response = await fetch("http://localhost:8080/api/register/business", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || "An unknown registration error occurred."
    );
  }

  localStorage.setItem("userType", "business");

  return response.json();
}
