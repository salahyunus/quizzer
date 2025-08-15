"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export default function CrispChat() {
  useEffect(() => {
    Crisp.configure("c138f867-61c9-42b4-b94b-d1d843a92524");
  }, []);

  return null;
}
