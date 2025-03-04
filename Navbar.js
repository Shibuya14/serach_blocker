import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/options">オプション</Link></li>
        <li><Link to="/settings">設定</Link></li>
        <li><Link to="/others">その他</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
