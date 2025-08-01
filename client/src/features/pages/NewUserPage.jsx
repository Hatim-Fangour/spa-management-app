import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Alert, Button, Card, CardContent, CardHeader } from "@mui/material";
import {
  Bell,
  Clock,
} from "lucide-react";
import { IoRefreshCircleOutline } from "react-icons/io5";

const NewUserPage = () => {
  const navigate = useNavigate();
  const [timeElapsed, setTimeElapsed] = useState("0 minutes");

  // Simulate time elapsed since registration
  useEffect(() => {
    const startTime = Date.now() - Math.random() * 3600000; // Random time up to 1 hour ago

    const updateTime = () => {
      const elapsed = Date.now() - startTime;
      const minutes = Math.floor(elapsed / 60000);
      const hours = Math.floor(minutes / 60);

      if (hours > 0) {
        setTimeElapsed(
          `${hours} hour${hours > 1 ? "s" : ""} ${minutes % 60} minute${
            minutes % 60 !== 1 ? "s" : ""
          }`
        );
      } else {
        setTimeElapsed(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);
  // const { isRehydrated } = useSelector((state) => state._persist || {});
  const location = useLocation();
  const { claims, user, isAuthenticated } = useSelector(
    (state) => state.auth || {}
  );
  const auth = useSelector((state) => state.auth || {});
  // console.log(auth)

  useEffect(() => {
    // console.log({ claims, user, isAuthenticated, location: location.pathname });
    //  if (!isRehydrated) return;
    // console.log("Current auth:", auth);
    // 🚨 Wait until Redux state has loaded: any undefined means auth still initializing
    if (claims === undefined || user === undefined) {
      // console.log("Waiting for auth state to load...");
      navigate("/auth");
      return;
    }

    // 🚨 Once everything is defined, decide:
    // Not authenticated → redirect to auth
    if (!user) {
      // console.log("Redirecting: not authenticated or no user");
      navigate("/auth", { replace: true });
      return;
    }

    // Authenticated but not new user → redirect to auth
    if (claims !== 111) {
      navigate("/auth", { replace: true });
      return;
    }

    // Back/forward nav protection for valid new user
    const handlePopstate = () => {
      navigate("/auth", { replace: true });
    };
    window.addEventListener("popstate", handlePopstate);

    return () => window.removeEventListener("popstate", handlePopstate);
  }, [navigate, claims, isAuthenticated, user, location]);


  const  formatTimeElapsed= (seconds)=> {
  const now = new Date();
  const timestamp = new Date(seconds * 1000); // Convert Firebase seconds to milliseconds
  const elapsed = now - timestamp;

  // Calculate time units
  const secondsElapsed = Math.floor(elapsed / 1000);
  const minutesElapsed = Math.floor(secondsElapsed / 60);
  const hoursElapsed = Math.floor(minutesElapsed / 60);
  const daysElapsed = Math.floor(hoursElapsed / 24);
  const monthsElapsed = Math.floor(daysElapsed / 30);
  const yearsElapsed = Math.floor(daysElapsed / 365);

  // Return the appropriate string
  if (yearsElapsed > 0) return `${yearsElapsed} year${yearsElapsed > 1 ? 's' : ''} ago`;
  if (monthsElapsed > 0) return `${monthsElapsed} month${monthsElapsed > 1 ? 's' : ''} ago`;
  if (daysElapsed > 0) return `${daysElapsed} day${daysElapsed > 1 ? 's' : ''} ago`;
  if (hoursElapsed > 0) return `${hoursElapsed} hour${hoursElapsed > 1 ? 's' : ''} ago`;
  if (minutesElapsed > 0) return `${minutesElapsed} minute${minutesElapsed > 1 ? 's' : ''} ago`;
  return `${secondsElapsed} second${secondsElapsed !== 1 ? 's' : ''} ago`;
}


  // Only show content if user is authenticated and is a new user
  if (user && claims === 111) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader
            className="text-center pb-6"
            title={
              <div className="">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center mb-4 relative">
                  <Clock className="h-8 w-8 text-white" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full animate-pulse">
                    <Bell className="h-4 w-4 text-white m-1" />
                  </div>
                </div>
                <p className="text-2xl text-gray-900">
                  Account Pending Approval
                </p>
                <p className="text-base">
                  Your account has been created successfully and is currently
                  under review
                </p>
              </div>
            }
          ></CardHeader>

          <CardContent className="space-y-6">
            {/* Main Status */}
            <div className="text-center space-y-4">
              <Alert
                className="flex w-full mx-auto items-center  justify-center gap-5 border-amber-200 bg-amber-50"
                icon={<Clock fontSize="inherit" color="rgb(146 64 14)" />}
              >
                <div className="text-amber-800  w-full">
                  <strong>Status:</strong> Waiting for administrator approval
                </div>
              </Alert>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Account Created:</span>
                  <span className="font-medium text-gray-900">
                    {formatTimeElapsed(user.createdAt._seconds)} 
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-blue-600">
                    {user.email}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Account Type:</span>
                  <span className="font-medium text-gray-900">
                    Standard User
                  </span>
                </div>
              </div>
            </div>

            {/* Back to Login */}
            <div className="pt-4 border-t border-gray-200">
              <Button variant="contained" size="sm" asChild className="w-full flex items-center justify-center" onClick={() => window.location.reload()}>
                  <IoRefreshCircleOutline  className="mr-2 h-6 w-6" />
                  Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show nothing while loading or if redirecting
  return null;
};

export default NewUserPage;
