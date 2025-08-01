import React from 'react'

const VerifyEmail = ({ email }) => {
     const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleVerify = async () => {
    const isValid = await verifyCode(email, code); // Check code in DB
    if (isValid) {
      setSuccess("Email verified successfully!");
      // Optionally update user in Firestore/Auth
    } else {
      setError("Invalid or expired code");
    }
  };

  return (
     <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">Verify your email</h2>
      <p className="mb-4 text-gray-600">Enter the 6-digit code sent to {email}</p>
      <input
        className="border px-4 py-2 w-full mb-2"
        placeholder="Enter code"
        value={code}
        // onChange={(e) => setCode(e.target.value)}
      />
      <button
        onClick={handleVerify}
        className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Verify
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </div>
  )
}

export default VerifyEmail