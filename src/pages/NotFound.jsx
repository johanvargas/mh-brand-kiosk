import { React } from "react";

//<Route path="*" element={<div><h1>404 - Page Not Found</h1><p>The page you're looking for doesn't exist.</p></div>} />
export default function NotFound() {
  return (
    <div>
      <h1 className="text-sm">404 Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
}
