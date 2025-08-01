import { Button, Card, CardContent, Input } from "@mui/material";
import { ArrowLeft, HelpCircle, Home, Mail, Search } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center space-y-8">
          {/* Animated 404 Visual */}
          <div className="relative">
            <div
              className=" text-[12rem] md:text-[16rem] font-black text-transparent 
            bg-clip-text bg-gradient-to-r from-violet-400 via-purple-500 to-pink-500 leading-none 
            select-none animate-bounce"
            >
              404
              <div className="absolute top-[20px] right-[230px] w-14 h-14 bg-pink-400 rounded-full animate-ping"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
               
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Oops! Page Not Found
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The page you're looking for seems to have wandered off into the
              digital void. Don't worry though, we'll help you find your way
              back!
            </p>
          </div>

          {/* Prominent Go Back Button */}
          <div className="flex justify-center">
            <Button
              size="xl"
              className="h-14 px-10 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600
               hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => window.history.back()}

              sx={{
                padding: "10px 30px",
              }}
            >
              <ArrowLeft className="mr-3 h-6 w-6 text-white" />
              <span className="text-white">
              Go Back

              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
